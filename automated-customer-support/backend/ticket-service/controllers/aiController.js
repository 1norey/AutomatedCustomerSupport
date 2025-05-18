const MockAI = require('../services/mockAI');
const AiLog = require("../models/AiLog");

module.exports = (redis) => {
  const openai = require("../services/openaiWrapper")(redis);

  return {
    tryNow: async (req, res) => {
      const { question } = req.body;
      console.log("[AI Controller] Received question:", question);

      try {
        console.log("[AI Controller] Using OpenAI KEY:", process.env.OPENAI_API_KEY ? "SET" : "NOT SET");
        const quota = await redis.get("openai:quota_remaining");
        console.log("[AI Controller] Quota before OpenAI call:", quota);

        const response = await openai.generate(question);

        await AiLog.create({
          userId: req.user?.id,
          question,
          response,
          source: "openai"
        });

        console.log("[AI Controller] OpenAI response:", response);

        res.json({ response });
      } catch (err) {
        console.error("[AI Controller] OpenAI error:", err);
        const mockResponse = MockAI.generate(question);

        await AiLog.create({
          userId: req.user?.id,
          question,
          response: mockResponse,
          source: "mock"
        });

        res.json({
          response: mockResponse,
          warning: err.message === "QUOTA_EXHAUSTED"
            ? "Free quota exhausted"
            : "AI service unavailable"
        });
      }
    }
  };
};
