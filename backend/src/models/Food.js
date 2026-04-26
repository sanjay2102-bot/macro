const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: "text" },
    aliases: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: ["grain", "dal", "sabzi", "protein", "snack", "dairy", "drink", "meal", "other"],
      default: "other"
    },
    serving: {
      label: { type: String, required: true },
      grams: { type: Number, required: true }
    },
    macros: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fats: { type: Number, required: true }
    },
    tags: [{ type: String, index: true }],
    isVegetarian: { type: Boolean, default: true },
    source: { type: String, enum: ["system", "user"], default: "system" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);

