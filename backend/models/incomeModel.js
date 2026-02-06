const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
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
    source: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true,
      enum: ["one-time", "weekly", "bi-weekly", "monthly", "yearly"],
      default: "monthly"
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    description: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
