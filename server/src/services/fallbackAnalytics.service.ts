type MoodDataItem = {
  date: string | Date;
  emoji: string;
  score: number;
  note?: string;
};

const getRiskLevel = (avgScore: number, lowMoodRatio: number, negativeRatio: number): "LOW" | "MODERATE" | "HIGH" => {
  if (avgScore <= 2 || lowMoodRatio >= 0.6 || negativeRatio >= 0.7) return "HIGH";
  if (avgScore <= 3 || lowMoodRatio >= 0.35 || negativeRatio >= 0.45) return "MODERATE";
  return "LOW";
};

const getTrendInsight = (trend: string): string => {
  if (trend === "improving") return "Mood signals improved in the second half of the week.";
  if (trend === "declining") return "Mood dropped in the second half of the week and may need extra support.";
  return "Mood levels were relatively stable across the week.";
};

const getTriggerCategory = (keyword: string): "Relationship" | "Work" | "Health" | "Social" | "Other" | "Positive" => {
  const k = keyword.toLowerCase();
  if (["exercise", "walk", "workout", "meditation", "music", "friends", "family time", "good sleep"].some((w) => k.includes(w))) return "Positive";
  if (["breakup", "fight", "argue", "family", "friend", "relationship"].some((w) => k.includes(w))) return "Relationship";
  if (["exam", "deadline", "project", "study", "assignment", "work"].some((w) => k.includes(w))) return "Work";
  if (["sleep", "tired", "sick", "health", "panic", "anxiety"].some((w) => k.includes(w))) return "Health";
  if (["party", "event", "social", "crowd"].some((w) => k.includes(w))) return "Social";
  return "Other";
};

export const buildFallbackAnalysis = (
  moodData: MoodDataItem[],
  analytics?: Record<string, any>
) => {
  const averageMood = Number(analytics?.averageMoodScore || 0);
  const trend = String(analytics?.moodTrend || "stable");
  const lowMoodRatio = Number(analytics?.riskSignals?.lowMoodRatio || 0);
  const negativeRatio = Number(analytics?.riskSignals?.negativeNoteRatio || 0);
  const topKeywords: string[] = Array.isArray(analytics?.topKeywords) ? analytics.topKeywords : [];
  const dailyStats = Array.isArray(analytics?.dailyStats) ? analytics.dailyStats : [];

  const riskLevel = getRiskLevel(averageMood, lowMoodRatio, negativeRatio);
  const urgentAction = riskLevel === "HIGH" ? "true" : "false";

  const triggers = topKeywords.slice(0, 4).map((keyword) => ({
    trigger: keyword,
    category: getTriggerCategory(keyword),
    frequency: "Recurring in notes",
    impact: getTriggerCategory(keyword) === 'Positive' ? 'high positive' : (lowMoodRatio >= 0.5 ? "high" : "medium")
  }));

  const positiveHighlights = moodData
    .filter((m) => m.score >= 4)
    .slice(-3)
    .map((m) => `Positive check-in at ${new Date(m.date).toLocaleString()}`);

  return {
    summary: `Your weekly mood average is ${averageMood.toFixed(1)}/5 with a ${trend} trend. The report highlights actionable patterns from your recent check-ins.`,
    innovationHighlight: "This report uses daily average and min/max ranges to capture micro-mood fluctuations from multiple daily logs.",
    dailyStats: dailyStats.map((d: any) => ({
      date: String(d.date || d.dayLabel || ''),
      avgScore: Number(d.avgScore || 0),
      dominantMood: String(d.dominantMood || 'Okay'),
      min: Number(d.min ?? 1),
      max: Number(d.max ?? 5)
    })),
    moodTrend: {
      direction: trend,
      insight: getTrendInsight(trend)
    },
    identifiedTriggers: triggers,
    patterns: [
      "Mood reflects multiple check-ins per day, giving finer emotional patterns.",
      trend === "declining" ? "Lower scores appeared more frequently later in the week." : "No severe downward drift detected."
    ],
    emotionalThemes: [
      lowMoodRatio >= 0.4 ? "Stress/Emotional Load" : "Emotional Balance",
      negativeRatio >= 0.5 ? "Negative Thought Pressure" : "Resilience"
    ],
    recommendations: [
      {
        action: "Do a 5-minute reflection after each low mood check-in",
        rationale: "Short reflection helps identify triggers while memory is fresh.",
        difficulty: "easy"
      },
      {
        action: "Drink water and stretch for two minutes",
        rationale: "Quick body reset can reduce emotional pressure.",
        difficulty: "easy"
      },
      {
        action: "Message one trusted friend",
        rationale: "Small social contact often lifts mood quickly.",
        difficulty: "easy"
      },
      {
        action: "Add one grounding action during difficult time blocks",
        rationale: "Pairing coping actions with risky periods reduces emotional spikes.",
        difficulty: "medium"
      },
      {
        action: "Write a short evening mood journal",
        rationale: "Tracking details improves self-awareness and control.",
        difficulty: "medium"
      },
      {
        action: "Take a 10-minute walk after stress",
        rationale: "Movement helps release mental tension effectively.",
        difficulty: "medium"
      },
      {
        action: "Repeat routines linked to higher scores for 7 days",
        rationale: "Reinforcing positive behaviors supports mood stability.",
        difficulty: "difficult"
      },
      {
        action: "Set a fixed sleep routine for one week",
        rationale: "Consistent sleep strongly improves emotional regulation.",
        difficulty: "difficult"
      },
      {
        action: "Plan weekly check-ins with an accountability buddy",
        rationale: "Long-term support builds stronger coping habits.",
        difficulty: "difficult"
      }
    ],
    riskAssessment: {
      level: riskLevel,
      concerns: riskLevel === "HIGH"
        ? ["High ratio of low mood entries", "Repeated negative note sentiment"]
        : ["Continue monitoring emotional fluctuations"],
      urgentAction
    }, 
    analysisSource: 'fallback-local',
    positiveHighlights: positiveHighlights.length > 0 ? positiveHighlights : ["No major positive spikes detected yet, continue regular check-ins."]
  };
};
