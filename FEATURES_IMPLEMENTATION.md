# 📋 Phân tích và Triển khai Tính năng Mới

## 🎯 Tính năng 1: Goal Saving (Tiết kiệm Mục tiêu)

### Mô tả
Feature cho phép người dùng tạo các mục tiêu tài chính dài hạn, theo dõi tiến độ tiết kiệm, và quản lý các khoản tiền dành riêng cho từng mục tiêu.

### Cơ chế hoạt động
1. **Tạo mục tiêu**: Người dùng nhập:
   - Tên mục tiêu (VD: Du lịch Đà Nẵng)
   - Số tiền mục tiêu (VD: 10,000,000 VND)
   - Danh mục (vacation, education, car, home, emergency, investment, other)
   - Thời hạn (deadline)
   - Độ ưu tiên (cao, trung bình, thấp)
   - Biểu tượng và màu sắc tùy chỉnh
   - Mô tả chi tiết

2. **Theo dõi tiến độ**:
   - Thanh tiến độ hiển thị % hoàn thành
   - Tự động tính toán: tiền còn thiếu, ngày còn lại
   - Cảnh báo nếu sắp quá hạn (< 7 ngày)

3. **Thêm tiền vào mục tiêu**:
   - Input số tiền trực tiếp trên từng goal card
   - Tự động đánh dấu hoàn thành khi đạt mục tiêu
   - Lưu ngày hoàn thành

4. **Thống kê tổng hợp**:
   - Tổng số mục tiêu
   - Mục tiêu đã hoàn thành
   - Mục tiêu đang thực hiện
   - Tiến độ chung
   - Tổng tiền đã tiết kiệm vs mục tiêu

### Backend Implementation
**Model**: `Goal.js`
```javascript
{
  userId, title, description,
  targetAmount, currentAmount,
  category, deadline, icon, color,
  isCompleted, completedAt,
  priority, notes
}
```

**API Endpoints**:
- `GET /api/goals` - Lấy tất cả mục tiêu
- `GET /api/goals/stats` - Lấy thống kê
- `GET /api/goals/:id` - Chi tiết mục tiêu
- `POST /api/goals` - Tạo mục tiêu mới
- `PUT /api/goals/:id` - Cập nhật mục tiêu
- `DELETE /api/goals/:id` - Xóa mục tiêu
- `POST /api/goals/:id/add-amount` - Thêm tiền vào mục tiêu

**Controller**: `goalController.js` (7 methods)

### Frontend Implementation
**Hook**: `useGoals.js`
- `loadGoals()` - Tải danh sách mục tiêu
- `loadStats()` - Tải thống kê
- `createGoal(data)` - Tạo mục tiêu mới
- `updateGoal(id, data)` - Cập nhật mục tiêu
- `deleteGoal(id)` - Xóa mục tiêu
- `addAmount(id, amount)` - Thêm tiền

**Components**:
1. **GoalForm.jsx** - Form tạo/chỉnh sửa mục tiêu
   - Input validation
   - Icon picker (10 icons)
   - Color picker (8 màu)
   - Priority selection

2. **GoalCard.jsx** - Card hiển thị từng mục tiêu
   - Progress bar
   - Stats (còn thiếu, deadline, ngày còn lại)
   - Nút thêm tiền
   - Đánh dấu hoàn thành

3. **GoalList.jsx** - Danh sách mục tiêu
   - Filter: all, active, completed
   - Sort by priority và deadline

4. **GoalStats.jsx** - Dashboard thống kê
   - 5 stat cards
   - Overall progress bar

5. **GoalPage.jsx** - Page chính
   - Tích hợp form, list, stats
   - State management cho editing

**Styles**: `goal.css` (350+ lines)
- Responsive grid layout
- Gradient backgrounds
- Smooth animations
- Mobile optimized

---

## 📅 Tính năng 2: Calendar View (Xem lịch)

### Mô tả
Feature hiển thị chi tiêu dưới dạng lịch tương tác, giúp người dùng dễ dàng xem chi tiêu theo ngày, tháng và phân tích xu hướng.

### Cơ chế hoạt động
1. **Lịch tương tác**:
   - Hiển thị tháng hiện tại
   - Nút điều hướng tháng trước/sau
   - Nút "Hôm nay" để quay về hiện tại
   - Hàng tuần (CN-T7)

2. **Cell thông tin**:
   - Ngày của tháng
   - Số lượng chi tiêu hôm đó
   - Tổng tiền chi tiêu trong ngày
   - Visual: nền khác cho ngày khác tháng
   - Highlight ngày hôm nay
   - Highlight ngày được chọn

3. **Chọn ngày**:
   - Click vào ngày bất kỳ
   - Cập nhật chi tiết dưới đó
   - Persistent state cho selected date

4. **Xem chi tiết**:
   - Hiển thị tất cả chi tiêu của ngày được chọn
   - Breakdown theo danh mục
   - Danh sách chi tiêu chi tiết

5. **Thống kê**:
   - Ngày được chọn
   - Chi tiêu hôm nay (highlight)
   - Tổng tháng này
   - Bình quân/ngày trong tháng

### Frontend Implementation
**Components**:
1. **CalendarView.jsx** - Component lịch
   - State: currentDate (useState)
   - Tính toán grid lịch 7x6
   - Xử lý previous/next month
   - Dynamic styling based on date

2. **CalendarPage.jsx** - Page chính
   - State: selectedDate
   - 4 stat boxes
   - Category breakdown
   - Expense list

**Styles**: `calendar.css` (300+ lines)
- CSS Grid layout
- Responsive design (768px breakpoint)
- Color coding cho dates
- Smooth transitions

