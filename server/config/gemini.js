const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

let geminiModel = null;

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
  console.error("🚨 GEMINI WARNING: GEMINI_API_KEY is missing or invalid in your .env file!");
  console.log("🛡️ FAIL-SAFE MODE: AI services will automatically route through simulated forensics to keep the app functional.");
} else {
  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiModel = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("🚀 Gemini AI Engine initialized successfully with gemini-2.5-flash!");
  } catch (err) {
    console.error("🚨 GEMINI INITIALIZATION FAILED:", err.message);
    geminiModel = null;
  }
}

module.exports = geminiModel;