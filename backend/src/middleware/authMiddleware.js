const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/jwt");

const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    const error = new Error("Authentication token is required");
    error.status = 401;
    throw error;
  }

  const payload = verifyToken(token);
  const user = await User.findById(payload.sub);
  if (!user) {
    const error = new Error("User no longer exists");
    error.status = 401;
    throw error;
  }

  req.user = user;
  next();
});

module.exports = { requireAuth };

