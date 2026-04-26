const express = require("express");

const Food = require("../models/Food");
const MessMeal = require("../models/MessMeal");
const { requireAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { foodSchema } = require("../validators/domainValidators");

const router = express.Router();
const messMealRouter = express.Router();

router.use(requireAuth);
messMealRouter.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q, category, vegetarian } = req.query;
    const filter = {};

    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (vegetarian === "true") filter.isVegetarian = true;

    filter.$or = [{ source: "system" }, { createdBy: req.user._id }];

    const foods = await Food.find(filter).sort(q ? { score: { $meta: "textScore" } } : { name: 1 }).limit(80);
    res.json({ foods });
  })
);

router.post(
  "/",
  validate(foodSchema),
  asyncHandler(async (req, res) => {
    const food = await Food.create({ ...req.body, source: "user", createdBy: req.user._id });
    res.status(201).json({ food });
  })
);

messMealRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.set("Cache-Control", "no-store");
    const meals = await MessMeal.find().populate("items.food").sort({ dayOfWeek: 1, mealType: 1, name: 1 });
    res.json({ meals });
  })
);

module.exports = router;
module.exports.messMealRouter = messMealRouter;
