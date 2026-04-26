const mongoose = require("mongoose");

const macroTargetSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 2200 },
    protein: { type: Number, default: 120 },
    carbs: { type: Number, default: 280 },
    fats: { type: Number, default: 65 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profile: {
      age: Number,
      gender: { type: String, enum: ["male", "female", "other"], default: "male" },
      heightCm: Number,
      weightKg: Number,
      activityLevel: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "athlete"],
        default: "moderate"
      },
      hostelName: String,
      isVegetarian: { type: Boolean, default: false }
    },
    goal: {
      type: String,
      enum: ["bulking", "cutting", "maintenance"],
      default: "maintenance"
    },
    macroTargets: { type: macroTargetSchema, default: () => ({}) }
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function toSafeObject() {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

module.exports = mongoose.model("User", userSchema);

