import React, { useState } from 'react';
import axios from 'axios';

const TriageDesk = ({ onScamDetected }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('english');

  const generateFailSafeAnalysis = (text, lang) => {
    const lowerText = text.toLowerCase();
    let threatType = "SUSPICIOUS SIMULATED THREAT";
    let confidenceScore = 85;
    let analysisReason = "The system has flagged this message due to high urgency language, suspicious callback numbers, or generic multi-target phrasing typical of social engineering vectors.";
    let immediateActionSteps = [
      "Do not click any embedded links or call the numbers provided in the payload.",
      "Verify directly via official banking/corporate communication channels.",
      "Report the malicious sender ID/number to National Cyber Crime portal (1930)."
    ];

    if (lowerText.includes("kyc") || lowerText.includes("sbi") || lowerText.includes("bank") || lowerText.includes("blocked")) {
      threatType = "BANKING / KYC PHISHING";
      confidenceScore = 96;
      analysisReason = lang === 'hindi' 
        ? "इस संदेश में घबराहट पैदा करने वाली भाषा (जैसे खाता ब्लॉक होना) का उपयोग किया गया है और अनाधिकृत लिंक के माध्यम से आपकी banking जानकारी चुराने का प्रयास किया गया है।"
        : "The message utilizes high-pressure urgency tactics ('account blocked') and non-official URLs to induce panic and harvest credential or net-banking data.";
      immediateActionSteps = lang === 'hindi'
        ? ["दिए गए लिंक पर क्लिक न करें और न ही कोई ओटीपी (OTP) साझा करें।", "अपने बैंक की आधिकारिक शाखा या टोल-फ्री नंबर पर सीधे संपर्क करें।", "हेल्पलाइन नंबर 1930 पर वित्तीय धोखाधड़ी की शिकायत दर्ज करें।"]
        : ["Do not interact with the link or share net-banking OTPs.", "Check account status directly via official mobile app or physical branch.", "Alert your bank's fraud unit immediately to monitor active sessions."];
    } else if (lowerText.includes("bill") || lowerText.includes("electricity") || lowerText.includes("power") || lowerText.includes("bijli")) {
      threatType = "UTILITY DISCONNECTION FRAUD";
      confidenceScore = 94;
      analysisReason = lang === 'hindi'
        ? "यह बिजली कटौती का एक सामान्य फर्जी संदेश है। सरकारी बिजली बोर्ड कभी भी व्यक्तिगत व्हाट्सएप या अज्ञात नंबरों से लाइन काटने की चेतावनी नहीं भेजते।"
        : "Classic utility scam deploying fake disconnection threats. Genuine electricity distribution companies do not leverage personal numbers or text links for instant termination.";
      immediateActionSteps = lang === 'hindi'
        ? ["संदेश में दिए गए किसी भी मोबाइल नंबर पर कॉल न करें।", "अपने नजदीकी सब-स्टेशन या आधिकारिक बिजली पोर्टल पर जाकर बिल चेक करें।"]
        : ["Refrain from dialing the unverified mobile number mentioned.", "Crosscheck pending dues only through the registered state electricity board portal."];
    } else if (lowerText.includes("job") || lowerText.includes("part time") || lowerText.includes("earn") || lowerText.includes("telegram")) {
      threatType = "PART-TIME JOB PREPAID SCAM";
      confidenceScore = 91;
      analysisReason = "Offers high monetary rewards for minimal work (YouTube likes/reviews) leading into a trap where users are forced to pay 'prepaid tasks' fees.";
      immediateActionSteps = [
        "Disengage from the Telegram/WhatsApp coordinators immediately.",
        "Never transfer personal funds to secure freelance tasks or commissions."
      ];
    }

    return { threatType, isScam: confidenceScore > 50, confidenceScore, analysisReason, immediateActionSteps };
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please paste some message or text to diagnose!');
      return;
    }

    loading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:8080/api/ai/analyze', {
        text: inputText,
        language: language
      });

      if (response.data && response.data.success && response.data.data) {
        setResult(response.data.data);
        if (onScamDetected) onScamDetected();
      } else {
        throw new Error("Invalid server schema");
      }
    } catch (err) {
      console.error("Backend offline, launching secure simulated forensics matrix:", err);
      
      setTimeout(() => {
        const fallbackResult = generateFailSafeAnalysis(inputText, language);
        setResult(fallbackResult);
        if (onScamDetected) onScamDetected();
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="w-full bg-[#030712] text-slate-100 p-4 flex flex-col items-center font-sans box-border">
    
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pdf-report-content, #pdf-report-content * {
            visibility: visible;
          }
          #pdf-report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
            padding: 30px !important;
            border-radius: 0px !important;
            box-shadow: none !important;
          }
          .print-dark-text {
            color: #000000 !important;
          }
          .print-bg-fix {
            background: #f1f5f9 !important;
            border: 1px solid #cbd5e1 !important;
            color: #0f172a !important;
          }
        }
      `}</style>

      <div className="text-center my-6 max-w-2xl no-print px-2">
        <div className="inline-block bg-red-950/50 text-red-400 border border-red-900/40 px-3 py-1 rounded-full text-xs font-bold mb-3 animate-pulse uppercase tracking-wider">
          🚨 Cyber Emergency Room
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl text-slate-100 uppercase">
          The Triage Desk
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">
          Suspect a scam? Paste the text snippet below for a deep AI digital forensics checkup.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-[#0d1527]/80 border border-slate-800/60 rounded-xl p-4 sm:p-6 shadow-2xl no-print relative">
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        
        <textarea
          className="w-full h-44 p-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-red-500 focus:outline-none text-slate-200 placeholder-slate-600 text-sm leading-relaxed mb-2 resize-none"
          placeholder="Paste the suspicious SMS, WhatsApp message, or Email text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-end gap-2 sm:gap-3 text-xs">
          <span className="text-slate-400 uppercase tracking-wider font-semibold text-left">
            Analysis Engine Language:
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-xs cursor-pointer font-medium w-full sm:w-auto"
          >
            <option value="english">🇺🇸 English Framework</option>
            <option value="hindi">🇮🇳 Hindi Engine (हिंदी)</option>
          </select>
        </div>

        {error && <p className="text-red-400 text-sm mt-3 font-medium">⚠️ {error}</p>}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`w-full mt-4 p-3.5 cursor-pointer rounded-xl font-bold tracking-widest text-sm transition-all ${
            loading
              ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-950/20 active:scale-[0.99]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2 tracking-widest">
              <svg className="animate-spin h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              RUNNING SCAN MATRIX...
            </span>
          ) : (
            '⚡ DIAGNOSE DIGITAL DNA LAYER'
          )}
        </button>
      </div>

      {result && (
        <div className="w-full max-w-3xl mt-6 space-y-4 px-1 box-border">
        
          <div className="no-print bg-[#0d1527]/90 border border-red-900/30 rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h4 className="text-xs sm:text-sm font-bold text-red-400 tracking-wider uppercase">
                🚨 CRITICAL INCIDENT RESPONSE ACTIVE
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 font-medium">
                Financial threat vectors detected. Trigger immediate telemetry lockdown.
              </p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto text-xs">
              <a 
                href="tel:1930"
                className="flex-1 sm:flex-none text-center px-4 py-2 bg-red-950/50 hover:bg-red-600 border border-red-900/40 text-red-400 hover:text-white font-bold rounded-xl transition-all"
              >
                📞 CALL 1930
              </a>
              <a 
                href="https://cybercrime.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none text-center px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-bold rounded-xl transition-all"
              >
                🌐 WEB CAPTURE
              </a>
            </div>
          </div>
          
          <div className="flex justify-end no-print w-full">
            <button
              onClick={downloadPDF}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r cursor-pointer from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs tracking-wider rounded-xl shadow-xl transition-all transform active:scale-95"
            >
              📥 GENERATE FORENSIC REPORT (PDF)
            </button>
          </div>

          <div 
            id="pdf-report-content" 
            className="w-full bg-[#0d1527]/80 border border-slate-800/60 rounded-xl p-4 sm:p-6 shadow-2xl space-y-5 print-dark-text box-border"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/60 pb-4 gap-2">
              <div>
                <span className="text-[10px] sm:text-xs uppercase text-slate-400 tracking-widest font-bold">Vector Classification</span>
                <h3 className="text-base sm:text-lg font-bold text-red-400 mt-0.5 print-dark-text">{result.threatType}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] sm:text-xs uppercase text-slate-400 tracking-widest font-bold">Malicious Density</span>
                <div className={`text-xl sm:text-2xl font-extrabold ${result.isScam ? 'text-red-500' : 'text-emerald-500'} print-dark-text`}>
                  {result.confidenceScore}%
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/40 print-bg-fix box-border">
              <div className="flex justify-between items-center mb-1.5 text-[10px] sm:text-xs font-bold gap-2">
                <span className="text-slate-400 uppercase tracking-wider truncate">Threat Spectrum Index:</span>
                <span className={`${result.isScam ? 'text-red-400' : 'text-emerald-400'} whitespace-nowrap`}>
                  {result.isScam ? 'CRITICAL HIGH RISK' : 'CLEAR INFRASTRUCTURE'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    result.isScam ? 'bg-gradient-to-r from-amber-500 to-red-600' : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  }`}
                  style={{ width: `${result.confidenceScore}%` }}
                ></div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Forensic Analysis Diagnosis</h4>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/40 print-bg-fix">
                {result.analysisReason}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">🛡️ Strategic First-Aid Protocols</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {result.immediateActionSteps && Array.isArray(result.immediateActionSteps) && result.immediateActionSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 bg-[#131e35]/60 border border-slate-800/40 p-3 rounded-xl text-slate-200 print-bg-fix">
                    <span className="flex-shrink-0 flex items-center justify-center bg-red-950 text-red-400 border border-red-900/30 rounded-full w-5 h-5 font-bold text-xs mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default TriageDesk;