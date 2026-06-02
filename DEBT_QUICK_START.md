# 💳 Tính năng Quản lý Nợ - Hướng dẫn Sử dụng

## 🎯 Tổng quan

Tính năng **Quản lý Nợ** giúp bạn:
- ✅ Theo dõi **ai nợ bao nhiêu tiền**
- ✅ Ghi nhận **thanh toán từng phần**
- ✅ **Nhận thông báo email** khi tạo/thanh toán khoản nợ
- ✅ Xem **thống kê chi tiết** về nợ
- ✅ **Ưu tiên hóa** các khoản nợ

## 🚀 Cài đặt & Cấu hình

### Backend Setup

1. **Cài đặt nodemailer (nếu muốn dùng email):**
   ```bash
   cd backend
   npm install nodemailer
   ```

2. **Cấu hình email trong `.env`:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

   💡 **Chi tiết:** Xem file `EMAIL_CONFIG.md`

3. **Chạy Backend:**
   ```bash
   npm run dev
   ```

### Frontend - Không cần cài đặt thêm

Frontend đã được tích hợp sẵn tất cả components và hooks cần thiết.

## 📖 Hướng dẫn Sử dụng

### 1️⃣ Thêm Khoản Nợ Mới

**Truy cập:** Menu chính → **💳 Nợ**

**Thêm nợ:**
1. Click **"+ Thêm nợ mới"** 
2. Điền thông tin:
   - **Tên người nợ** (bắt buộc)
   - **Email người nợ** (để gửi thông báo)
   - **Số tiền nợ** (VND)
   - **Mô tả** khoản nợ
   - **Danh mục:** Cá nhân / Kinh doanh / Vay mượn / Khác
   - **Ngày đến hạn**
   - **Mức độ ưu tiên:** Thấp / Trung bình / Cao
   - **Ghi chú** (tuỳ chọn)
   - ✅ **Gửi email thông báo cho người nợ** (checkbox)

3. Click **"Thêm nợ"**

### 2️⃣ Xem Danh sách Nợ

**Thông tin hiển thị:**
- 👤 Tên người nợ
- 💰 Số tiền nợ (màu đỏ)
- 📋 Mô tả ngắn
- 🏷️ Danh mục & Ưu tiên
- 📅 Ngày đến hạn
- ⏳ **Thanh toán một phần:**
  - Thanh tiến độ
  - Số tiền đã thanh toán
  - Số tiền còn nợ

**Trạng thái nợ:**
- 🔴 **Chưa thanh toán** - Chưa có thanh toán nào
- 🟡 **Thanh toán một phần** - Đã thanh toán một số tiền
- 🟢 **Đã thanh toán** - Thanh toán hoàn thành

**Cảnh báo:**
- ⚠️ **Quá hạn** - Hiển thị nếu ngày đến hạn đã qua

### 3️⃣ Ghi nhận Thanh toán

**Click "Ghi nhận TT" trên khoản nợ:**

1. Nhập **số tiền thanh toán** (VND)
2. **Nút tính nhanh:**
   - 50% - Thanh toán nửa số tiền còn lại
   - 25% - Thanh toán 1/4 số tiền còn lại
   - **Toàn bộ** - Thanh toán hết số tiền còn nợ
3. ✅ **Gửi email xác nhận cho người nợ** (checkbox)
4. Click **"Xác nhận"**

**Email gửi đi sẽ chứa:**
- ✓ Số tiền vừa thanh toán
- ✓ Số tiền còn lại (nếu có)
- ✓ Thông báo nếu hoàn thành thanh toán

### 4️⃣ Tìm Kiếm & Lọc

**Tìm kiếm:**
- Nhập tên người nợ hoặc mô tả
- Kết quả hiển thị theo từng gõ

**Lọc theo trạng thái:**
- Tất cả
- Chưa thanh toán
- Thanh toán một phần
- Đã thanh toán

**Lọc theo ưu tiên:**
- Tất cả
- Ưu tiên thấp
- Ưu tiên trung bình
- Ưu tiên cao

### 5️⃣ Xem Chi tiết

Click **"Chi tiết"** trên khoản nợ để xem toàn bộ thông tin:
- Thông tin cơ bản
- Thông tin tài chính (tiến độ thanh toán)
- Thời hạn & trạng thái
- Mô tả & ghi chú
- Thẻ (tags)
- Lịch sử (ngày tạo & cập nhật)

