const mongoose = require("mongoose");

const consumedMacrosSchema = new mongoose.Schema(
  {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  { _id: false }
);

const foodLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true, index: true },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true
    },
    source: {
      type: String,
      enum: ["food", "manual", "messMeal", "imageRecognition"],
      default: "food"
    },
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    messMeal: { type: mongoose.Schema.Types.ObjectId, ref: "MessMeal" },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 0.1 },
    macros: { type: consumedMacrosSchema, required: true },
    notes: String
  },
  { timestamps: true }
);

foodLogSchema.index({ user: 1, date: 1, mealType: 1 });

module.exports = mongoose.model("FoodLog", foodLogSchema);

