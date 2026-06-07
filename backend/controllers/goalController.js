import Goal from '../models/Goal.js';

// Get all goals for user
export const getAllGoals = async (req, res) => {
  try {
    const userId = req.user?.id || 'default-user';
    
    const goals = await Goal.find({ userId })
      .sort({ deadline: 1, priority: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: goals,
      count: goals.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get goal by ID
export const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'default-user';

    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Mục tiêu không tìm thấy',
      });
    }

    if (goal.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập mục tiêu này',
      });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new goal
export const createGoal = async (req, res) => {
  try {
    const userId = req.user?.id || 'default-user';
    const { title, description, targetAmount, category, deadline, icon, color, priority, notes } = req.body;

    const goal = new Goal({
      userId,
      title,
      description,
      targetAmount,
      category,
      deadline,
      icon,
      color,
      priority,
      notes,
    });

    await goal.validate();
    await goal.save();

    res.status(201).json({
      success: true,
      message: 'Tạo mục tiêu thành công',
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update goal
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'default-user';
    const updates = req.body;

    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Mục tiêu không tìm thấy',
      });
    }

    if (goal.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật mục tiêu này',
      });
    }

    // Cập nhật các trường
    Object.assign(goal, updates);

    // Kiểm tra nếu mục tiêu đã hoàn thành
    if (goal.currentAmount >= goal.targetAmount && !goal.isCompleted) {
      goal.isCompleted = true;
      goal.completedAt = new Date();
    }

    await goal.validate();
    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật mục tiêu thành công',
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'default-user';

    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Mục tiêu không tìm thấy',
      });
    }

    if (goal.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa mục tiêu này',
      });
    }

    await Goal.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Xóa mục tiêu thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add amount to goal
export const addAmountToGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user?.id || 'default-user';

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền phải lớn hơn 0',
      });
    }

    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Mục tiêu không tìm thấy',
      });
    }

    if (goal.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền cập nhật mục tiêu này',
      });
    }

    goal.currentAmount += amount;

    // Kiểm tra nếu mục tiêu đã hoàn thành
    if (goal.currentAmount >= goal.targetAmount && !goal.isCompleted) {
      goal.isCompleted = true;
      goal.completedAt = new Date();
    }

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Thêm tiền vào mục tiêu thành công',
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get goal statistics
export const getGoalStats = async (req, res) => {
  try {
    const userId = req.user?.id || 'default-user';

    const goals = await Goal.find({ userId }).lean();
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.isCompleted).length;
    const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalGoals,
        completedGoals,
        activeGoals: totalGoals - completedGoals,
        totalTargetAmount,
        totalCurrentAmount,
        overallProgress: totalTargetAmount > 0 ? Math.round((totalCurrentAmount / totalTargetAmount) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
