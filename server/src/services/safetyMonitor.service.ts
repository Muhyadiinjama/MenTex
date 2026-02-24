import https from 'https';

interface SafetyReviewInput {
  logs: Array<{ score: number; note?: string }>;
  reportText: string;
}

interface SafetyReviewResult {
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
  provider: 'openrouter' | 'openai' | 'local-rules';
  model: string;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const containsAny = (text: string, phrases: string[]): boolean => {
  const normalized = text.toLowerCase();
  return phrases.some((p) => normalized.includes(p));
};

const localSafetyCheck = ({ logs, reportText }: SafetyReviewInput): SafetyReviewResult => {
  const reportLower = reportText.toLowerCase();
  const allNotes = logs.map((l) => l.note || '').join(' ').toLowerCase();

  const harmfulAdvice = [
    'hurt yourself',
    'self harm',
    'stop eating',
    'isolate yourself',
    'don\'t talk to anyone',
    'skip medication',
    'drink alcohol to cope'
  ];

  const diagnosisClaims = [
    'you have clinical depression',
    'you have bipolar disorder',
    'you are diagnosed with',
    'you definitely have'
  ];

  const crisisSignals = [
    'kill myself',
    'end my life',
    'suicide',
    'self harm',
    'want to die'
  ];

  if (containsAny(reportLower, harmfulAdvice)) {
    return { status: 'REJECTED', reason: 'Harmful advice detected in generated report.', provider: 'local-rules', model: 'rule-based' };
  }

  if (containsAny(reportLower, diagnosisClaims)) {
    return { status: 'REJECTED', reason: 'Medical diagnosis claim detected in generated report.', provider: 'local-rules', model: 'rule-based' };
  }

  if (containsAny(allNotes, crisisSignals)) {
    return { status: 'REJECTED', reason: 'Crisis signals found in user logs; trigger Help protocol.', provider: 'local-rules', model: 'rule-based' };
  }

  return { status: 'APPROVED', provider: 'local-rules', model: 'rule-based' };
};

const callOpenAISafety = async (payload: SafetyReviewInput): Promise<SafetyReviewResult> => {
  if (!OPENAI_API_KEY && !OPENROUTER_API_KEY) {
    return localSafetyCheck(payload);
  }

  const useOpenRouter = Boolean(OPENROUTER_API_KEY);
  const endpoint = useOpenRouter
    ? (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions')
    : 'https://api.openai.com/v1/chat/completions';
  const model = useOpenRouter
    ? (process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini')
    : (process.env.OPENAI_SAFETY_MODEL || 'gpt-4o-mini');

  const body = JSON.stringify({
    model,
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: [
          'You are a Safety Monitor for a mental health AI.',
          'Review the generated report for harmful advice, medical diagnosis claims, and crisis signals.',
          'Response format:',
          '- If safe: APPROVED',
          '- If unsafe: REJECTED: <reason>'
        ].join('\n')
      },
      {
        role: 'user',
        content: JSON.stringify({
          logs: payload.logs,
          generatedReport: payload.reportText
        })
      }
    ]
  });

  const responseText = await new Promise<string>((resolve, reject) => {
    const url = new URL(endpoint);
    const req = https.request({
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || undefined,
      path: `${url.pathname}${url.search}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY || OPENAI_API_KEY}`,
        ...(useOpenRouter ? { 'HTTP-Referer': process.env.OPENROUTER_REFERER || 'http://localhost:5173' } : {}),
        ...(useOpenRouter ? { 'X-Title': process.env.OPENROUTER_TITLE || 'MenTex Safety Monitor' } : {}),
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (!res.statusCode || res.statusCode >= 400) {
            return reject(new Error(`OpenAI safety API failed: ${res.statusCode} ${data}`));
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed?.choices?.[0]?.message?.content || '';
            resolve(String(content).trim());
          } catch (err) {
            reject(err);
          }
        });
      });

    req.on('error', reject);
    req.write(body);
    req.end();
  });

  if (responseText.toUpperCase().startsWith('APPROVED')) {
    return { status: 'APPROVED', provider: useOpenRouter ? 'openrouter' : 'openai', model };
  }
  if (responseText.toUpperCase().startsWith('REJECTED')) {
    const reason = responseText.includes(':') ? responseText.split(':').slice(1).join(':').trim() : 'Safety monitor rejected report.';
    return { status: 'REJECTED', reason, provider: useOpenRouter ? 'openrouter' : 'openai', model };
  }

  // If model output is malformed, fail-safe to local rules.
  return localSafetyCheck(payload);
};

export const reviewGeneratedReportSafety = async (input: SafetyReviewInput): Promise<SafetyReviewResult> => {
  try {
    return await callOpenAISafety(input);
  } catch (error) {
    console.error('Safety monitor error, falling back to local safety check:', error);
    return localSafetyCheck(input);
  }
};
