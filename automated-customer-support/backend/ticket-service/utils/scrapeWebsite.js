const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

// Allowed domains (whitelist for safety - optional)
const ALLOWED_DOMAINS = new Set([
  "example.com",
  "trustedsite.org"
]);

// Blocked domains (blacklist)
const BLOCKED_DOMAINS = new Set([
  "localhost",
  "127.0.0.1",
  "internal.site"
]);

// ✅ Enhanced URL validation
const isAllowedUrl = (url) => {
  try {
    const parsed = new URL(url);
    
    // Protocol check
    if (parsed.protocol !== "https:") return false;
    
    // Domain checks
    const domain = parsed.hostname.replace("www.", "");
    if (BLOCKED_DOMAINS.has(domain)) return false;
    
    // Optional: Only allow specific domains
    // if (ALLOWED_DOMAINS.size > 0 && !ALLOWED_DOMAINS.has(domain)) return false;
    
    return true;
  } catch {
    return false;
  }
};

// ✅ Robust scraping with sanitization
const scrapeWebsite = async (url) => {
  // Validate URL
  if (!isAllowedUrl(url)) {
    console.warn("❌ Blocked URL:", url);
    throw new Error("URL not allowed");
  }

  try {
    // Fetch with timeout and custom headers
    const { data } = await axios.get(url, {
      timeout: 15000, // 15s timeout
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AutoSupportAI/1.0; +https://yoursite.com/bot)",
        "Accept": "text/html",
        "Accept-Language": "en-US,en"
      },
      maxRedirects: 2,
      validateStatus: (status) => status >= 200 && status < 400
    });

    // Sanitize and parse
    const $ = cheerio.load(data, {
      decodeEntities: true,
      xmlMode: false
    });

    // Remove unwanted elements
    $("script, style, iframe, noscript").remove();

    // Extract and clean text
    let content = "";
    $("h1, h2, h3, h4, p, li, article").each((_, el) => {
      const text = $(el).text().trim();
      if (text) content += text + "\n";
    });

    // Truncate and clean
    return content
      .replace(/\s+/g, " ")
      .replace(/[^\w\s.,!?\-]/g, "") // Basic sanitization
      .substring(0, 8000); // ~2k tokens
  } catch (err) {
    console.error("❌ Scrape failed:", err.message);
    throw new Error(`Could not fetch content: ${err.message}`);
  }
};

// Cache layer (optional)
const scrapeCache = new Map();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

module.exports = async (url) => {
  // Cache check
  if (scrapeCache.has(url)) {
    return scrapeCache.get(url);
  }

  const content = await scrapeWebsite(url);
  
  // Cache result
  scrapeCache.set(url, content);
  setTimeout(() => scrapeCache.delete(url), CACHE_TTL);
  
  return content;
};