const Budget = require("../models/budgetModel");
const Expense = require("../models/expenseModel");

//   Get all budgets for a user

const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const queryMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const queryYear = year ? parseInt(year) : currentDate.getFullYear();

    const budgets = await Budget.find({
      user: req.user._id,
      month: queryMonth,
      year: queryYear
    });

    // Calculate spent amounts for each budget
    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(queryYear, queryMonth - 1, 1);
        const endDate = new Date(queryYear, queryMonth, 0, 23, 59, 59);

        const expenses = await Expense.find({
          user: req.user._id,
          category: budget.category,
          date: { $gte: startDate, $lte: endDate }
        });

        const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remaining = budget.amount - spent;
        const percentage = (spent / budget.amount) * 100;

        return {
          ...budget.toObject(),
          spent,
          remaining,
          percentage: Math.min(percentage, 100)
        };
      })
    );

    res.json(budgetsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Get single budget

const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Calculate spent amount
    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user._id,
      category: budget.category,
      date: { $gte: startDate, $lte: endDate }
    });

    const spent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;

    res.json({
      ...budget.toObject(),
      spent,
      remaining,
      percentage: Math.min(percentage, 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Create budget

const createBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      return res.status(400).json({ message: "Please provide category, amount, month, and year" });
    }

    // Check if budget already exists
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category,
      month: parseInt(month),
      year: parseInt(year)
    });

    if (existingBudget) {
      return res.status(400).json({ message: "Budget for this category and month already exists" });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount,
      month: parseInt(month),
      year: parseInt(year)
    });

    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Budget for this category and month already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

//  Update budget

const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const { amount, category, month, year } = req.body;

    budget.amount = amount || budget.amount;
    budget.category = category || budget.category;
    budget.month = month ? parseInt(month) : budget.month;
    budget.year = year ? parseInt(year) : budget.year;

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Delete budget

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await budget.deleteOne();
    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget
};
