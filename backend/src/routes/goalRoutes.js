const express = require("express");

const { requireAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { calculateTargets } = require("../services/macroService");
const { goalSchema } = require("../validators/domainValidators");

const router = express.Router();
router.use(requireAuth);

router.post(
  "/calculate",
  validate(goalSchema),
  (req, res) => {
    res.json({ targets: calculateTargets(req.body.profile, req.body.goal) });
  }
);

router.put(
  "/",
  validate(goalSchema),
  asyncHandler(async (req, res) => {
    req.user.profile = req.body.profile;
    req.user.goal = req.body.goal;
    req.user.macroTargets = calculateTargets(req.body.profile, req.body.goal);
    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  })
);

module.exports = router;

