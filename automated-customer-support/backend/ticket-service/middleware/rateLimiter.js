// middleware/rateLimiter.js
module.exports = (redis) => (maxRequests, windowSec) => {
  return async (req, res, next) => {
    const key = `rate_limit:${req.ip}`;

    if (!redis) {
      console.error("❌ Redis client not passed to rateLimiter! Skipping.");
      return next();
    }

    try {
      const current = await redis.incr(key);
      if (current > maxRequests) {
        return res.status(429).json({
          error: `Rate limit exceeded (${maxRequests} requests/day)`
        });
      }
      if (current === 1) {
        await redis.expire(key, windowSec);
      }
      next();
    } catch (err) {
      console.error("Rate limiter failed:", err);
      next(); // Fail open
    }
  };
};
