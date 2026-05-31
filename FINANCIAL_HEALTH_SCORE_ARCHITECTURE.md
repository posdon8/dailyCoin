# 💰 Financial Health Score - Architecture & Implementation Guide

## 📊 Tổng Quan

Một hệ thống điểm sức khỏe tài chính với AI phân tích, cache thông minh, và gamification.

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend                               │
├─────────────────────────────────────────────────────────┤
│  HealthScoreDashboard                                   │
│  ├─ Score Card (1-100 điểm)                            │
│  ├─ Insights Panel (3-5 gợi ý AI)                      │
│  ├─ Chat Box (hỏi câu hỏi về tài chính)               │
│  └─ Cache Manager (localStorage)                       │
│                                                         │
│  Redux/Context Store                                    │
│  ├─ healthScore (điểm hiện tại)                       │
│  ├─ lastCalculated (timestamp)                         │
│  ├─ insights (mảng insights)                          │
│  └─ cache (lưu kết quả)                               │
└─────────────────────────────────────────────────────────┘
                       ↕ (API calls)
┌─────────────────────────────────────────────────────────┐
│                   Backend                                │
├─────────────────────────────────────────────────────────┤
│  Routes:                                                │
│  POST /api/health/calculate        - Tính điểm        │
│  GET /api/health/score             - Lấy điểm        │
│  POST /api/health/chat             - Chat hỏi         │
│  POST /api/health/daily-check      - Tự động check    │
│                                                         │
│  Controllers:                                           │
│  ├─ calculateHealthScore()                            │
│  │  ├─ Fetch expenses + budgets                       │
│  │  ├─ Call Gemini API (1 lần/ngày)                 │
│  │  └─ Save to DB + cache                            │
│  │                                                     │
│  ├─ getHealthScore()                                 │
│  │  └─ Return cached score nếu còn hợp lệ           │
│  │                                                     │
│  └─ chatWithAI()                                      │
│     ├─ Lấy score summary (không raw data)            │
│     ├─ Send to Gemini with context                   │
│     └─ Return max 300 tokens                         │
│                                                         │
│  Models:                                               │
│  └─ HealthScore {                                      │
│      userId, score, insights, metadata,               │
│      calculatedAt, expiresAt                          │
│     }                                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### 1. **Financial Health Score (1-100)**

**Metrics tính toán:**
```javascript
{
  expenseControl: 25,      // % ngân sách sử dụng
  savingsRate: 20,         // % tiết kiệm so với income
  categoryBalance: 20,     // Đa dạng chi tiêu
  trendAnalysis: 20,       // Chi tiêu tăng/giảm
  budgetAdherence: 15      // Tuân thủ budget
}

totalScore = sum(all metrics) / 5  // 0-100
```

**Công thức ví dụ:**
```javascript
// Expense Control (25 points)
expenseControl = Math.min(25, (totalExpense / budgetLimit) * 25)

// Savings Rate (20 points)  
savingsRate = Math.min(20, (savings / income) * 20)

// Category Balance (20 points)
// Penalize nếu quá lệch một category
categoryBalance = 20 - (maxCategoryPercent - avgCategoryPercent) * 10

// Trend Analysis (20 points)
// Compare với tháng trước
trendScore = thisMonth < lastMonth ? 20 : Math.max(0, 20 - (increase % * 2))

// Budget Adherence (15 points)
budgetAdherence = (categoriesUnderBudget / totalCategories) * 15
```

### 2. **Cache Strategy**

```javascript
// localStorage structure
{
  healthScore: {
    score: 75,
    insights: ["...", "...", "..."],
    breakdown: {...},
    calculatedAt: "2024-05-28T10:00:00Z",
    expiresAt: "2024-05-29T10:00:00Z"  // 24 hours
  }
}

// Check before API call:
if (cache && cache.expiresAt > now) {
  return cache;  // Use cached
} else {
  calculate();   // Call API
}
```

### 3. **Insights Generation**

**Tự động AI insights (1 API call/ngày):**
```javascript
const prompt = `
Analyze this financial summary and provide 3-4 actionable insights:

Score: 75/100
Metrics:
- Expense Control: 20/25
- Savings Rate: 18/20
- Category Balance: 19/20
- Trend: -5% from last month
- Budget Adherence: 88%

