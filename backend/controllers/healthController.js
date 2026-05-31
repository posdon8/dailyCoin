import HealthScore from '../models/HealthScore.js';
import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import Wallet from '../models/Wallet.js';
import { generateInsights, chatAboutFinances } from '../services/geminiService.js';

/**
 * Calculate Financial Health Score (1-100)
 */
const calculateHealthScore = async (expenses, budgets, wallets) => {
  let breakdown = {
    expenseControl: 0,
    savingsRate: 0,
    categoryBalance: 0,
    trendAnalysis: 0,
    budgetAdherence: 0,
  };

  // 1. Expense Control (25 points)
  // Based on how close you are to budget limit
  let totalExpense = 0;
  let budgetLimit = 0;
  let expenseByCategory = {};

  expenses.forEach((exp) => {
    totalExpense += exp.amount;
    expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + exp.amount;
  });

  budgets.forEach((budget) => {
    budgetLimit += budget.limit;
  });

  if (budgetLimit > 0) {
    const usagePercent = (totalExpense / budgetLimit) * 100;
    if (usagePercent <= 100) {
      breakdown.expenseControl = 25; // Perfect control
    } else if (usagePercent <= 110) {
      breakdown.expenseControl = 20; // Slightly over
    } else if (usagePercent <= 120) {
      breakdown.expenseControl = 15; // Moderately over
    } else {
      breakdown.expenseControl = Math.max(0, 25 - (usagePercent - 100) * 0.2); // Significantly over
    }
  }

  // 2. Savings Rate (20 points)
  // Calculate based on wallet balance
  let totalIncome = 0;
  let savings = 0;

  wallets.forEach((wallet) => {
    // Use current balance as both income and savings indicator
    const balance = wallet.balance || 0;
    totalIncome += balance;
    savings += balance;
  });

  // If no wallets, estimate income from total expenses
  if (totalIncome === 0 && totalExpense > 0) {
    totalIncome = totalExpense * 1.5; // Assume 1.5x of expenses
  }

  if (totalIncome > 0) {
    const savingsPercent = (savings / totalIncome) * 100;
    breakdown.savingsRate = Math.min(20, (savingsPercent / 100) * 20);
  }

  // 3. Category Balance (20 points)
  // Penalize if too lopsided
  const categoryCount = Object.keys(expenseByCategory).length;
  let maxCategoryPercent = 0;

  if (totalExpense > 0) {
    Object.values(expenseByCategory).forEach((amount) => {
      maxCategoryPercent = Math.max(maxCategoryPercent, (amount / totalExpense) * 100);
    });

    const avgCategoryPercent = 100 / (categoryCount || 1);
    const deviation = Math.max(0, maxCategoryPercent - avgCategoryPercent);
    breakdown.categoryBalance = Math.max(0, 20 - deviation * 0.3);
  }

  // 4. Trend Analysis (20 points)
  // Compare with previous month
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonthExpenses = expenses.filter((e) => {
    const expDate = new Date(e.date);
    return (
      expDate.getFullYear() === now.getFullYear() &&
      expDate.getMonth() === now.getMonth()
    );
  });
  const lastMonthExpenses = expenses.filter((e) => {
    const expDate = new Date(e.date);
    return (
      expDate.getFullYear() === lastMonth.getFullYear() &&
      expDate.getMonth() === lastMonth.getMonth()
    );
  });

  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyTrend = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  if (monthlyTrend <= 0) {
    breakdown.trendAnalysis = 20; // Great - spending decreased
  } else if (monthlyTrend <= 5) {
    breakdown.trendAnalysis = 18; // Good
  } else if (monthlyTrend <= 10) {
    breakdown.trendAnalysis = 15; // Moderate
  } else if (monthlyTrend <= 20) {
    breakdown.trendAnalysis = 10; // Warning
  } else {
    breakdown.trendAnalysis = Math.max(0, 20 - monthlyTrend * 0.5); // Serious warning
  }

  // 5. Budget Adherence (15 points)
  const budgetsUnderLimit = budgets.filter((b) => {
    const catExpense = expenseByCategory[b.category] || 0;
    return catExpense <= b.limit;
  }).length;

  const adherencePercent = budgets.length > 0 ? (budgetsUnderLimit / budgets.length) * 100 : 0;
  breakdown.budgetAdherence = (adherencePercent / 100) * 15;

  // Calculate total score
  const totalScore =
    breakdown.expenseControl +
    breakdown.savingsRate +
    breakdown.categoryBalance +
    breakdown.trendAnalysis +
    breakdown.budgetAdherence;

  return {
    score: Math.round(totalScore),
    breakdown,
    metrics: {
      totalExpense: Math.round(totalExpense),
      budgetLimit: Math.round(budgetLimit),
      savings: Math.round(savings),
      income: Math.round(totalIncome),
      categoryCount,
      maxCategoryPercent: Math.round(maxCategoryPercent),
      budgetAdherencePercent: Math.round(adherencePercent),
      monthlyTrend: Math.round(monthlyTrend * 10) / 10,
    },
  };
};

/**
 * POST /api/health/calculate
 * Calculate and store new health score
 */
