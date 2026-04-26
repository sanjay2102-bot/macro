const express = require("express");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const foodRoutes = require("./foodRoutes");
const logRoutes = require("./logRoutes");
const goalRoutes = require("./goalRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const aiRoutes = require("./aiRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/foods", foodRoutes);
router.use("/mess-meals", foodRoutes.messMealRouter);
router.use("/logs", logRoutes);
router.use("/goals", goalRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/suggestions", analyticsRoutes.suggestionRouter);
router.use("/ai", aiRoutes);
router.use("/assistant", aiRoutes.assistantRouter);

module.exports = router;

