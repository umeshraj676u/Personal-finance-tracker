const Income = require("../models/incomeModel");

//    Get all income entries for a user

const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get single income entry

const getIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!income) {
      return res.status(404).json({ message: "Income entry not found" });
    }

    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Create income entry

const createIncome = async (req, res) => {
  try {
    const { amount, source, frequency, isRecurring, date, description } = req.body;

    if (!amount || !source || !date) {
      return res.status(400).json({ message: "Please provide amount, source, and date" });
    }

    const income = await Income.create({
      user: req.user._id,
      amount,
      source,
      frequency: frequency || "monthly",
      isRecurring: isRecurring || false,
      date,
      description: description || ""
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Update income entry

const updateIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!income) {
      return res.status(404).json({ message: "Income entry not found" });
    }

    const { amount, source, frequency, isRecurring, date, description } = req.body;

    income.amount = amount || income.amount;
    income.source = source || income.source;
    income.frequency = frequency || income.frequency;
    income.isRecurring = isRecurring !== undefined ? isRecurring : income.isRecurring;
    income.date = date || income.date;
    income.description = description !== undefined ? description : income.description;

    
    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   Delete income entry

const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!income) {
      return res.status(404).json({ message: "Income entry not found" });
    }

    await income.deleteOne();
    res.json({ message: "Income entry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome
};
