const express = require("express");

module.exports = (redis) => {
  const router = express.Router();
  const rateLimiter = require("../middleware/rateLimiter")(redis);
  const controller = require("../controllers/aiController")(redis);

  // LOG: Router initialized
  console.log("AI router initialized with Redis:", !!redis);

  router.post("/try-now",
    rateLimiter(100, 24 * 60 * 60), // 100 requests per day
    controller.tryNow
  );

  router.get("/status", async (req, res) => {
    const quota = await redis.get("openai:quota_remaining");
    res.json({
      active: !!process.env.OPENAI_API_KEY,
      remainingQuota: quota || 0
    });
  });

  return router;
};
