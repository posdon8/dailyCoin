# 🎉 Daily Expenses App - Full Stack Setup

## 📁 Project Structure

```
dailyExpenses-app/
├── backend/                 # Node.js + Express + MongoDB API
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   ├── .env               # Environment variables
│   └── README.md          # Backend documentation
├── src/                    # React Frontend
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom hooks (useExpensesAPI)
│   ├── services/         # API service (api.js)
│   ├── utils/            # Utilities & constants
│   ├── context/          # React Context
│   ├── styles/           # CSS files
│   ├── App.jsx           # Main app
│   └── main.jsx          # Entry point
├── .env.local             # Frontend environment variables
├── package.json           # Frontend dependencies
└── vite.config.js         # Vite configuration
```

## 🚀 Quick Start

### 1️⃣ Cài Đặt Backend

```bash
# Vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env (xem backend/README.md)
# Đảm bảo MongoDB đang chạy

# Chạy server
npm run dev
```

### 2️⃣ Cài Đặt Frontend

```bash
# Quay lại thư mục gốc
cd ..

# Frontend dependencies đã được cài (từ lần đầu)
# Chạy dev server (Vite đã chạy từ trước)
npm run dev
```

### 3️⃣ Kiểm Tra Kết Nối

- **Frontend**: http://localhost:5173 ✅
- **Backend**: http://localhost:5000/api/health ✅
- **MongoDB**: Kiểm tra `.env` file ✅

## 📡 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  (http://localhost:5173)                                │
└────────────────┬────────────────────────────────────────┘
                 │ API Calls (fetch)
                 │ useExpensesAPI hook
                 │ /src/services/api.js
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Express API Server                          │
│  (http://localhost:5000/api)                            │
│  - Routes: /expenses, /stats, etc.                      │
│  - Controllers: CRUD operations                         │
│  - Error handling & validation                          │
└────────────────┬────────────────────────────────────────┘
                 │ Mongoose ORM
                 │ Database queries
                 ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB Database                            │
│  (mongodb://localhost:27017/daily-expenses)             │
│  Collections: expenses                                   │
└─────────────────────────────────────────────────────────┘
```

## 🔄 API Usage Flow

### Create (Thêm chi tiêu)
```
Frontend Input → useExpensesAPI.addExpense()
  → api.js: createExpenseAPI()
    → POST /api/expenses
      → expenseController.createExpense()
        → MongoDB: save()
          → Return to frontend
            → Update state & show notification
```

### Read (Lấy chi tiêu)
```
Component Mount → useExpensesAPI()
  → loadExpenses()
    → api.js: fetchExpenses()
      → GET /api/expenses
        → expenseController.getAllExpenses()
          → MongoDB: find()
            → Return to frontend
              → setState
```

### Update (Sửa chi tiêu)
```
User Edit → useExpensesAPI.updateExpense()
  → api.js: updateExpenseAPI()
    → PUT /api/expenses/:id
      → expenseController.updateExpense()
        → MongoDB: findByIdAndUpdate()
          → Return to frontend
            → Update state & show notification
```

### Delete (Xóa chi tiêu)
```
User Delete → useExpensesAPI.deleteExpense()
  → api.js: deleteExpenseAPI()
    → DELETE /api/expenses/:id
      → expenseController.deleteExpense()
        → MongoDB: findByIdAndDelete()
          → Return to frontend
            → Update state & show notification
```

## 📚 Key Files

### Backend
- **backend/server.js** - Server entry point
- **backend/config/mongodb.js** - MongoDB connection
- **backend/models/Expense.js** - Data schema
- **backend/controllers/expenseController.js** - Business logic
- **backend/routes/expenseRoutes.js** - API endpoints
- **backend/.env** - Configuration (MongoDB URI, port, etc.)

### Frontend
- **src/services/api.js** - API client
- **src/hooks/useExpensesAPI.js** - State management hook
- **src/App.jsx** - Main component
- **src/.env.local** - Frontend config (API URL)

## 🛠️ Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Output: API running on http://localhost:5000
```

### Terminal 2: Frontend
```bash
npm run dev
# Output: App running on http://localhost:5173
```

### Terminal 3: MongoDB (if local)
```bash
mongod
# Output: MongoDB listening on 27017
```

## 🧪 Testing API

### Quick Test

```bash
# Health check
curl http://localhost:5000/api/health

# Create expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "default-user",
    "amount": 100000,
    "category": "food",
    "description": "Cơm trưa",
    "date": "2026-05-21"
  }'

# Get all expenses
curl http://localhost:5000/api/expenses?userId=default-user

# Get stats
curl http://localhost:5000/api/expenses/stats/analytics?userId=default-user&month=5&year=2026
```

## 🔍 Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/daily-expenses
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 📱 Features Now Available

✅ **CRUD Operations** - Create, Read, Update, Delete expenses
✅ **Persistent Storage** - Data saved in MongoDB
✅ **Advanced Filtering** - By date, month, category
✅ **Statistics** - Charts, analytics, trends
✅ **Real-time Updates** - Instant UI updates
✅ **Error Handling** - Proper error messages
✅ **Vietnamese UI** - Tiếng Việt interface

## 🚨 Important Notes

### MongoDB Setup
If using MongoDB Atlas (cloud):
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daily-expenses
   ```

### Port Conflicts
- **Frontend**: 5173 (Vite)
- **Backend**: 5000 (Express)
- **MongoDB**: 27017 (Local)

If ports are occupied, update `.env` or kill processes

### CORS Configuration
Frontend and backend must have matching CORS settings:
- Frontend: `http://localhost:5173`
- Backend `.env`: `CORS_ORIGIN=http://localhost:5173`

## 📖 Next Steps

1. **Test all CRUD operations** through the UI
2. **Check browser console** for API logs
3. **Monitor backend terminal** for request logs
4. **View MongoDB** data with MongoDB Compass or Atlas UI
5. **Add authentication** (optional, for production)

## 🆘 Troubleshooting

### "API Error: Failed to fetch"
- ✅ Check backend is running on port 5000
- ✅ Check `.env.local` has correct `VITE_API_URL`
- ✅ Check MongoDB is running
- ✅ Check CORS settings in backend

### "MongoDB connection failed"
- ✅ Make sure MongoDB service is running
- ✅ Check `MONGODB_URI` in `.env`
- ✅ For MongoDB Atlas, check internet connection

### "CORS error"
- ✅ Check `CORS_ORIGIN` in `backend/.env`
- ✅ Should be `http://localhost:5173`
- ✅ Restart backend server after changes

## 📞 Support

For issues or questions:
1. Check the backend `README.md` for API documentation
2. Review error messages in browser console
3. Check backend terminal for logs
4. Verify MongoDB connection and port availability

---

**Happy coding! 🎉**
