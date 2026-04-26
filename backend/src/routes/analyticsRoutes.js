const express = require("express");

const FoodLog = require("../models/FoodLog");
const { requireAuth } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const { macroProgress, sumMacros } = require("../services/macroService");
const { buildSuggestions } = require("../services/suggestionService");

const router = express.Router();
const suggestionRouter = express.Router();

router.use(requireAuth);
suggestionRouter.use(requireAuth);

function weekDates(dateString) {
  const anchor = new Date(`${dateString}T00:00:00.000Z`);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(anchor);
    date.setUTCDate(anchor.getUTCDate() - anchor.getUTCDay() + i);
    return date.toISOString().slice(0, 10);
  });
}

router.get(
  "/daily/:date",
  asyncHandler(async (req, res) => {
    const logs = await FoodLog.find({ user: req.user._id, date: req.params.date }).sort({ mealType: 1 });
    const totals = sumMacros(logs);
    const progress = macroProgress(totals, req.user.macroTargets);
    res.json({ date: req.params.date, totals, targets: req.user.macroTargets, progress, logs });
  })
);

router.get(
  "/weekly/:date",
  asyncHandler(async (req, res) => {
    const dates = weekDates(req.params.date);
    const logs = await FoodLog.find({ user: req.user._id, date: { $in: dates } });
    const days = dates.map((date) => {
      const dayLogs = logs.filter((log) => log.date === date);
      const totals = sumMacros(dayLogs);
      return { date, totals, progress: macroProgress(totals, req.user.macroTargets) };
    });
    res.json({ dates, days, targets: req.user.macroTargets });
  })
);

suggestionRouter.get(
  "/:date",
  asyncHandler(async (req, res) => {
    const logs = await FoodLog.find({ user: req.user._id, date: req.params.date });
    const totals = sumMacros(logs);
    const progress = macroProgress(totals, req.user.macroTargets);
    res.json({ suggestions: buildSuggestions(progress, req.user.goal), progress });
  })
);

module.exports = router;
module.exports.suggestionRouter = suggestionRouter;

