module.exports = function validate(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      error.status = 400;
      error.details = error.details.map((detail) => detail.message);
      return next(error);
    }

    req.body = value;
    next();
  };
};

