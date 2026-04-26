const mongoose = require("mongoose");

const messMealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dayOfWeek: {
      type: String,
      enum: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      required: true,
      index: true
    },
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], required: true },
    description: String,
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        quantity: { type: Number, default: 1 }
      }
    ],
    tags: [{ type: String }],
    hostelRegion: {
      type: String,
      enum: ["north", "south", "west", "east", "mixed"],
      default: "mixed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessMeal", messMealSchema);