### 6️⃣ Sửa / Xóa Khoản Nợ

**Sửa:** Click **"Sửa"** để cập nhật thông tin
- ⚠️ **Lưu ý:** Chọn "Gửi email" nếu muốn gửi thông báo cập nhật

**Xóa:** Click **"Xóa"** → Xác nhận xóa

### 7️⃣ Thống kê Nợ

**Các chỉ số hiển thị:**
- 💰 **Tổng nợ** - Tổng cộng tất cả khoản nợ
- ✅ **Đã thanh toán** - Tổng số tiền đã trả + phần trăm
- ⏳ **Còn lại** - Số tiền vẫn còn phải trả
- ⚠️ **Quá hạn** - Số lượng khoản nợ quá hạn

**Phân loại theo trạng thái:**
- Số lượng & tổng tiền mỗi trạng thái

## 📧 Email Notifications

### Khi nào gửi email?

1. **Tạo khoản nợ mới:**
   - Gửi khi có checkbox "Gửi email"
   - Email chứa: số tiền, mô tả, hạn thanh toán

2. **Ghi nhận thanh toán:**
   - Gửi khi có checkbox "Gửi email xác nhận"
   - Email chứa: số tiền thanh toán, số tiền còn lại

3. **Cập nhật thông tin nợ:**
   - Gửi nếu chọn "Gửi email" khi sửa

### Cấu hình Email

**Gmail (Khuyến nghị):**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # App Password, không phải mật khẩu tài khoản
```

**Kiểm tra email được cấu hình:** 
- Khi tạo nợ mới, nếu không có checkbox email → Email chưa cấu hình

## 💡 Tips & Tricks

### Sắp xếp Ưu Tiên
- Khoản nợ **ưu tiên cao** thường ở trên (sắp xếp theo ngày đến hạn)
- Luôn kiểm tra tab **"Quá hạn"** để không bỏ sót

### Thanh Toán Phần Trăm
- Dùng nút **50% / 25% / Toàn bộ** để tính nhanh
- Tiết kiệm thời gian nhập số tiền

### Ghi Chú Chi Tiết
- Lưu **số điện thoại, địa chỉ** của người nợ trong ghi chú
- Ghi lý do nợ để nhớ lâu hơn

### Email Thông Báo
- Gửi email khi người nợ **lần đầu** được biết khoản nợ
- Gửi email khi **thanh toán** để xác nhận cả hai bên đều có ghi chép

## 🐛 Xử lý Sự cố

### Email không gửi
1. Kiểm tra `.env` có `EMAIL_USER` và `EMAIL_PASSWORD` không
2. Nếu dùng Gmail, chắc chắn dùng **App Password** (không phải mật khẩu tài khoản)
3. Xem console backend để tìm thông báo lỗi chi tiết

### Checkbox email không xuất hiện
- Email chưa được cấu hình
- Hãy thêm biến email vào `.env`

### Tính năng khác không hoạt động
- Kiểm tra database MongoDB có kết nối không
- Xem console backend xem có lỗi gì không
- Restart backend: `npm run dev`

## 📚 Tài liệu Thêm

- **Email Configuration:** Xem `EMAIL_CONFIG.md`
- **Backend API:** Xem `backend/routes/debtRoutes.js`
- **Frontend Components:** Xem `src/components/debt/`

## 🎓 Ví dụ Sử dụng

### Ví dụ 1: Theo dõi tiền cho bạn bè
```
Người nợ: Bạn A
Email: friend@gmail.com
Số tiền: 500.000 VND
Mô tả: Tiền xăng xe
Hạn: 30/06/2026
Ưu tiên: Trung bình
☑️ Gửi email
```

### Ví dụ 2: Vay tiền kinh doanh
```
Người nợ: Công ty XYZ
Email: company@company.com
Số tiền: 10.000.000 VND
Mô tả: Vay kinh doanh Q2
Hạn: 31/08/2026
Ưu tiên: Cao
Ghi chú: Lãi suất 10%, thanh toán hàng tháng
```

---

**Cần giúp?** Kiểm tra EMAIL_CONFIG.md hoặc backend logs!
