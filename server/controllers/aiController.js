const geminiModel = require("../config/gemini");
const Threat = require("../models/Threat");

const getLocalFallback = (text, language) => {
  const isHighRisk = /lottery|won|winner|kbc|electricity|power|bill|disconnected|kyc|otp|blocked/i.test(text);
  
  let typeFallback = language === "hindi" 
    ? (isHighRisk ? "संदिग्ध धोखाधड़ी" : "सुरक्षित संदेश") 
    : (isHighRisk ? "Suspicious Scam Threat" : "Safe Message");
    
  let reasonFallback = language === "hindi" 
    ? "सिस्टम सुरक्षा नियमों के आधार पर इस संदेश का विश्लेषण किया गया है।" 
    : "Evaluated by local backup rule engine based on high-risk keywords.";

  if (/lottery|won|winner|kbc/i.test(text)) {
    typeFallback = language === "hindi" ? "लॉटरी फ्रॉड / केबीसी घोटाला" : "Lottery Fraud / KBC Scam";
  } else if (/electricity|power|bill|disconnected/i.test(text)) {
    typeFallback = language === "hindi" ? "बिजली बिल फ्रॉड" : "Utility Bill Fraud";
  }

  return {
    isScam: isHighRisk,
    confidenceScore: isHighRisk ? 90 : 20,
    threatType: typeFallback,
    analysisReason: reasonFallback,
    immediateActionSteps: isHighRisk 
      ? (language === "hindi" 
          ? ["इस नंबर पर कोई प्रतिक्रिया न दें।", "अपनी कोई भी निजी जानकारी साझा न करें।", "इस संदेश को तुरंत ब्लॉक और रिपोर्ट करें।"]
          : ["Do not reply or click any links.", "Never share personal or banking details.", "Block the sender and report immediately."])
      : (language === "hindi"
          ? ["यह संदेश सुरक्षित प्रतीत होता है।", "सामान्य सावधानी बरतें।", "अपरिचित लिंक्स पर क्लिक करने से बचें।"]
          : ["This message appears to be safe.", "Exercise standard caution.", "Avoid clicking unverified links."])
  };
};

exports.analyzeSuspiciousText = async (req, res) => {
  try {
    const { text, language = "english" } = req.body; 

    if (!text) {
      return res.status(400).json({ success: false, message: "Text is required" });
    }

    const prompt = `
      You are an objective and precise Text Classification Engine specializing in identifying phishing/scams versus legitimate communications. 
      Your goal is to avoid false positives (marking safe messages as scams) while accurately detecting actual fraudulent intent.

      CURRENT YEAR CONTEXT: 2026.
      Text to evaluate: "${text}"

      CRITICAL EVALUATION CRITERIA:
      - SAFE (isScam: false): Look for legitimate transactional alerts (e.g., standard bank debits/credits without urgent call-to-actions, clear official shortcodes), regular promotional offers that don't demand immediate action or sensitive info, and normal casual/personal conversations. If there is no explicit financial threat, urgent account blocking, or social engineering trap, classify it as SAFE.
      - SCAM (isScam: true): Look for high-pressure tactics (e.g., "Electricity will be cut tonight", "KYC block within 24 hours"), requests for OTPs/passwords, shady links (bit.ly, unverified .net/.org domains), or suspicious 10-digit mobile numbers masked as customer care executives.

      LANGUAGE REQUIREMENTS:
      The response must be customized based on the requested language ("${language}").
      - If language is "hindi", the fields 'threatType', 'analysisReason', and 'immediateActionSteps' MUST be written in fluent Hindi (Devanagari script). If the text is SAFE, 'threatType' should be "सुरक्षित / सामान्य संदेश" and 'analysisReason' should explain why it's safe.
      - If language is "english", those fields MUST be in professional English.
    `;

    let aiData = null;

    if (!geminiModel) {
      console.log("=== ⚠️ GEMINI MODEL IS NULL. ACTIVATING LOCAL FALLBACK ===");
      aiData = getLocalFallback(text, language);
    } else {
      try {
        const result = await geminiModel.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                isScam: { type: "boolean" },
                confidenceScore: { type: "integer" },
                threatType: { type: "string" },
                analysisReason: { type: "string" },
                immediateActionSteps: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["isScam", "confidenceScore", "threatType", "analysisReason", "immediateActionSteps"]
            }
          }
        });
        
        const responseText = result.response.text();
        aiData = JSON.parse(responseText.trim());
      } catch (error) {
        console.log("=== ⚠️ GEMINI RUNTIME ERROR! USING DYNAMIC FALLBACK ===");
        console.error(error);
        aiData = getLocalFallback(text, language);
      }
    }

    if (!aiData) aiData = getLocalFallback(text, language);

    let savedThreat = null;
    
    if (aiData.isScam === true) {
      try {
        savedThreat = await Threat.create({
          textSnippet: text, 
          threatType: aiData.threatType,         
          confidenceScore: aiData.confidenceScore, 
          language: language,                    
          status: "active"                       
        });
        console.log("=== SCAM SAVED TO MONGODB ===", savedThreat._id);
      } catch (dbErr) {
        console.error("🚨 MONGODB WRITE FAILED, BUT KEEPING RESPONSE ALIVE:", dbErr.message);
      }
    }

    return res.status(200).json({ 
      success: true, 
      data: aiData,
      dbSaved: !!savedThreat 
    });

  } catch (masterError) {
    console.log("=== MASTER CONTROLLER CRASH ===", masterError); 
    return res.status(200).json({ 
      success: true, 
      data: getLocalFallback(req.body.text || "", req.body.language || "english"),
      dbSaved: false 
    });
  }
};

exports.getThreatFeed = async (req, res) => {
  try {
    const feeds = await Threat.find().sort({ createdAt: -1 }).limit(10); 
    return res.status(200).json({ success: true, data: feeds });
  } catch (error) {
    return res.status(200).json({ success: true, data: [] });
  }
};

exports.getAnalyticsStats = async (req, res) => {
  try {
    const totalDetected = await Threat.countDocuments();

    const bankingFrauds = await Threat.countDocuments({ 
      $or: [
        { threatType: /banking/i },
        { threatType: /phishing/i },
        { threatType: /बैंकिंग/i }
      ]
    });

    const utilityFrauds = await Threat.countDocuments({ 
      $or: [
        { threatType: /utility/i },
        { threatType: /electricity/i },
        { threatType: /bill/i },
        { threatType: /बिजली/i }
      ]
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalDetected: totalDetected || 0,
        bankingFrauds: bankingFrauds || 0,
        utilityFrauds: utilityFrauds || 0,
        communityAlerts: totalDetected || 0
      }
    });

  } catch (error) {
    console.error("Analytics Stats Error:", error);
    return res.status(200).json({
      success: true,
      stats: { totalDetected: 0, bankingFrauds: 0, utilityFrauds: 0, communityAlerts: 0 }
    });
  }
};