export const calculateScore = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('[HealthScore] Calculating for user:', userId);

    // Fetch user's data
    const [expenses, budgets, wallets] = await Promise.all([
      Expense.find({ userId }),
      Budget.find({ userId }),
      Wallet.find({ userId }),
    ]);

    // Calculate score
    const scoreData = await calculateHealthScore(expenses, budgets, wallets);

    // Validate metrics to prevent NaN values
    const validatedMetrics = {
      totalExpense: isNaN(scoreData.metrics.totalExpense) ? 0 : scoreData.metrics.totalExpense,
      budgetLimit: isNaN(scoreData.metrics.budgetLimit) ? 0 : scoreData.metrics.budgetLimit,
      savings: isNaN(scoreData.metrics.savings) ? 0 : scoreData.metrics.savings,
      income: isNaN(scoreData.metrics.income) ? 0 : scoreData.metrics.income,
      categoryCount: scoreData.metrics.categoryCount || 0,
      maxCategoryPercent: isNaN(scoreData.metrics.maxCategoryPercent) ? 0 : scoreData.metrics.maxCategoryPercent,
      budgetAdherencePercent: isNaN(scoreData.metrics.budgetAdherencePercent) ? 0 : scoreData.metrics.budgetAdherencePercent,
      monthlyTrend: isNaN(scoreData.metrics.monthlyTrend) ? 0 : scoreData.metrics.monthlyTrend,
    };

    console.log('[HealthScore] Validated metrics:', validatedMetrics);

    // Generate AI insights
    console.log('[HealthScore] Generating AI insights...');
    const insights = await generateInsights({ ...scoreData, metrics: validatedMetrics });

    // Save to database
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h cache
    const healthScore = await HealthScore.create({
      userId,
      score: scoreData.score,
      breakdown: scoreData.breakdown,
      metrics: validatedMetrics,
      insights,
      expiresAt,
      metadata: {
        dataSource: 'expenses_budgets_wallets',
        period: 'daily',
      },
    });

    console.log('[HealthScore] Calculated:', healthScore.score);

    res.status(201).json({
      success: true,
      data: {
        score: healthScore.score,
        breakdown: healthScore.breakdown,
        insights: healthScore.insights,
        metrics: healthScore.metrics,
        calculatedAt: healthScore.calculatedAt,
        expiresAt: healthScore.expiresAt,
      },
    });
  } catch (error) {
    console.error('[HealthScore Error]', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/health/score
 * Get current health score (from cache if available)
 */
export const getScore = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get latest score
    const healthScore = await HealthScore.findOne({ userId })
      .sort({ calculatedAt: -1 })
      .lean();

    if (!healthScore) {
      return res.status(404).json({
        success: false,
        message: 'No health score calculated yet. Please calculate first.',
      });
    }

    const isFromCache = healthScore.expiresAt > new Date();

    res.status(200).json({
      success: true,
      data: {
        score: healthScore.score,
        breakdown: healthScore.breakdown,
        insights: healthScore.insights,
        metrics: healthScore.metrics,
        calculatedAt: healthScore.calculatedAt,
        expiresAt: healthScore.expiresAt,
        isFromCache,
      },
    });
  } catch (error) {
    console.error('[GetScore Error]', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/health/chat
 * Chat with AI about financial health
 */
export const chatWithAI = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Get latest score for context
    const healthScore = await HealthScore.findOne({ userId })
      .sort({ calculatedAt: -1 })
      .lean();

    if (!healthScore) {
      return res.status(400).json({
        success: false,
        message: 'Please calculate health score first',
      });
    }

    // Get expenses for context
    const expenses = await Expense.find({ userId }).limit(100).lean();
    let topCategory = 'General';
    let topCategoryPercent = 0;

    const categoryExpenses = {};
    let totalExp = 0;

    expenses.forEach((e) => {
      categoryExpenses[e.category] = (categoryExpenses[e.category] || 0) + e.amount;
      totalExp += e.amount;
    });

    if (totalExp > 0) {
      Object.entries(categoryExpenses).forEach(([cat, amount]) => {
        const percent = (amount / totalExp) * 100;
        if (percent > topCategoryPercent) {
          topCategory = cat;
          topCategoryPercent = percent;
        }
      });
    }

    // Calculate savings percentage
    const totalIncome = healthScore.metrics.income || 1;
    const savingsPercent = totalIncome > 0 
      ? Math.round(((totalIncome - healthScore.metrics.totalExpense) / totalIncome) * 100)
      : 0;

    // Chat with AI
    const response = await chatAboutFinances(message, {
      score: healthScore.score,
      totalExpense: healthScore.metrics.totalExpense,
      budgetAdherencePercent: healthScore.metrics.budgetAdherencePercent,
      topCategory,
      topCategoryPercent: Math.round(topCategoryPercent),
      monthlyTrend: healthScore.metrics.monthlyTrend,
      savingsPercent,
    });

    res.status(200).json({
      success: true,
      data: {
        response,
        relatedMetrics: ['savingsRate', 'categoryBalance'],
      },
    });
  } catch (error) {
    console.error('[Chat Error]', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/health/history
 * Get score history (last 30 days)
 */
export const getScoreHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const history = await HealthScore.find({
      userId,
      calculatedAt: { $gte: thirtyDaysAgo },
    })
      .select('score calculatedAt metrics')
      .sort({ calculatedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        history,
        count: history.length,
      },
    });
  } catch (error) {
    console.error('[History Error]', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
