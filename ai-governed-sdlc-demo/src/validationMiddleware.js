/**
 * Validation Middleware
 * 
 * Generated with: GitHub Copilot (AI-assisted)
 * Reviewed by: Human developer
 * Purpose: Input sanitization and security validation layer
 */

/**
 * Sanitizes string input to prevent injection attacks
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')    // Remove angle brackets (XSS prevention)
    .replace(/javascript:/gi, '')  // Remove javascript: protocol
    .replace(/on\w+=/gi, '')       // Remove event handlers
    .trim();
}

/**
 * Validates and sanitizes request body
 * @param {Array} requiredFields - List of required field names
 * @returns {Function} Express middleware function
 */
function validateBody(requiredFields = []) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Request body is required',
        code: 'INVALID_BODY'
      });
    }

    // Check required fields
    const missing = requiredFields.filter(field => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(', ')}`,
        code: 'MISSING_FIELDS',
        fields: missing
      });
    }

    // Sanitize string fields
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = sanitizeString(value);
      }
    }

    next();
  };
}

/**
 * Validates UUID format for path parameters
 * @param {string} paramName - Name of the parameter to validate
 * @returns {Function} Express middleware function
 */
function validateUUID(paramName) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return (req, res, next) => {
    const value = req.params[paramName];

    if (!value || !uuidRegex.test(value)) {
      return res.status(400).json({
        error: `Invalid ${paramName} format. Expected UUID v4.`,
        code: 'INVALID_UUID'
      });
    }

    next();
  };
}

/**
 * Rate limit tracking (simple in-memory implementation)
 * In production, use Redis or similar distributed store
 */
const requestCounts = new Map();

function simpleRateLimit({ windowMs = 60000, maxRequests = 100 } = {}) {
  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    const record = requestCounts.get(key);

    if (now > record.resetAt) {
      record.count = 1;
      record.resetAt = now + windowMs;
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        code: 'RATE_LIMITED',
        retryAfter: Math.ceil((record.resetAt - now) / 1000)
      });
    }

    next();
  };
}

/**
 * Error handling middleware
 */
function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  res.status(status).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = {
  sanitizeString,
  validateBody,
  validateUUID,
  simpleRateLimit,
  errorHandler
};
