// utils/scrapeWebsite.js
const axios = require("axios");
const cheerio = require("cheerio");

// ✅ Function to validate the URL and ensure it's HTTPS
const isAllowedUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:"; // Only allow HTTPS URLs
  } catch {
    return false;
  }
};

// ✅ Scrape function to extract visible text content from common HTML tags
const scrapeWebsite = async (url) => {
  if (!isAllowedUrl(url)) {
    console.warn("❌ Disallowed or invalid URL:", url);
    return null;
  }

  try {
    const { data } = await axios.get(url, {
      timeout: 10000, // increased timeout for slower sites
      headers: {
        "User-Agent": "Mozilla/5.0 (AutoSupportAI-Bot)",
      },
    });

    const $ = cheerio.load(data);

    let content = "";
    $("h1, h2, h3, h4, p, li, section, article").each((_, el) => {
      content += $(el).text() + "\n";
    });

    const cleaned = content.replace(/\s+/g, " ").trim().substring(0, 4000);
    return cleaned;
  } catch (err) {
    console.error("❌ Scrape error:", err.message);
    return null;
  }
};

module.exports = scrapeWebsite;
