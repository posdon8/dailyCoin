import './config/env.js'; 
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import attachmentRoutes from './routes/attachmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Load environment variables
import passport from './config/passport.js';

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
const corsOptions = {
  origin: (origin, callback) => {
    // Allowed origins - including different localhost variations
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5174',
      process.env.FRONTEND_URL, // From .env
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log warning but still allow for development
      console.warn(`[CORS] Origin not in whitelist: ${origin}`);
      callback(null, true); // Allow for development flexibility
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use(passport.initialize());
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/health', healthRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 Daily Expenses API Server Started  ║
║  📍 Port: ${PORT}                         ║
║  🗄️  MongoDB: ${process.env.MONGODB_URI}  ║
╚════════════════════════════════════════╝
  `);
});

export default app;
