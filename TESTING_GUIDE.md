# 🚀 Quick Start - Tính năng Goal Saving & Calendar View

## ⚡ Cài đặt nhanh

### 1️⃣ Backend Setup
```bash
cd backend

# Install dependencies (nếu chưa)
npm install

# Run MongoDB (nếu chưa chạy)
# Windows: mongod

# Start server
npm start
# hoặc dev mode
npm run dev
```

### 2️⃣ Frontend Setup
```bash
cd src (hoặc root folder)

# Install dependencies (nếu chưa)
npm install

# Start dev server
npm run dev
# Truy cập: http://localhost:5173
```

---

## 📋 File cần lưu ý

### Backend Files
```
backend/
├── models/Goal.js                    ✨ NEW - Goal model
├── controllers/goalController.js     ✨ NEW - 7 API methods
├── routes/goalRoutes.js              ✨ NEW - Goal API routes
└── server.js                         🔄 UPDATED - add routes
```

### Frontend Files
```
src/
├── hooks/useGoals.js                 ✨ NEW - Goal state management
├── pages/
│   ├── GoalPage.jsx                  ✨ NEW - Goal dashboard
│   └── CalendarPage.jsx              ✨ NEW - Calendar view
├── components/
│   ├── goal/
│   │   ├── GoalForm.jsx              ✨ NEW
│   │   ├── GoalCard.jsx              ✨ NEW
│   │   ├── GoalList.jsx              ✨ NEW
│   │   └── GoalStats.jsx             ✨ NEW
│   └── calendar/
│       └── CalendarView.jsx          ✨ NEW
├── styles/
│   ├── goal.css                      ✨ NEW
│   └── calendar.css                  ✨ NEW
└── App.jsx                           🔄 UPDATED
```

---

## 🧪 Test Cases

### Goal Saving Feature

#### 1. Tạo Goal Mới
```
1. Vào tab "🎯 Mục tiêu"
2. Click "➕ Tạo mục tiêu mới"
3. Điền:
   - Tên: "Du lịch Bali"
   - Số tiền: 30000000
   - Danh mục: vacation
   - Deadline: 2025-12-31
   - Icon: ✈️
   - Màu: #667eea
   - Độ ưu tiên: Cao
4. Click "Tạo mục tiêu"
✅ Kỳ vọng: Goal được thêm vào list, stats update
```

#### 2. Thêm Tiền vào Goal
```
1. Tìm goal vừa tạo
2. Nhập số tiền: 5000000
3. Click "Thêm tiền"
✅ Kỳ vọng: 
   - currentAmount tăng
   - Progress bar cập nhật
   - % hoàn thành tăng
```

#### 3. Chỉnh sửa Goal
```
1. Click icon ✏️ trên goal card
2. Form hiện lên với dữ liệu cũ
3. Sửa tên thành "Du lịch Bali - Summer 2026"
4. Click "Cập nhật"
✅ Kỳ vọng: Title được update ngay
```

#### 4. Xóa Goal
```
1. Click icon 🗑️ trên goal card
2. Confirm dialog hiện lên
3. Click "OK"
✅ Kỳ vọng: Goal được xóa, list update
```

#### 5. Filter Goals
```
1. Click "Đang thực hiện" tab
✅ Kỳ vọng: Chỉ show goals với isCompleted = false

2. Click "Hoàn thành" tab
✅ Kỳ vọng: Chỉ show goals đã hoàn thành

3. Click "Tất cả" tab
✅ Kỳ vọng: Show all goals
```

#### 6. Auto-complete Goal
```
1. Tạo goal: Số tiền = 1,000,000
2. Thêm tiền: 1,000,000
✅ Kỳ vọng:
   - Progress = 100%
   - Badge "✅ Hoàn thành" hiện lên
   - Input thêm tiền disappear
   - Goal có completedAt timestamp
```

#### 7. Stats Dashboard
```
✅ Kỳ vọng:
   - Tổng mục tiêu: 3
   - Hoàn thành: 1
   - Đang thực hiện: 2
   - Tiến độ chung: ~40%
   - Tổng tiền: 80,000,000 / 200,000,000
```

---

### Calendar View Feature

#### 1. Render Lịch
```
1. Vào tab "📅 Lịch"
✅ Kỳ vọng:
   - Calendar grid render (7 cột x 6 hàng)
   - Tháng hiện tại trong header
   - Tất cả ngày của tháng visible
   - Ngày khác tháng có nền màu xám
   - Ngày hôm nay highlight xanh
```

#### 2. Chọn Ngày
```
1. Click vào ngày bất kỳ (VD: 15/6/2026)
✅ Kỳ vọng:
   - Ngày được highlight
   - Stat box cập nhật date
   - Detail section show expenses của ngày
   - Category breakdown update
```

#### 3. Điều hướng Tháng
```
1. Click "◀" (tháng trước)
✅ Kỳ vọng: Calendar shows May 2026, expenses filtered

2. Click "▶" (tháng sau)
✅ Kỳ vọng: Calendar shows June 2026

3. Click "Hôm nay"
✅ Kỳ vọng: Back to current month, today highlighted
```

