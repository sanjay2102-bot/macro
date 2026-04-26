const Joi = require("joi");

const macroSchema = Joi.object({
  calories: Joi.number().min(0).required(),
  protein: Joi.number().min(0).required(),
  carbs: Joi.number().min(0).required(),
  fats: Joi.number().min(0).required()
});

const profileSchema = Joi.object({
  age: Joi.number().min(13).max(90).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  heightCm: Joi.number().min(100).max(230).required(),
  weightKg: Joi.number().min(30).max(250).required(),
  activityLevel: Joi.string().valid("sedentary", "light", "moderate", "active", "athlete").required(),
  hostelName: Joi.string().allow("").max(120),
  isVegetarian: Joi.boolean()
});

const foodSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  aliases: Joi.array().items(Joi.string().max(80)).default([]),
  category: Joi.string().valid("grain", "dal", "sabzi", "protein", "snack", "dairy", "drink", "meal", "other"),
  serving: Joi.object({
    label: Joi.string().required(),
    grams: Joi.number().positive().required()
  }).required(),
  macros: macroSchema.required(),
  tags: Joi.array().items(Joi.string().max(40)).default([]),
  isVegetarian: Joi.boolean().default(true)
});

const logSchema = Joi.object({
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  mealType: Joi.string().valid("breakfast", "lunch", "dinner", "snack").required(),
  source: Joi.string().valid("food", "manual", "messMeal", "imageRecognition").required(),
  foodId: Joi.string(),
  messMealId: Joi.string(),
  name: Joi.string().max(120),
  quantity: Joi.number().min(0.1).default(1),
  macros: macroSchema,
  notes: Joi.string().allow("").max(300)
});

const goalSchema = Joi.object({
  goal: Joi.string().valid("bulking", "cutting", "maintenance").required(),
  profile: profileSchema.required()
});

module.exports = { foodSchema, logSchema, goalSchema, profileSchema };

