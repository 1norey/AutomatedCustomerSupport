// controllers/aiController.js
console.log("📡 aiController.js loaded");

const scrapeWebsite = require("../utils/scrapeWebsite");
const Cohere = require("cohere-ai");

// ✅ Initialize Cohere with environment token
const cohere = new Cohere.CohereClient({
  token: process.env.COHERE_API_KEY,
});

exports.tryNow = async (req, res) => {
  const { url, question } = req.body;

  console.log("📥 Received TryNow request");
  console.log("🌐 URL:", url);
  console.log("❓ Question:", question);

  // 🛑 Check for missing fields
  if (!url || !question) {
    console.log("❌ Missing input fields");
    return res.status(400).json({ message: "URL and question required" });
  }

  // 🔍 Scrape content from the provided URL
  //const context = await scrapeWebsite(url);
  //if (!context) {
   // console.warn("⚠️ Scraping failed or site not allowed");
   // return res.json({
    //  response:
    //    "I'm unable to access the website content. Please ensure it's publicly available or try another domain.",
   // });
  //}
  const context = "Test context about this website.";

  console.log("📄 Scraped content preview:", context.slice(0, 150) + "...");

  try {
    const prompt = `Context from website:\n${context}\n\nUser question: ${question}\nAnswer:`;

    console.log("🚀 Sending prompt to Cohere...");

    const response = await cohere.generate({
      model: "command",
      prompt,
      maxTokens: 300,
      temperature: 0.5,
    });

    const answer = response.generations[0]?.text?.trim() || "No answer generated.";
    console.log("✅ AI response preview:", answer.slice(0, 100) + "...");
    res.json({ response: answer });
  } catch (err) {
    console.error("❌ Cohere API error:", err.message);
    res.status(500).json({ message: "AI failed to respond" });
  }
};
