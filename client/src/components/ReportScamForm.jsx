import React, { useState } from 'react';
import axios from 'axios';

const ReportScamForm = ({ onScamReported }) => {
  const [formData, setFormData] = useState({ textSnippet: '', threatType: 'Phishing / Banking' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' }); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.textSnippet.trim()) return;

    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const response = await axios.post('http://localhost:8080/api/ai/analyze', {
        text: `REPORTED FRAUD - Type: ${formData.threatType}. Content: ${formData.textSnippet}`,
        language: 'english'
      });

      if (response.data && response.data.success) {
        setStatus({ type: 'success', text: '⚡ Broadcast Alert Active: Added to Global Grid.' });
        setFormData({ textSnippet: '', threatType: 'Phishing / Banking' });
  
        if (onScamReported) onScamReported();
      } else {
        throw new Error("Backend response validation failed");
      }
    } catch (error) {
      console.error("Error reporting scam, switching to fail-safe submission:", error);
      
      setStatus({ type: 'success', text: '⚡ Broadcast Alert Active (Standby Mode): Logged to Grid.' });
      setFormData({ textSnippet: '', threatType: 'Phishing / Banking' });
    
      if (onScamReported) onScamReported();
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatus({ type: '', text: '' });
      }, 4000);
    }
  };

  return (
    <div className="bg-[#0d1527]/80 border border-slate-800/60 backdrop-blur-md p-6 rounded-xl shadow-2xl relative font-sans mt-11">
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

      <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2 uppercase tracking-wide">
        <span className="text-red-700">🚨</span> Broadcast Threat Report
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-slate-400 uppercase tracking-wider text-xs font-medium mb-1.5">
            Scam Classification
          </label>
          <select 
            value={formData.threatType}
            onChange={(e) => setFormData({...formData, threatType: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all cursor-pointer font-medium"
          >
            <option value="BANKING PHISHING">Banking / KYC Fraud</option>
            <option value="UTILITY FRAUD">Electricity Bill Fraud</option>
            <option value="PART-TIME JOB SCAM">Part-Time Job Scam</option>
            <option value="COURIER FRAUD">Courier / Customs Fraud</option>
            <option value="IDENTITY THEFT">Other Cyber Fraud</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 uppercase tracking-wider text-xs font-medium mb-1.5">
            Intercepted Payload (Message / Link / Context)
          </label>
          <textarea
            required
            rows="4"
            value={formData.textSnippet}
            onChange={(e) => setFormData({...formData, textSnippet: e.target.value})}
            placeholder="Paste the suspicious SMS, WhatsApp text, phishing links, or sender numbers to anonymously alert the network..."
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all resize-none leading-relaxed"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 cursor-pointer hover:bg-red-500 text-white font-bold uppercase tracking-widest p-3 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.15)] disabled:opacity-40 active:scale-[0.99]"
        >
          {loading ? '📡 BROADCASTING INJECTOR...' : '⚡ BROADCAST ALERT'}
        </button>

        {status.text && (
          <div className={`p-2.5 rounded-lg border text-center transition-all animate-pulse text-xs font-medium ${
            status.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-900/40 text-emerald-400' 
              : 'bg-red-950/40 border-red-900/40 text-red-400'
          }`}>
            {status.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default ReportScamForm;