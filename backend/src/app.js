require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "macrohostel-api" });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

