import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Call OpenAI API with financial health context
 */
export const callOpenAI = async (prompt, maxTokens = 500) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful financial advisor. Provide clear, actionable advice.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[OpenAI Error]', error);
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error('[OpenAI Service Error]', err);
    throw err;
  }
};

/**
 * Generate AI insights from health score metrics
 */
export const generateInsights = async (metrics) => {
  const prompt = `
Analyze this financial summary and provide 3-4 actionable insights in JSON format:

Score: ${metrics.score}/100
Metrics:
- Expense Control: ${metrics.breakdown.expenseControl}/25
- Savings Rate: ${metrics.breakdown.savingsRate}/20
- Category Balance: ${metrics.breakdown.categoryBalance}/20
- Trend Analysis: ${metrics.breakdown.trendAnalysis}/20 (Monthly change: ${metrics.metrics.monthlyTrend}%)
- Budget Adherence: ${metrics.breakdown.budgetAdherence}/15 (${metrics.metrics.budgetAdherencePercent}%)

Total Expense: $${metrics.metrics.totalExpense}
Budget Limit: $${metrics.metrics.budgetLimit}
Savings: $${metrics.metrics.savings}
Income: $${metrics.metrics.income}

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "insights": [
    {"category": "positive", "title": "...", "text": "..."},
    {"category": "warning", "title": "...", "text": "..."},
    {"category": "action", "title": "...", "text": "..."}
  ]
}
`;

  try {
    const response = await callOpenAI(prompt, 400);
    // Handle potential JSON parsing issues
    let insights;
    try {
      insights = JSON.parse(response);
    } catch (parseErr) {
      console.warn('[JSON Parse Warning]', parseErr);
      // Try to extract JSON from response if it has markdown code blocks
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw parseErr;
      }
    }
    return insights.insights || [];
  } catch (err) {
    console.error('[Insights Generation Error]', err);
    // Return fallback insights if AI fails
    return [
      {
        category: 'action',
        title: 'Review Your Budget',
        text: 'Consider reviewing your spending to improve your health score.',
      },
    ];
  }
};

/**
 * Chat with AI about financial health
 */
export const chatAboutFinances = async (userMessage, scoreContext) => {
  const topCategory = scoreContext.topCategory || 'General';
  const topCategoryPercent = scoreContext.topCategoryPercent || 0;
  
  const prompt = `
You are a friendly financial advisor. User's financial health score is ${scoreContext.score}/100.

Current financial context:
- Total monthly expense: $${scoreContext.totalExpense}
- Budget adherence: ${scoreContext.budgetAdherencePercent}%
- Top spending category: ${topCategory} (${topCategoryPercent}%)
- Monthly trend: ${scoreContext.monthlyTrend > 0 ? '+' : ''}${scoreContext.monthlyTrend}%
- Savings rate: ${scoreContext.savingsPercent || 0}%

User's question: "${userMessage}"

Provide practical, concise advice in max 250 tokens. Be encouraging but honest. Give specific, actionable recommendations.
`;

  try {
    const response = await callOpenAI(prompt, 300);
    return response;
  } catch (err) {
    console.error('[Chat Error]', err);
    throw err;
  }
};
