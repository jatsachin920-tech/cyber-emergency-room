import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MOCK_FEEDS = [
  {
    threatType: "BANKING PHISHING",
    textSnippet: "Dear customer, your SBI account is blocked. Please click here to update your KYC immediately to avoid penalties.",
    confidenceScore: 98,
    detectedAt: new Date(Date.now() - 3 * 60000).toISOString() 
  },
  {
    threatType: "UTILITY FRAUD",
    textSnippet: "Electricity Office: Your power bill is pending. Line will be disconnected tonight at 9:30 PM. Call officer at 98765XXXXX.",
    confidenceScore: 94,
    detectedAt: new Date(Date.now() - 12 * 60000).toISOString() 
  },
  {
    threatType: "LOTTERY SCAM",
    textSnippet: "Congratulations! You have won a KBC lottery of ₹25,000,000. Contact Rana Pratap Singh on WhatsApp to claim your prize.",
    confidenceScore: 89,
    detectedAt: new Date(Date.now() - 45 * 60000).toISOString() 
  }
];

const CommunityFeed = ({ refreshTrigger }) => {
  const [feeds, setFeeds] = useState(MOCK_FEEDS);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const fetchFeed = async () => {
    try {
      const response = await axios.get('https://cyber-emergency-room.onrender.com/api/ai/feed');
      if (response.data && response.data.success && response.data.data && response.data.data.length > 0) {
        setFeeds(response.data.data);
        setIsLive(true);
      } else {
        setIsLive(true);
      }
    } catch (err) {
      console.error("Error fetching live feed, utilizing secure fail-safe grid:", err);
      setIsLive(false);
      if (feeds.length === 0) setFeeds(MOCK_FEEDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 10000);
    return () => clearInterval(interval);
  }, [refreshTrigger]); 
  
  const getBadgeColor = (type) => {
    const t = type?.toUpperCase() || "";
    if (t.includes("BANKING") || t.includes("PHISHING")) return "text-red-400 bg-red-950/40 border-red-900/40";
    if (t.includes("UTILITY") || t.includes("BILL")) return "text-amber-400 bg-amber-950/40 border-amber-900/40";
    return "text-blue-400 bg-blue-950/40 border-blue-900/40";
  };

  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? "Just Now" : d.toLocaleTimeString();
    } catch {
      return "Just Now";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#0d1527]/80 backdrop-blur-md border border-slate-800/60 rounded-xl p-6 shadow-2xl relative font-sans">
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-ping ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <h4 className="text-sm font-bold tracking-wide text-slate-300 flex items-center gap-2 uppercase">
            Live Global Threat Feed 
            <span className="text-xs text-slate-500 normal-case font-normal">(Anonymized)</span>
          </h4>
        </div>
        <span className={`text-xs border px-2 py-0.5 rounded-md font-medium ${isLive ? 'bg-emerald-950/30 border-emerald-900/30 text-emerald-500' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
          {isLive ? '📡 AUTO-REFRESH ACTIVE' : '🛡️ FAIL-SAFE DEMO MODE'}
        </span>
      </div>

      {loading && feeds.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8 animate-pulse">
          Connecting to Global Threat Intel Grid...
        </p>
      ) : feeds.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">
          [GRID CLEAN]: No recent threats logged in the perimeter.
        </p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {feeds.map((item, index) => (
            <div key={index} className="bg-[#131e35]/60 border border-slate-800/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700/70 transition-all shadow-md">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className={`text-xs font-bold border px-2 py-0.5 rounded-md ${getBadgeColor(item.threatType)}`}>
                    {item.threatType || "UNKNOWN SCAN"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatTime(item.detectedAt)}
                  </span>
                </div>
                <p className="text-slate-200 text-sm italic break-words">
                  "{item.textSnippet}"
                </p>
              </div>
              
              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-800/30 pt-2 sm:pt-0">
                <span className="text-xs text-slate-400 uppercase block tracking-wider font-medium">Confidence</span>
                <span className={`text-base font-extrabold ${item.confidenceScore > 90 ? 'text-red-500' : 'text-amber-500'}`}>
                  {item.confidenceScore || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;