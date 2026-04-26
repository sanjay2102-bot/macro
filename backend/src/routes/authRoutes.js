const bcrypt = require("bcryptjs");
const express = require("express");

const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/jwt");
const validate = require("../middleware/validate");
const { loginSchema, signupSchema } = require("../validators/authValidators");

const router = express.Router();

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(async (req, res) => {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      const error = new Error("Email is already registered");
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash
    });

    res.status(201).json({ token: signToken(user), user: user.toSafeObject() });
  })
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const valid = user ? await bcrypt.compare(req.body.password, user.passwordHash) : false;

    if (!valid) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    res.json({ token: signToken(user), user: user.toSafeObject() });
  })
);

module.exports = router;

