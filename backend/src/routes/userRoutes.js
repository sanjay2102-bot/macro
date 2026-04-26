const express = require("express");

const { requireAuth } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const { profileSchema } = require("../validators/domainValidators");

const router = express.Router();

router.use(requireAuth);

router.get("/me", (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

router.put(
  "/profile",
  validate(profileSchema),
  asyncHandler(async (req, res) => {
    req.user.profile = req.body;
    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  })
);

module.exports = router;

