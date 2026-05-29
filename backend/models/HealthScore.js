import mongoose from 'mongoose';

const HealthScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    breakdown: {
      expenseControl: {
        type: Number,
        min: 0,
        max: 25,
      },
      savingsRate: {
        type: Number,
        min: 0,
        max: 20,
      },
      categoryBalance: {
        type: Number,
        min: 0,
        max: 20,
      },
      trendAnalysis: {
        type: Number,
        min: 0,
        max: 20,
      },
      budgetAdherence: {
        type: Number,
        min: 0,
        max: 15,
      },
    },

    insights: [
      {
        category: {
          type: String,
          enum: ['positive', 'warning', 'action'],
        },
        title: String,
        text: String,
        metric: String,
      },
    ],

    metrics: {
      totalExpense: Number,
      budgetLimit: Number,
      savings: Number,
      income: Number,
      categoryCount: Number,
      maxCategoryPercent: Number,
      budgetAdherencePercent: Number,
      monthlyTrend: Number, // % change from last month
    },

    calculatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    expiresAt: Date, // Cache expiration

    metadata: {
      dataSource: String, // "expenses", "budgets", "wallets"
      period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily',
      },
      lastImprovement: {
        metric: String,
        previousValue: Number,
        currentValue: Number,
        change: Number,
        date: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// TTL index for cache expiration
HealthScoreSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Index for quick score lookup
HealthScoreSchema.index({ userId: 1, calculatedAt: -1 });

export default mongoose.model('HealthScore', HealthScoreSchema);
