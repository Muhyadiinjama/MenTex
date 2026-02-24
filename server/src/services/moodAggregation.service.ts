import { Mood } from '../models/Mood';

const NEGATIVE_KEYWORDS = [
  'sad', 'anxious', 'anxiety', 'stress', 'stressed', 'panic', 'overwhelmed', 'tired',
  'alone', 'lonely', 'hopeless', 'worthless', 'breakup', 'fight', 'argue', 'exam',
  'deadline', 'fail', 'failure', 'angry', 'cry', 'depressed'
];

const POSITIVE_KEYWORDS = [
  'happy', 'calm', 'grateful', 'good', 'great', 'better', 'relaxed', 'proud', 'progress',
  'support', 'friend', 'family', 'exercise', 'walk', 'sleep', 'productive', 'focus', 'peace'
];

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'to', 'for', 'of', 'on', 'in', 'at', 'is', 'it', 'this', 'that',
  'i', 'im', 'ive', 'my', 'me', 'we', 'our', 'you', 'your', 'today', 'yesterday', 'because', 'with'
]);

const round = (value: number, digits: number = 2): number => {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
};

const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const getTimeBlock = (date: Date): 'night' | 'morning' | 'afternoon' | 'evening' => {
  const hour = date.getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const scoreToMoodLabel = (score: number): string => {
  if (score >= 5) return 'Great';
  if (score >= 4) return 'Okay';
  if (score >= 3) return 'Tired';
  if (score >= 2) return 'Anxious';
  return 'Sad';
};

const getTopKeywords = (notes: string[]): string[] => {
  const freq: Record<string, number> = {};
  for (const note of notes) {
    const tokens = note
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token && token.length > 2 && !STOPWORDS.has(token));

    for (const token of tokens) {
      freq[token] = (freq[token] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([token]) => token);
};

export const getAggregatedMoodData = async (userId: string, startDate: Date, endDate: Date) => {
  const moods = await Mood.find({
    userId,
    timestamp: { $gte: startDate, $lte: endDate }
  }).sort({ timestamp: 1 });

  const scores = moods.map((m) => m.moodScore);
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const averageMoodScore = moods.length > 0 ? totalScore / moods.length : 0;

  let moodTrend = 'stable';
  if (moods.length >= 2) {
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const avgFirst = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    if (avgSecond > avgFirst + 0.4) moodTrend = 'improving';
    else if (avgSecond < avgFirst - 0.4) moodTrend = 'declining';
  }

  const variance = moods.length > 0
    ? scores.reduce((sum, score) => sum + Math.pow(score - averageMoodScore, 2), 0) / moods.length
    : 0;
  const scoreVolatility = Math.sqrt(variance);

  const emojiCounts: Record<string, number> = {};
  const weekdayBuckets: Record<string, { total: number; count: number }> = {};
  const timeBuckets: Record<'night' | 'morning' | 'afternoon' | 'evening', { total: number; count: number }> = {
    night: { total: 0, count: 0 },
    morning: { total: 0, count: 0 },
    afternoon: { total: 0, count: 0 },
    evening: { total: 0, count: 0 }
  };

  for (const mood of moods) {
    emojiCounts[mood.emoji] = (emojiCounts[mood.emoji] || 0) + 1;

    const day = getDayName(mood.timestamp);
    if (!weekdayBuckets[day]) weekdayBuckets[day] = { total: 0, count: 0 };
    weekdayBuckets[day].total += mood.moodScore;
    weekdayBuckets[day].count += 1;

    const block = getTimeBlock(mood.timestamp);
    timeBuckets[block].total += mood.moodScore;
    timeBuckets[block].count += 1;
  }

  const dominantMood = Object.keys(emojiCounts).reduce((a, b) => (emojiCounts[a] > emojiCounts[b] ? a : b), '😐');

  const weekdayPattern = Object.entries(weekdayBuckets).map(([day, stats]) => ({
    day,
    averageScore: round(stats.total / stats.count, 2),
    entries: stats.count
  }));

  const timeOfDayPattern = Object.entries(timeBuckets).map(([timeBlock, stats]) => ({
    timeBlock,
    averageScore: stats.count > 0 ? round(stats.total / stats.count, 2) : 0,
    entries: stats.count
  }));

  const notes = moods
    .map((m) => (m.note || '').trim())
    .filter((note) => note.length > 0);

  let negativeNoteCount = 0;
  let positiveNoteCount = 0;

  for (const note of notes) {
    const normalized = note.toLowerCase();
    const hasNegative = NEGATIVE_KEYWORDS.some((keyword) => normalized.includes(keyword));
    const hasPositive = POSITIVE_KEYWORDS.some((keyword) => normalized.includes(keyword));
    if (hasNegative) negativeNoteCount += 1;
    if (hasPositive) positiveNoteCount += 1;
  }

  const noteSentiment = {
    negative: negativeNoteCount,
    positive: positiveNoteCount,
    neutral: Math.max(notes.length - Math.max(negativeNoteCount, positiveNoteCount), 0)
  };

  const lowMoodEntries = moods.filter((m) => m.moodScore <= 2).length;
  const riskSignals = {
    lowMoodRatio: moods.length > 0 ? round(lowMoodEntries / moods.length, 2) : 0,
    negativeNoteRatio: notes.length > 0 ? round(negativeNoteCount / notes.length, 2) : 0,
    volatility: round(scoreVolatility, 2)
  };

  const dailyBuckets: Record<string, { scores: number[]; emojis: string[]; date: Date }> = {};
  for (const mood of moods) {
    const dayKey = mood.timestamp.toISOString().slice(0, 10);
    if (!dailyBuckets[dayKey]) {
      dailyBuckets[dayKey] = { scores: [], emojis: [], date: mood.timestamp };
    }
    dailyBuckets[dayKey].scores.push(mood.moodScore);
    dailyBuckets[dayKey].emojis.push(mood.emoji);
  }

  const dailyStats = Object.entries(dailyBuckets)
    .map(([dateKey, bucket]) => {
      const avgScore = bucket.scores.reduce((s, v) => s + v, 0) / bucket.scores.length;
      const min = Math.min(...bucket.scores);
      const max = Math.max(...bucket.scores);
      const modeMap: Record<string, number> = {};
      bucket.scores.forEach((s) => {
        const label = scoreToMoodLabel(s);
        modeMap[label] = (modeMap[label] || 0) + 1;
      });
      const dominantMood = Object.keys(modeMap).reduce(
        (best, current) => (modeMap[current] > (modeMap[best] || 0) ? current : best),
        'Okay'
      );

      return {
        date: dateKey,
        dayLabel: new Date(`${dateKey}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short' }),
        avgScore: round(avgScore, 2),
        dominantMood,
        min,
        max,
        entries: bucket.scores.length
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    moodData: moods.map((m) => ({
      date: m.timestamp,
      emoji: m.emoji,
      score: m.moodScore,
      note: m.note
    })),
    analytics: {
      averageMoodScore: round(averageMoodScore, 2),
      moodTrend,
      dominantMood,
      totalEntries: moods.length,
      scoreVolatility: round(scoreVolatility, 2),
      weekdayPattern,
      timeOfDayPattern,
      noteSentiment,
      topKeywords: getTopKeywords(notes),
      riskSignals,
      dailyStats
    }
  };
};
