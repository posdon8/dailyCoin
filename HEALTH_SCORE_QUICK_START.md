# 🚀 Financial Health Score - Quick Start Guide

## 5-Minute Setup

### Step 1: Add OpenAI API Key (1 min)

**Get your API key:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key

**Add to `.env`:**
```bash
# backend/.env
OPENAI_API_KEY=sk-...paste-your-key-here...
```

### Step 2: Add Route to App.jsx (2 min)

**Open `src/App.jsx` and add import:**
```javascript
import HealthScorePage from './pages/HealthScorePage';
```

**In your routes section, add:**
```javascript
{
  currentPage === 'health' && <HealthScorePage />
}
```

**Add navigation button in header area:**
```javascript
<button 
  className="nav-tab"
  onClick={() => setCurrentPage('health')}
>
  💰 Financial Health
</button>
```

### Step 3: Restart Servers (2 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can see "💰 Financial Health" button in navigation
- [ ] Click button → Dashboard loads
- [ ] "Recalculate" button shows
- [ ] Chat bubble appears bottom-right ✅

---

## 🎬 First-Time Flow

1. **Open Financial Health page**
   - No score yet (expected)
   - Button shows "🔄 Recalculate Agora"

2. **Click Recalculate**
   - Takes ~3-5 seconds
   - Shows loading state
   - Calculates score (1-100)
   - AI generates insights

3. **See Your Score**
   - Display score with progress ring
   - Badge (⭐ Expert, 👍 Responsible, etc.)
   - 3-4 personalized insights
   - Metric breakdown

4. **Chat with AI**
   - Click 💬 bubble
   - Ask: "How can I improve my score?"
   - Get financial advice
   - Chat stays open for follow-up questions

---

## 💬 Example Interactions

### Question 1:
**You:** "My score is 65, how can I improve?"

**AI:** "Your main opportunity is in the Food category (38% of spending). 
Consider:
1. Set a realistic Food budget (target: 20-25%)
2. Meal prep on Sundays to reduce impulse purchases
3. Track coffee/drinks spending separately

This alone could boost your score to 75+."

### Question 2:
**You:** "Should I save more?"

**AI:** "Currently you're saving at 15% rate. With your expenses at $2,500/month, 
aim for 20%+ savings. Tips:
- Automate savings (pay yourself first)
- Find 3-5 subscriptions to cancel ($100+/month)
- Your Dining category (22%) can go to 15%

New goal: Save $500-600/month → 85+ score in 2 months."

---

## 📊 What Gets Calculated

**Your Financial Health Score considers:**

| Metric | Weight | What It Measures |
|--------|--------|------------------|
| Expense Control | 25% | Are you within budget? |
| Savings Rate | 20% | What % of income do you save? |
| Category Balance | 20% | Is spending diverse or lopsided? |
| Trend Analysis | 20% | Is spending going up/down? |
| Budget Adherence | 15% | How many categories are under budget? |

**Example Breakdown:**
- Expense Control: 20/25 (80%) = staying within budget ✅
- Savings Rate: 15/20 (75%) = saving 15% of income
- Category Balance: 18/20 (90%) = well-balanced
- Trend Analysis: 10/20 (50%) = spending up 15% vs last month ⚠️
- Budget Adherence: 12/15 (80%) = 80% of categories under budget

**Total Score: 75/100** 👍 Responsible

---

## 🔐 Privacy & Security

✅ **Never sends:**
- Individual transactions
- Bank account info
- Passwords or sensitive data

✅ **Only sends:**
- Total monthly spending
- Category breakdown (%)
- Budget usage (%)
- Historical trends

✅ **All processing:**
- Server-side (secure)
- No third-party logging
- Cache stored locally only

---

## ⚡ Performance

### Caching (Saves 95% of API calls):
- Calculation cached for 24 hours
- Subsequent loads instant (< 100ms)
- Auto-expires, recalculates daily

### Cost Optimization:
- ~1 API call per user per day
- ~$0.05-$0.10 per user/month
- Without optimization: ~$1-2 per user/month

---

## 🐛 Common Issues

### Issue: "500 error when clicking Recalculate"
**Solution:**
1. Check backend console for errors
2. Verify `OPENAI_API_KEY` is set in `.env`
3. Restart backend: `npm run dev`
4. Check user has expenses data in database

### Issue: Chat returns "Could not process"
**Solution:**
1. Check internet connection
2. Verify API key is valid
3. Check OpenAI API status: https://status.openai.com
4. Restart both servers

### Issue: Score not updating after 24h
**Solution:**
1. Clear browser cache: `localStorage.clear()`
2. Reload page
3. Click "Recalculate" button manually

### Issue: Insights say "No insights yet"
**Solution:**
1. Score must be calculated first
2. Click "Recalculate" button
3. Wait for AI to generate insights (~3 sec)

---

## 📱 Mobile Support

✅ **Responsive on all devices:**
- 💻 Desktop: Full dashboard
- 📱 Tablet: Adjusted layout
- 📱 Mobile: Stacked layout

**Mobile-specific:**
- Chat bubble repositioned
- Smaller fonts for readability
- Swipe-friendly buttons
- Touch-optimized inputs

---

## 🎨 Customization

### Change Score Goal (currently 85):
```javascript
// src/hooks/useHealthScore.js, line ~150
const goalScore = 85;  // Change this number
```

### Change Cache Duration (currently 24h):
```javascript
// src/hooks/useHealthScore.js, line ~30
const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
// Change to 7 days: 7 * 24 * 60 * 60 * 1000
```

### Change AI Model (currently gpt-3.5-turbo):
```javascript
// backend/services/openaiService.js, line ~16
model: 'gpt-4',  // More accurate, 10x more expensive
```

---

## 📞 Support

**If something breaks:**

1. Check error messages in console
2. Verify both servers are running
3. Clear cache: `localStorage.clear()`
4. Restart servers
5. Check internet connection
6. Verify OpenAI API key is valid

**Still stuck?**
→ Check backend logs: `npm run dev` output
→ Check browser DevTools: F12 → Console
→ Verify MongoDB is running

---

## 🎉 You're All Set!

Your Financial Health Score feature is now live! 

**Next features to consider:**
- 📈 Score history chart
- 📧 Daily email reminders
- 🏆 Achievement badges
- 💾 Export PDF report
- 🎬 Video tutorials
- 🤖 Spending predictions

Enjoy! 💰
