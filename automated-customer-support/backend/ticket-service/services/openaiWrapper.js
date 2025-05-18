const { OpenAI } = require("openai");

class OpenAISafetyWrapper {
  constructor(redis) {
    this.redis = redis;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 15000
    });
    console.log("[OpenAI Wrapper] Initialized. Key present:", !!process.env.OPENAI_API_KEY);
  }

  async generate(prompt) {
    // Check quota
    const quota = await this.redis.get("openai:quota_remaining");
    console.log("[OpenAI Wrapper] Quota at start of generate:", quota);

    if (quota && parseInt(quota) <= 0) {
      console.warn("[OpenAI Wrapper] Quota exhausted!");
      throw new Error("QUOTA_EXHAUSTED");
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150
      });

      // Update quota (fire-and-forget)
      if (response.usage?.total_tokens) {
        this.redis.decrBy("openai:quota_remaining", response.usage.total_tokens)
          .catch(console.error);
      }

      console.log("[OpenAI Wrapper] Got OpenAI answer:", response.choices?.[0]?.message?.content);

      return response.choices[0].message.content;
    } catch (err) {
      console.error("[OpenAI Wrapper] OpenAI call failed:", err);
      if (err.status === 429 || err.code === "ETIMEDOUT") {
        await this.redis.set("openai:quota_remaining", 0);
      }
      throw err;
    }
  }
}

module.exports = (redis) => new OpenAISafetyWrapper(redis);
