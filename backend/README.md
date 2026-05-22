# 📊 Daily Expenses App - Backend API

API server cho ứng dụng quản lý chi tiêu hàng ngày, xây dựng trên **Node.js + Express + MongoDB**.

## 🚀 Tính Năng

- ✅ **CRUD Operations**: Thêm, sửa, xóa, lấy chi tiêu
- ✅ **MongoDB Integration**: Lưu trữ dữ liệu bền vững
- ✅ **Advanced Queries**: Lọc theo ngày, tháng, danh mục
- ✅ **Statistics**: Thống kê chi tiêu theo danh mục, ngày
- ✅ **Error Handling**: Xử lý lỗi toàn diện
- ✅ **CORS Support**: Hỗ trợ frontend từ domain khác

## 📋 Yêu Cầu

- **Node.js**: v14 trở lên
- **MongoDB**: Local hoặc Atlas
- **npm** hoặc **yarn**

## 🔧 Cài Đặt

### 1. Cài Đặt Dependencies

```bash
cd backend
npm install
```

### 2. Tạo File `.env`

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/daily-expenses

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

**Để kết nối MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/daily-expenses
```

### 3. Chuẩn Bị MongoDB

**Option A: MongoDB Local**
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

**Option B: MongoDB Atlas**
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster và lấy connection string
3. Cập nhật `.env` file

## 🚀 Chạy Server

```bash
# Development (với auto-reload)
npm run dev

# Production
npm start
```

Output:
```
╔════════════════════════════════════════╗
║  🚀 Daily Expenses API Server Started  ║
║  📍 Port: 5000                         ║
║  🗄️  MongoDB: mongodb://localhost...  ║
╚════════════════════════════════════════╝
```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

### Expenses Endpoints

#### Lấy Tất Cả Chi Tiêu
```
GET /expenses?userId=default-user

Response:
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

#### Lấy Chi Tiêu Theo ID
```
GET /expenses/:id

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Tạo Chi Tiêu Mới
```
POST /expenses

Body:
{
  "userId": "default-user",
  "amount": 50000,
  "category": "food",
  "description": "Cơm trưa",
  "date": "2026-05-21",
  "tags": ["ăn trưa"],
  "notes": "Ở quán cơm gần công ty"
}

Response:
{
  "success": true,
  "message": "Chi tiêu được tạo thành công",
  "data": { ... }
}
```

#### Cập Nhật Chi Tiêu
```
PUT /expenses/:id

Body:
{
  "amount": 55000,
  "category": "food",
  "description": "Cơm trưa + nước",
  "date": "2026-05-21"
}

Response:
{
  "success": true,
  "message": "Chi tiêu được cập nhật thành công",
  "data": { ... }
}
```

#### Xóa Chi Tiêu
```
DELETE /expenses/:id

Response:
{
  "success": true,
  "message": "Chi tiêu được xóa thành công"
}
```

#### Lấy Chi Tiêu Theo Khoảng Ngày
```
GET /expenses/range/search?userId=default-user&startDate=2026-05-01&endDate=2026-05-31

Response:
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

#### Lấy Chi Tiêu Theo Tháng
```
GET /expenses/month/search?userId=default-user&month=5&year=2026

Response:
{
  "success": true,
  "count": 15,
  "data": [...]
}
```

#### Lấy Thống Kê
```
GET /expenses/stats/analytics?userId=default-user&month=5&year=2026

Response:
{
  "success": true,
  "data": {
    "total": {
      "totalAmount": 1500000,
      "count": 25
    },
    "byCategory": [
      {
        "_id": "food",
        "amount": 800000,
        "count": 15
      },
      ...
    ],
    "byDate": [
      {
        "_id": "2026-05-21",
        "amount": 100000,
        "count": 2
      },
      ...
    ]
  }
}
```

## 📊 MongoDB Schema

```javascript
Expense {
  _id: ObjectId,
  userId: String (default: "default-user"),
  amount: Number (required),
  category: String enum (food, transport, shopping, entertainment, other),
  description: String (required, max 200),
  date: Date (required),
  tags: [String],
  notes: String (max 500),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🧪 Test API

### Sử Dụng cURL

```bash
# Tạo chi tiêu
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "default-user",
    "amount": 50000,
    "category": "food",
    "description": "Cơm trưa",
    "date": "2026-05-21"
  }'

# Lấy tất cả chi tiêu
curl http://localhost:5000/api/expenses?userId=default-user

# Lấy thống kê
curl http://localhost:5000/api/expenses/stats/analytics?userId=default-user&month=5&year=2026
```

### Sử Dụng Postman

1. Tải [Postman](https://www.postman.com/)
2. Import các request từ `postman_collection.json`
3. Set environment variables
4. Run requests

## 🔐 Security Notes

⚠️ **Hiện tại không có authentication**. Để sản xuất (production), cần thêm:
- JWT Authentication
- Input validation & sanitization
- Rate limiting
- HTTPS enforcement
- CORS configuration tuyệt đối

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| MONGODB_URI | mongodb://localhost:27017/daily-expenses | MongoDB connection string |
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment (development/production) |
| CORS_ORIGIN | http://localhost:5173 | Frontend URL for CORS |

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ Error connecting to MongoDB: connect ECONNREFUSED
```
✅ **Giải pháp**: Chắc chắn MongoDB đang chạy
```bash
# Windows
mongod

# macOS
brew services start mongodb-community
```

### CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5000/api/expenses'
from origin 'http://localhost:5173' has been blocked by CORS policy
```
✅ **Giải pháp**: Cập nhật `.env`:
```
CORS_ORIGIN=http://localhost:5173
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
✅ **Giải pháp**: Đổi port hoặc kill process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

## 📚 Tài Liệu Thêm

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 📄 License

MIT
