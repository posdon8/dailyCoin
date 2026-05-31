import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('[Gemini] API Key loaded:', GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT FOUND');

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

/**
 * Call Gemini API
 */
export const callGemini = async (systemPrompt, userPrompt, maxTokens = 500) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\n${userPrompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Gemini Error]', error);
      throw new Error(error.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error('[Gemini Service Error]', err);
    throw err;
  }
};

/**
 * Generate AI insights from health score metrics
 */
export const generateInsights = async (metrics) => {
  const systemPrompt = `You are a helpful financial advisor. Provide clear, actionable advice in Vietnamese.
Respond ONLY with valid JSON (no markdown, no code blocks).`;

  const userPrompt = `
Phân tích tóm tắt tài chính này và đưa ra 3-4 nhận xét hữu ích theo định dạng JSON:

Điểm: ${metrics.score}/100
Chỉ số:
- Kiểm soát chi tiêu: ${metrics.breakdown.expenseControl}/25
- Tỷ lệ tiết kiệm: ${metrics.breakdown.savingsRate}/20
- Cân bằng danh mục: ${metrics.breakdown.categoryBalance}/20
- Phân tích xu hướng: ${metrics.breakdown.trendAnalysis}/20 (Thay đổi hàng tháng: ${metrics.metrics.monthlyTrend}%)
- Tuân thủ ngân sách: ${metrics.breakdown.budgetAdherence}/15 (${metrics.metrics.budgetAdherencePercent}%)

Tổng chi tiêu: ${metrics.metrics.totalExpense.toLocaleString('vi-VN')} đ
Giới hạn ngân sách: ${metrics.metrics.budgetLimit.toLocaleString('vi-VN')} đ
Tiết kiệm: ${metrics.metrics.savings.toLocaleString('vi-VN')} đ

Trả lời CHỈ với JSON hợp lệ (không markdown, không code block):
{
  "insights": [
    {"category": "positive", "title": "...", "text": "..."},
    {"category": "warning", "title": "...", "text": "..."},
    {"category": "action", "title": "...", "text": "..."}
  ]
}
`;

  try {
    const response = await callGemini(systemPrompt, userPrompt, 600);
    let insights;
    try {
      insights = JSON.parse(response);
    } catch (parseErr) {
      console.warn('[JSON Parse Warning]', parseErr);
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
    return [
      {
        category: 'action',
        title: 'Xem lại ngân sách',
        text: 'Hãy xem lại chi tiêu của bạn để cải thiện điểm sức khỏe tài chính.',
      },
    ];
  }
};

/**
 * Chat with AI about financial health
 */
export const chatAboutFinances = async (userMessage, scoreContext) => {
  const topCategory = scoreContext.topCategory || 'Chung';
  const topCategoryPercent = scoreContext.topCategoryPercent || 0;

  const systemPrompt = `Bạn là một cố vấn tài chính thân thiện, trả lời bằng tiếng Việt.
Đưa ra lời khuyên thực tế, ngắn gọn và khuyến khích. Tối đa 3-4 câu.`;

  const userPrompt = `
Điểm sức khỏe tài chính của người dùng: ${scoreContext.score}/100

Thông tin tài chính hiện tại:
- Tổng chi tiêu tháng này: ${(scoreContext.totalExpense || 0).toLocaleString('vi-VN')} đ
- Tuân thủ ngân sách: ${scoreContext.budgetAdherencePercent}%
- Danh mục chi tiêu nhiều nhất: ${topCategory} (${topCategoryPercent}%)
- Xu hướng hàng tháng: ${scoreContext.monthlyTrend > 0 ? '+' : ''}${scoreContext.monthlyTrend}%
- Tỷ lệ tiết kiệm: ${scoreContext.savingsPercent || 0}%

Câu hỏi của người dùng: "${userMessage}"
`;

  try {
    const response = await callGemini(systemPrompt, userPrompt, 400);
    return response;
  } catch (err) {
    console.error('[Chat Error]', err);
    throw err;
  }
};