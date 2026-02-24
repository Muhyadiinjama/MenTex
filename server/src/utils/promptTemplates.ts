interface MoodDataItem {
    date: string | Date;
    emoji: string;
    score: number;
    note?: string;
}

export const generateWeeklyAnalysisPrompt = (moodData: MoodDataItem[], analytics?: Record<string, unknown>) => {
    const recentLogs = moodData
        .slice(-5)
        .map((m) => ({
            timestamp: new Date(m.date).toISOString(),
            moodScore: m.score,
            emoji: m.emoji,
            note: m.note || ''
        }));

    const mongoScores = recentLogs.map((log) => log.moodScore);
    const mongoTriggers = Array.isArray(analytics?.topKeywords) ? analytics?.topKeywords : [];

    const statsSummary = analytics ? JSON.stringify(analytics, null, 2) : '{}';

    return `
You are Mentax, a supportive peer for university students.
Analyze these logs from MongoDB with warm, clear language.
CRITICAL RULE: Use only simple words. No jargon like "volatility" or "sentiment".

Input Data:
Logs: ${JSON.stringify(recentLogs, null, 2)}
Mood Scores: ${JSON.stringify(mongoScores)}
Triggers: ${JSON.stringify(mongoTriggers)}

Additional Weekly Analytics Context:
${statsSummary}

Return STRICT JSON only with this shape:
{
  "DailyStats": [
    { "date": "Mon", "avgScore": 3.5, "dominantMood": "Sad", "min": 2, "max": 5 }
  ],
  "WeeklySummary": "1 short supportive sentence.",
  "InnovationHighlight": "1 sentence for judges about micro-mood fluctuations.",
  "Summary": "1 short sentence about how they felt overall.",
  "Patterns": [
    "Tip: ...",
    "Notice: ..."
  ],
  "Triggers": [
    {
      "trigger": "name",
      "explanation": "exactly five words",
      "impact": "Low | Medium | High"
    }
  ],
  "PositiveHighlights": [
    "timestamp + short positive moment",
    "timestamp + short positive moment",
    "timestamp + short positive moment"
  ],
  "Actions": {
    "Easy": [
      { "action": "simple action", "rationale": "short reason" },
      { "action": "simple action", "rationale": "short reason" },
      { "action": "simple action", "rationale": "short reason" }
    ],
    "Medium": [
      { "action": "5-10 minute action", "rationale": "short reason" },
      { "action": "5-10 minute action", "rationale": "short reason" },
      { "action": "5-10 minute action", "rationale": "short reason" }
    ],
    "Difficult": [
      { "action": "habit-building action", "rationale": "short reason" },
      { "action": "habit-building action", "rationale": "short reason" },
      { "action": "habit-building action", "rationale": "short reason" }
    ]
  }
}

Rules:
1. DailyStats must reflect daily average, dominant mood, min and max.
1. Summary must be exactly 1 sentence.
2. Patterns must have exactly 2 bullets and start with "Tip:" or "Notice:".
3. Triggers explanations must be exactly 5 words.
4. Actions must include exactly Easy, Medium, Difficult.
5. Each difficulty must include 3 to 5 action objects.
2. Use exactly 3 items for PositiveHighlights and include timestamps from logs.
6. Output JSON only, no markdown.
`;
};
