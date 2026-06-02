# 📧 Hướng dẫn Cấu hình Email Thông báo Nợ

## Yêu cầu

Tính năng gửi email thông báo cho người nợ yêu cầu cài đặt thêm một số gói:

```bash
npm install nodemailer
```

## Cấu hình Environment Variables

Thêm các biến sau vào file `.env` trong thư mục `backend/`:

### 1. Dùng Gmail (Khuyến nghị cho phát triển)

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

**Hướng dẫn lấy App Password từ Gmail:**

1. Truy cập: https://myaccount.google.com/
2. Bảo mật → 2-Step Verification (nếu chưa bật hãy bật trước)
3. Tại "Password for apps", chọn Mail và tại Windows Computer
4. Sao chép mật khẩu ứng dụng vào `EMAIL_PASSWORD`

### 2. Dùng Outlook/Office 365

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email@outlook.com
```

### 3. Dùng SMTP Server khác

```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
EMAIL_FROM=sender@example.com
```

## Các Tính năng Email

### 1. ✉️ Thông báo Nợ Mới
- Gửi khi tạo khoản nợ mới
- Bao gồm: số tiền, mô tả, hạn thanh toán
- Checkbox "Gửi email thông báo" trong form

### 2. ✉️ Xác nhận Thanh toán
- Gửi khi ghi nhận thanh toán
- Hiển thị: số tiền thanh toán, số tiền còn lại hoặc xác nhận hoàn thành
- Checkbox "Gửi email xác nhận" trong modal thanh toán

### 3. ✉️ Email được thiết kế đẹp
- HTML template chuyên nghiệp
- Responsive design (tương thích mobile)
- Nút CTA rõ ràng
- Thông tin dễ đọc

## Kiểm tra Cấu hình

Để kiểm tra cấu hình email hoạt động, bạn có thể:

1. **Tạo khoản nợ với email:**
   - Nhập email người nợ
   - Chọn "📧 Gửi email thông báo cho người nợ"
   - Click "Thêm nợ"
   - Kiểm tra hộp thư của người nợ

2. **Ghi nhận thanh toán:**
   - Click nút "Ghi nhận TT" trên khoản nợ
   - Chọn số tiền
   - Chọn "📧 Gửi email xác nhận cho người nợ"
   - Click "Xác nhận"

## Xử lý Lỗi

### Email không gửi được
1. Kiểm tra biến `EMAIL_USER` và `EMAIL_PASSWORD` đúng chưa
2. Nếu dùng Gmail, hãy kiểm tra App Password (không phải mật khẩu tài khoản)
3. Kiểm tra "Less secure app access" có được bật không
4. Xem logs trong console backend để tìm lỗi chi tiết

### Lỗi "SMTP Error"
- Kiểm tra `EMAIL_HOST` và `EMAIL_PORT` chính xác
- Thường PORT 587 (TLS) hoặc 465 (SSL)
- Kiểm tra firewall không block SMTP

## Tùy chọn Nâng cao

### Sử dụng SendGrid

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

### Sử dụng Amazon SES

```env
EMAIL_HOST=email-smtp.your-region.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=verified-sender@yourdomain.com
```

## Bảo mật

⚠️ **Quan trọng:**
- **KHÔNG** commit file `.env` chứa mật khẩu email
- Dùng `.env.local` hoặc `.env.example` để documentation
- Mật khẩu email nên được lưu trên server production, không hardcode
- Sử dụng environment variables trong production

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console backend để xem logs chi tiết
2. Đảm bảo email được cấu hình trước khi tạo nợ
3. Nếu không cấu hình, ứng dụng vẫn hoạt động bình thường (chỉ không gửi email)
