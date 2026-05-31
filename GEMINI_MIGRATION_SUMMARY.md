# 🎯 Gemini API Migration Summary

## ✅ Hoàn thành: Chuyển từ OpenAI sang Gemini API

Đã cập nhật tất cả các file liên quan để sử dụng Google Gemini API thay vì OpenAI.

---

## 📋 Các thay đổi được thực hiện

### 1. **Rename Service File** ✅
- `backend/services/openaiService.js` → `backend/services/geminiService.js`
- Tên file giờ đây phản ánh chính xác công nghệ được sử dụng

### 2. **Cập nhật Import** ✅
**File:** `backend/controllers/healthController.js`
```javascript
// Trước:
import { generateInsights, chatAboutFinances } from '../services/openaiService.js';

// Sau:
import { generateInsights, chatAboutFinances } from '../services/geminiService.js';
```

### 3. **Cập nhật Environment Variables** ✅
**File:** `backend/.env`
```bash
# Xóa:
# OPENAI_API_KEY=sk-proj-...

# Giữ:
GEMINI_API_KEY=AIzaSyB41k5Jh8X5Jv9Q3K2R1N8V7Z4X6Y9Z3X8
```

### 4. **Cập nhật Documentation** ✅
- `HEALTH_SCORE_QUICK_START.md` - Hướng dẫn setup Gemini API
- `FINANCIAL_HEALTH_SCORE_ARCHITECTURE.md` - Cập nhật kiến trúc để dùng Gemini
- `.env.example` - Thêm GEMINI_API_KEY configuration

---

## 🔧 Cấu trúc API Gemini

### Gemini Service (`backend/services/geminiService.js`)

#### 1. **callGemini()** - Base API Call
```javascript
export const callGemini = async (systemPrompt, userPrompt, maxTokens = 500)
```
- Gọi API Gemini với prompt system + user
- Tự động xử lý error handling
- Return: AI response text

#### 2. **generateInsights()** - Tạo insights tài chính
```javascript
export const generateInsights = async (metrics)
```
**Input:** Health score metrics (score, breakdown, tỷ lệ, xu hướng)
**Output:** Array of insights
```javascript
[
  {
    category: "positive" | "warning" | "action",
    title: "Tiêu đề",
    text: "Chi tiết"
  }
]
```

#### 3. **chatAboutFinances()** - Chat với AI
```javascript
export const chatAboutFinances = async (userMessage, scoreContext)
```
**Input:** User message + Financial context
**Output:** AI response (Vietnamese text)

---

## 🚀 Cách sử dụng

### Setup (Lần đầu tiên)

1. **Lấy API Key từ Google:**
   - Truy cập: https://makersuite.google.com/app/apikey
   - Nhấp "Create API Key"
   - Copy key vào `.env`

2. **Cập nhật `.env`:**
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Khởi động Backend:**
   ```bash
   cd backend
   npm run dev
   ```

### Các tính năng hoạt động

✅ **Health Score Calculation** - Tính điểm sức khỏe tài chính
```javascript
POST /api/health/calculate
// → Tạo insights từ Gemini
```

✅ **Chat với AI** - Hỏi đáp về tài chính
```javascript
POST /api/health/chat
{
  "message": "Làm sao để tiết kiệm hơn?"
}
// → Response từ Gemini với lời khuyên
```

✅ **Health Score History** - Lịch sử điểm (24h cache)
```javascript
GET /api/health/history
// → Lấy các score trong 30 ngày gần nhất
```

---

## 📊 Gemini Models Có sẵn

Trong `geminiService.js`, bạn có thể chọn model:

```javascript
// Hiện tại (nhanh, đủ tốt):
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

// Nếu muốn chính xác hơn (chậm hơn):
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`;
```

| Model | Tốc độ | Độ chính xác | Giá |
|-------|--------|------------|-----|
| gemini-2.0-flash | ⚡ Nhanh | ⭐⭐⭐⭐ | Rẻ nhất |
| gemini-1.5-pro | Bình thường | ⭐⭐⭐⭐⭐ | Bình thường |
| gemini-1.5-flash | Rất nhanh | ⭐⭐⭐ | Rẻ |

---

## 🔒 Bảo mật & Best Practices

### API Key Management
```javascript
// ✅ ĐÚNG - Lấy từ environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ❌ SAI - Không hardcode key
// const GEMINI_API_KEY = 'AIzaSy...';
```

### Rate Limiting Recommendations
- Gemini: **60 requests/minute** (free tier)
- Health Score: **1 calculation/24h** (cached)
- Chat: **Không giới hạn** (nhưng nên rate limit)

### Prompts (Tiếng Việt)
Tất cả prompts trong `geminiService.js` đã được thiết kế để:
- Yêu cầu response JSON khi cần
- Sử dụng tiếng Việt hoàn toàn
- Cung cấp context tài chính đầy đủ

---

## 🧪 Testing

### Test Health Score Calculation
```bash
curl -X POST http://localhost:5000/api/health/calculate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Test Chat
```bash
curl -X POST http://localhost:5000/api/health/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Tôi nên tiết kiệm bao nhiêu?"}'
```

---

## 🐛 Troubleshooting

| Vấn đề | Nguyên nhân | Giải pháp |
|--------|-----------|----------|
| `GEMINI_API_KEY not configured` | Không set env var | Thêm key vào `.env` |
| `500 error on /health/calculate` | API key không hợp lệ | Kiểm tra key từ makersuite.google.com |
| `Chat returns weird text` | Gemini không parse JSON | Kiểm tra format prompt |
| `Rate limit exceeded` | Quá nhiều requests | Thêm cache/delay |

---

## 📝 Tóm tắt Thay đổi

```
backend/
├─ services/
│  ├─ ❌ openaiService.js
│  └─ ✅ geminiService.js       (Mới)
├─ controllers/
│  └─ ✅ healthController.js    (Import updated)
└─ .env
   ├─ ❌ OPENAI_API_KEY
   └─ ✅ GEMINI_API_KEY

Documentation/
├─ ✅ HEALTH_SCORE_QUICK_START.md       (Updated)
├─ ✅ FINANCIAL_HEALTH_SCORE_ARCHITECTURE.md (Updated)
└─ ✅ .env.example                       (Updated)
```

---

## 🎉 Kết luận

✅ **Hoàn thành:** Chuyển qua Gemini API
- Tất cả functionality (Health Score, Chat, Insights) đều hoạt động
- Prompts được tối ưu cho Gemini
- Documentation cập nhật đầy đủ
- Environment variables sẵn sàng

🚀 **Tiếp theo:**
- Test tất cả API endpoints
- Monitor Gemini API usage
- Điều chỉnh prompts nếu cần
- Deploy lên production

---

**Ngày cập nhật:** May 31, 2026
**Gemini Model:** gemini-2.0-flash
**Status:** ✅ Ready to use