Provide JSON:
{
  "insights": [
    {"category": "positive", "text": "..."},
    {"category": "warning", "text": "..."},
    {"category": "action", "text": "..."}
  ]
}
`;
```

### 4. **Chat with AI (User-triggered)**

**Context-aware chat:**
```javascript
const chatPrompt = `
You are a financial advisor. User's financial health score is 75/100.

Current context:
- Expense trend: +12% vs last month
- Budget adherence: 88%
- Highest spending: Food (35%)

User question: "${userMessage}"

Respond in max 300 tokens with actionable advice.
`;
```

---

## 📁 File Structure

```
backend/
├─ models/
│  └─ HealthScore.js       (NEW)
├─ controllers/
│  └─ healthController.js   (NEW)
├─ routes/
│  └─ healthRoutes.js       (NEW)
├─ services/
│  ├─ geminiService.js      (NEW - Gemini API wrapper)
│  └─ cacheService.js       (NEW - cache management)
└─ middleware/
   └─ healthCache.js        (NEW - middleware cache)

frontend/
├─ components/
│  ├─ HealthScore/
│  │  ├─ HealthScoreDashboard.jsx     (NEW)
│  │  ├─ ScoreCard.jsx                (NEW)
│  │  ├─ InsightsPanel.jsx            (NEW)
│  │  └─ FinancialChatBox.jsx         (NEW)
├─ hooks/
│  └─ useHealthScore.js              (NEW)
├─ services/
│  └─ healthApi.js                   (NEW)
└─ context/
   └─ HealthScoreContext.jsx         (NEW)
```

---

## 🔌 API Endpoints

### 1. Calculate Health Score (Backend triggered)
```
POST /api/health/calculate
Headers: { Authorization: Bearer token }
Body: {} (empty, uses user's data)

Response:
{
  success: true,
  data: {
    score: 75,
    breakdown: {
      expenseControl: 20,
      savingsRate: 18,
      categoryBalance: 19,
      trendAnalysis: 12,
      budgetAdherence: 13
    },
    insights: [
      {
        category: "positive",
        title: "Good expense control",
        text: "You stayed within 88% of your budget."
      },
      ...
    ],
    calculatedAt: "2024-05-28T10:00:00Z"
  }
}
```

### 2. Get Health Score (from cache)
```
GET /api/health/score
Headers: { Authorization: Bearer token }

Response:
{
  success: true,
  data: {
    score: 75,
    isFromCache: true,
    expiresAt: "2024-05-29T10:00:00Z",
    breakdown: {...}
  }
}
```

### 3. Chat with AI
```
POST /api/health/chat
Headers: { Authorization: Bearer token }
Body: {
  message: "How can I reduce my spending?"
}

Response:
{
  success: true,
  data: {
    response: "Based on your 75/100 health score, here are 3 ways...",
    tokensUsed: 156,
    relatedMetrics: ["savingsRate", "categoryBalance"]
  }
}
```

### 4. Daily Auto-Check (Cron job)
```
POST /api/health/daily-check (internal)
// Runs at 10 AM daily for each user
// Calculates score if > 24h since last calculation
// Sends notification if score drops > 5 points
```

---

## 🎮 Gamification Features

### Score Badges 🏆
```javascript
badges = {
  "100-Perfect": score === 100,
  "Expert (90+)": score >= 90,
  "Responsible (75+)": score >= 75,
  "Developing (50+)": score >= 50,
  "Beginner": score >= 0
}
```

### Progress Tracking 📈
```javascript
{
  currentScore: 75,
  lastWeekAvg: 72,
  trend: "↑ +3 points",
  goalScore: 85,
  daysToGoal: 14  // estimate
}
```

### Daily Streak 🔥
```javascript
// Track consecutive days of checking health score
streakCount = 5;  // "5 days in a row!"
```

---

## 💾 Database Model