### Data Flow
```
CalendarView (lịch)
    ↓ onDateSelect(date)
CalendarPage (setState)
    ↓ Rerender
Hiển thị stats + details của ngày được chọn
```

### Thống kê được tính:
- `expensesByDate` - Object map date → expenses array
- `dailyTotals` - Object map date → tổng tiền
- `monthExpenses` - Expenses của tháng hiện tại
- `categoryBreakdown` - Tổng tiền per category

---

## 📊 Tích hợp và Ghi chú

### Frontend Integration
✅ **App.jsx** - Updated
- Import GoalPage, CalendarPage
- Import useGoals hook
- Add goal state management
- Add 2 nav tabs (Goals, Calendar)
- Add page rendering logic

✅ **Header.jsx** - Có thể cập nhật thêm:
- Logo, branding nếu cần
- User menu với icon

### Backend Integration
✅ **server.js** - Updated
- Import goalRoutes
- Mount `/api/goals` routes

✅ **Database**
- Goal schema: userId indexed (cho performance)
- Auto-indexing cho deadline, isCompleted, category

### Style Files Created
- `src/styles/goal.css` - 350+ lines
- `src/styles/calendar.css` - 300+ lines

### Performance Optimizations
1. **Lean queries** - `.lean()` trong goalController
2. **Index strategies** - userId, deadline, isCompleted
3. **Virtual properties** - Computed fields (progressPercentage, remainingAmount, daysRemaining)
4. **Lazy loading** - Goals/expenses load on mount

---

## 🚀 Cách sử dụng

### Goal Saving
1. Đi đến tab "🎯 Mục tiêu"
2. Click "➕ Tạo mục tiêu mới"
3. Điền form:
   - Tên: "Du lịch Nhật Bản"
   - Số tiền: 50,000,000 VND
   - Danh mục: vacation
   - Deadline: 2025-12-31
   - Chọn icon & màu
4. Lưu
5. Thêm tiền vào goal bằng input trên card
6. Xem tiến độ tức thời

### Calendar View
1. Đi đến tab "📅 Lịch"
2. Xem tháng hiện tại
3. Nhấp vào ngày bất kỳ
4. Xem:
   - Thống kê ngày (chi tiêu, trung bình)
   - Breakdown theo danh mục
   - Chi tiết từng transaction
5. Điều hướng tháng khác với ◀ ▶
6. Quay về hôm nay: "Hôm nay"

---

## 🔍 Testing Checklist

### Goal Feature
- [ ] Tạo goal mới
- [ ] Validation form (không để trống, số tiền > 0)
- [ ] Edit goal
- [ ] Delete goal (confirm dialog)
- [ ] Thêm tiền vào goal
- [ ] Auto-complete khi đạt target
- [ ] Filter: All, Active, Completed
- [ ] Sort by priority & deadline
- [ ] Stats update realtime
- [ ] Mobile responsive

### Calendar Feature
- [ ] Render lịch đúng (42 cells, 6 hàng)
- [ ] Chuyển tháng (prev/next)
- [ ] Click ngày → update chi tiết
- [ ] Hôm nay highlight (nếu trong tháng)
- [ ] Category breakdown calculation
- [ ] Expense list filtered by date
- [ ] Mobile responsive (thay đổi layout)
- [ ] Ngày khác tháng → gray out

---

## 📝 File được tạo/sửa

### Backend
- ✅ `backend/models/Goal.js` (NEW)
- ✅ `backend/controllers/goalController.js` (NEW)
- ✅ `backend/routes/goalRoutes.js` (NEW)
- ✅ `backend/server.js` (UPDATED - add routes)

### Frontend
- ✅ `src/hooks/useGoals.js` (NEW)
- ✅ `src/pages/GoalPage.jsx` (NEW)
- ✅ `src/pages/CalendarPage.jsx` (NEW)
- ✅ `src/components/goal/GoalForm.jsx` (NEW)
- ✅ `src/components/goal/GoalCard.jsx` (NEW)
- ✅ `src/components/goal/GoalList.jsx` (NEW)
- ✅ `src/components/goal/GoalStats.jsx` (NEW)
- ✅ `src/components/calendar/CalendarView.jsx` (NEW)
- ✅ `src/styles/goal.css` (NEW)
- ✅ `src/styles/calendar.css` (NEW)
- ✅ `src/App.jsx` (UPDATED - add imports, hooks, routes)

---

## 🎨 UI/UX Highlights

### Goal Saving
- 🎨 Gradient backgrounds
- 💫 Smooth animations & transitions
- 🎯 Clear visual hierarchy
- 📊 Interactive progress bars
- 🏷️ Color & icon customization

### Calendar View
- 📅 Intuitive calendar grid
- 🗓️ Today highlight
- 📍 Date selection state
- 📊 Real-time statistics
- 🏷️ Category breakdown

---

## 🔐 Security Notes
- ✅ userId validation trên mỗi request
- ✅ Authorization checks (user chỉ thấy own goals)
- ✅ Input validation trên backend
- ✅ No sensitive data exposure

---

## 💡 Tương lai có thể mở rộng
1. **Goal Sharing** - Chia sẻ mục tiêu vs bạn bè
2. **Goal Analytics** - Biểu đồ tiến độ, predictions
3. **Calendar Heatmap** - Intensity map chi tiêu
4. **Goal Notifications** - Reminder khi sắp deadline
5. **Recurring Goals** - Mục tiêu lặp lại hàng năm
6. **Goal Milestones** - Sub-goals, checkpoints
7. **Calendar Export** - Xuất lịch as PDF/CSV

---

**Created**: 2026-06-07
**Version**: 1.0.0
**Status**: ✅ Ready for Testing
