const express = require("express");
const router = express.Router();
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByCategory
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getExpenses).post(createExpense);
router.route("/:id").get(getExpense).put(updateExpense).delete(deleteExpense);
router.route("/category/:category").get(getExpensesByCategory);

module.exports = router;
