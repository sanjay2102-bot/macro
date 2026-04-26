const express = require("express");

const Food = require("../models/Food");
const FoodLog = require("../models/FoodLog");
const MessMeal = require("../models/MessMeal");
const { requireAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { multiplyMacros, sumMacros } = require("../services/macroService");
const { logSchema } = require("../validators/domainValidators");

const router = express.Router();
router.use(requireAuth);

async function buildLogPayload(userId, body) {
  if (body.source === "food") {
    const food = await Food.findOne({ _id: body.foodId, $or: [{ source: "system" }, { createdBy: userId }] });
    if (!food) {
      const error = new Error("Food not found");
      error.status = 404;
      throw error;
    }
    return {
      food: food._id,
      name: food.name,
      macros: multiplyMacros(food.macros, body.quantity),
      quantity: body.quantity
    };
  }

  if (body.source === "messMeal") {
    const meal = await MessMeal.findById(body.messMealId).populate("items.food");
    if (!meal) {
      const error = new Error("Mess meal not found");
      error.status = 404;
      throw error;
    }
    const macros = sumMacros(
      meal.items.map((item) => ({ macros: multiplyMacros(item.food.macros, item.quantity * body.quantity) }))
    );
    return {
      messMeal: meal._id,
      name: meal.name,
      macros,
      quantity: body.quantity
    };
  }

  return {
    name: body.name || "Manual entry",
    macros: multiplyMacros(body.macros, body.quantity),
    quantity: body.quantity
  };
}

router.post(
  "/",
  validate(logSchema),
  asyncHandler(async (req, res) => {
    const payload = await buildLogPayload(req.user._id, req.body);
    const log = await FoodLog.create({
      user: req.user._id,
      date: req.body.date,
      mealType: req.body.mealType,
      source: req.body.source,
      notes: req.body.notes,
      ...payload
    });

    res.status(201).json({ log });
  })
);

router.get(
  "/day/:date",
  asyncHandler(async (req, res) => {
    const logs = await FoodLog.find({ user: req.user._id, date: req.params.date }).sort({ createdAt: 1 });
    res.json({ logs, totals: sumMacros(logs) });
  })
);

router.get(
  "/week/:date",
  asyncHandler(async (req, res) => {
    const anchor = new Date(`${req.params.date}T00:00:00.000Z`);
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(anchor);
      date.setUTCDate(anchor.getUTCDate() - anchor.getUTCDay() + i);
      return date.toISOString().slice(0, 10);
    });
    const logs = await FoodLog.find({ user: req.user._id, date: { $in: dates } });
    res.json({ dates, logs });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await FoodLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      const error = new Error("Log not found");
      error.status = 404;
      throw error;
    }
    res.status(204).send();
  })
);

module.exports = router;

