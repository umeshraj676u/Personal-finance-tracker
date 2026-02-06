const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: [
        "groceries",
        "utilities",
        "gym",
        "entertainment",
        "dining",
        "transportation",
        "clothing",
        "healthcare",
        "education",
        "housing",
        "other"
      ]
    },
    description: {
      type: String,
      default: ""
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