```javascript
// HealthScore.js
const HealthScoreSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  
  breakdown: {
    expenseControl: Number,
    savingsRate: Number,
    categoryBalance: Number,
    trendAnalysis: Number,
    budgetAdherence: Number
  },
  
  insights: [{
    category: String,  // "positive", "warning", "action"
    title: String,
    text: String,
    metric: String     // related metric
  }],
  
  metrics: {
    totalExpense: Number,
    budgetLimit: Number,
    savings: Number,
    income: Number,
    categoryCount: Number,
    maxCategoryPercent: Number,
    budgetAdherencePercent: Number
  },
  
  calculatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expiresAt: Date,  // TTL index for cache
  
  metadata: {
    dataSource: String,  // "expenses", "budgets", "wallets"
    period: String,      // "monthly", "weekly"
    lastImprovement: {
      metric: String,
      previousValue: Number,
      currentValue: Number,
      change: Number,
      date: Date
    }
  }
},
{
  timestamps: true,
  indexes: [
    { userId: 1, calculatedAt: -1 },  // Get latest score
    { expiresAt: 1 }                    // TTL index
  ]
});
```

---

## 🚀 Implementation Steps

### Phase 1: Backend Setup
1. ✅ Create HealthScore model
2. ✅ Create healthController with calculateScore logic
3. ✅ Create geminiService for API calls
4. ✅ Setup routes (/calculate, /score, /chat)
5. ✅ Add authentication middleware

### Phase 2: Frontend Components
1. ✅ Create HealthScoreDashboard component
2. ✅ Create ScoreCard with animations
3. ✅ Create InsightsPanel
4. ✅ Create ChatBox component
5. ✅ Setup useHealthScore hook

### Phase 3: Integration
1. ✅ Connect frontend to API
2. ✅ Implement localStorage cache
3. ✅ Add notifications
4. ✅ Test end-to-end

### Phase 4: Optimization
1. ✅ Implement cache expiration
2. ✅ Add error handling
3. ✅ Optimize API calls
4. ✅ Add analytics

---

## 💡 Cost Optimization

| Strategy | Saving |
|----------|--------|
| Cache 24h | -95% API calls (1/day instead of per-request) |
| Summary data | -70% tokens (use aggregated data, not raw) |
| Batch calculations | -30% per user (calc at 10 AM, not random) |
| Local LLM option | -80% cost (if using local model) |

**Estimated cost/user/month:**
- With optimization: ~$0.05 - $0.10
- Without optimization: ~$1.50 - $2.00

---

## 🔐 Privacy & Security

```javascript
// Only store aggregated metrics, NOT transactions
metrics: {
  totalExpense: 2500,      ✅
  categoryBreakdown: {...} ✅
  // NOT: raw transactions  ❌
}

// Cache only on user device
localStorage (frontend)    ✅
NOT on server             ❌

// Never share raw data with API
sendToAI({
  score: 75,              ✅
  breakdown: {...},       ✅
  // NOT: individual expenses ❌
})
```

---

## 📱 UI/UX Layout

```
┌─────────────────────────────────────┐
│     💰 Financial Health Score       │
├─────────────────────────────────────┤
│                                     │
│         ┌───────────────┐           │
│         │      75       │           │
│         │    /100       │           │  ← Score Card
│         │               │           │
│         │   ↑ +3 points │           │
│         └───────────────┘           │
│                                     │
├─────────────────────────────────────┤
│  📈 YOUR INSIGHTS                   │
│                                     │
│  ✅ Expense Control: Good           │
│     You stayed within 88% budget    │
│                                     │
│  ⚠️  Spending Trend: +12%           │
│     Consider cutting Food (35%)     │
│                                     │
│  💡 Action Item:                    │
│     Set goal to reach 85 by Jun 15  │
│                                     │
├─────────────────────────────────────┤
│  💬 Ask me about your finances      │
│                                     │
│  ┌────────────────────────────────┐ │
│  │ How can I improve my score? ... │ │  ← Chat input
│  └────────────────────────────────┘ │
│                                     │
│  AI Response:                       │
│  "Based on your 75/100 score..."   │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 Next Steps

Bạn muốn tôi implement:
1. **Backend trước** - Setup models + APIs?
2. **Frontend components** - Dashboard + Chat?
3. **Gemini integration** - Service + prompts?
4. **Full implementation** - Cả 3 cùng một lúc?

Bắt đầu với cái nào? 🚀
