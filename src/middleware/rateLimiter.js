const rateLimit = require("express-rate-limit");

const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes by default
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      error: "Too Many Requests",
      message:
        "You have exceeded the rate limit. Please try again later in 15 minutes.",
    },
    handler: (req, res, next, options) => {
      const error = Object.assign(new Error(options.message.message), {
        status: 403,
        error: options.message.error,
      });
      next(error);
    },
  };

  const limiterOptions = { ...defaultOptions, ...options };

  return rateLimit(limiterOptions);
};

const limiters = {
  // Global rate limiter
  global: createRateLimiter({
    max: 1000,
  }),

  // API endpoints rate limiter
  api: createRateLimiter({
    max: 300,
  }),

  // Auth endpoints rate limiter
  auth: createRateLimiter({
    max: 15, // 15 requests per 15 minutes
  }),

  // Limit use of AI Enhance writer
  api_ai: createRateLimiter({
    max: 30,
  }),
};

module.exports = {
  limiters,
  createRateLimiter,
};
