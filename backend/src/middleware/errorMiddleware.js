function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const status = error.status || error.statusCode || 500;
  res.status(status).json({
    message: error.message || "Internal server error",
    details: process.env.NODE_ENV === "production" ? undefined : error.details
  });
}

module.exports = { notFound, errorHandler };

