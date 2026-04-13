const rateLimit = require('express-rate-limit');

// General API rate limiter — 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

// Stricter limiter for auth routes — 10 login attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

// Scan limiter — 30 scans per minute per IP (prevents scraping)
const scanLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Scan rate limit exceeded. Maximum 30 scans per minute.'
  }
});

module.exports = { apiLimiter, authLimiter, scanLimiter };