#### 4. Thống kê Hàng Ngày
```
Chọn ngày có chi tiêu
✅ Kỳ vọng:
   - Stat: Chi tiêu hôm nay = Tổng tiền
   - Stat: Tổng tháng = Sum all expenses this month
   - Stat: Bình quân/ngày = Tổng tháng / 30
   - Stat: Ngày được chọn = YYYY-MM-DD
```

#### 5. Category Breakdown
```
Chọn ngày có nhiều categories
✅ Kỳ vọng:
   - List từng category
   - Hiển thị tổng tiền per category
   - Order by amount (descending)
   - Emoji icon per category (🍽️ 🚗 🛍️ 🎮 📌)
```

#### 6. Expense List
```
Chọn ngày có expenses
✅ Kỳ vọng:
   - List tất cả expenses của ngày
   - Nút edit (✏️)
   - Nút delete (🗑️)
   - Sort by time (newest first)
   - Show: amount, description, category, tags
```

#### 7. Empty State
```
Chọn ngày không có expenses
✅ Kỳ vọng:
   - Message: "📭 Không có chi tiêu nào vào ngày này"
   - No detail section shown
   - Suggestion: "Chọn ngày khác hoặc tạo chi tiêu mới"
```

#### 8. Mobile Responsive
```
1. Resize browser window < 768px
✅ Kỳ vọng:
   - Calendar grid responsive
   - Stat boxes stack vertically
   - Details section full width
   - Nav buttons reorganized
```

---

## 🐛 Troubleshooting

### Goal Feature Issues

**Problem**: Form không validate
- ✅ Check form-group validation logic
- ✅ Check error state in GoalForm.jsx

**Problem**: Stats không update
- ✅ Call loadStats() after create/update/delete
- ✅ Check useGoals hook

**Problem**: Goals load rất chậm
- ✅ Check MongoDB connection
- ✅ Verify .lean() in controller
- ✅ Check network tab trong DevTools

### Calendar Feature Issues

**Problem**: Calendar không render đúng
- ✅ Check dayjs().startOf('month') calculation
- ✅ Verify days array logic (42 elements)

**Problem**: Expense không filter by date
- ✅ Check dayjs format: 'YYYY-MM-DD'
- ✅ Verify expense.date field in DB

**Problem**: Category breakdown sai
- ✅ Check loop logic trong CalendarPage
- ✅ Verify dailyTotal calculation

---

## 📊 Database Verification

### Check Goal Documents
```javascript
// MongoDB shell
db.goals.find({ userId: "default-user" })

// Kỳ vọng output:
{
  _id: ObjectId(...),
  userId: "default-user",
  title: "Du lịch Bali",
  targetAmount: 30000000,
  currentAmount: 5000000,
  category: "vacation",
  deadline: ISODate("2025-12-31"),
  icon: "✈️",
  color: "#667eea",
  priority: 1,
  isCompleted: false,
  completedAt: null,
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

### Check Indexes
```javascript
db.goals.getIndexes()
// Kỳ vọng:
// - _id_
// - userId_1_deadline_1
// - userId_1_isCompleted_1
// - userId_1_category_1
```

---

## 🔗 API Testing (với Postman)

### Create Goal
```
POST http://localhost:5000/api/goals
Body:
{
  "title": "Test Goal",
  "targetAmount": 5000000,
  "category": "vacation",
  "deadline": "2025-12-31",
  "icon": "🏖️",
  "color": "#3b82f6"
}
```

### Get All Goals
```
GET http://localhost:5000/api/goals
Response:
{
  "success": true,
  "data": [{ ...goals }],
  "count": 3
}
```

### Add Amount
```
POST http://localhost:5000/api/goals/{id}/add-amount
Body:
{
  "amount": 1000000
}
```

---

## 📱 UI Checklist

### Goal Page
- [ ] Header "💰 Mục tiêu tiết kiệm" visible
- [ ] 5 stat cards render
- [ ] "➕ Tạo mục tiêu mới" button clickable
- [ ] Form toggle works
- [ ] Filter buttons (Tất cả, Đang thực hiện, Hoàn thành)
- [ ] Goal cards display:
  - [ ] Icon & title
  - [ ] Category
  - [ ] Progress bar
  - [ ] Stats (Còn thiếu, Thời hạn, Ngày còn lại)
  - [ ] Add amount input
  - [ ] Edit & delete buttons
- [ ] Responsive on mobile

### Calendar Page
- [ ] Header "📅 Xem lịch chi tiêu" visible
- [ ] Calendar grid (7x6)
- [ ] Navigation buttons (◀ ▶ Hôm nay)
- [ ] Month name in header
- [ ] 4 stat boxes
- [ ] Category breakdown section
- [ ] Expense list section
- [ ] Legend colors
- [ ] Responsive on mobile

---

## ✅ Deployment Checklist

Before pushing to production:
- [ ] All tests pass
- [ ] No console errors
- [ ] Database indexed properly
- [ ] API response times < 500ms
- [ ] Mobile responsive verified
- [ ] Accessibility (a11y) checked
- [ ] Error handling working
- [ ] Loading states visible
- [ ] Empty states handled
- [ ] Validation messages clear

---

**Last Updated**: 2026-06-07
**Status**: Ready for QA
