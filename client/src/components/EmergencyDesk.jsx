import React, { useState } from 'react';

const bankRegistry = [
  { 
    name: 'State Bank of India (SBI)', 
    contact: '18001234', 
    blockUrl: 'https://www.onlinesbi.sbi/',
    smsGuide: 'SMS "BLOCK" to 567676 from registered mobile.'
  },
  { 
    name: 'HDFC Bank', 
    contact: '18002026161', 
    blockUrl: 'https://www.hdfcbank.com/',
    smsGuide: 'Call helpline or login to NetBanking > Cards > Block.'
  },
  { 
    name: 'ICICI Bank', 
    contact: '18001080', 
    blockUrl: 'https://www.icicibank.com/',
    smsGuide: 'SMS "BLOCK CARD <Last 4 Digits>" to 9215676766.'
  },
  { 
    name: 'Axis Bank', 
    contact: '18604195555', 
    blockUrl: 'https://www.axisbank.com/',
    smsGuide: 'SMS "BLOCKCARD <Last 4 Digits>" to 5676782.'
  },
  { 
    name: 'Paytm Payment Bank', 
    contact: '01204456456', 
    blockUrl: 'https://paytmbank.com/',
    smsGuide: 'Open App > Menu > Security > Instant Account Block.'
  }
];

const EmergencyDesk = () => {
const [selectedBank, setSelectedBank] = useState('');

const currentBank = bankRegistry.find(b => b.name === selectedBank);

return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-6 font-sans">
     
      <div className="bg-gradient-to-r from-red-950/40 via-red-900/20 to-slate-900/40 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(239,68,68,0.05)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600/10 border border-red-500/40 rounded-xl flex items-center justify-center text-2xl animate-pulse text-red-500 font-bold">
            🚨
          </div>
        <div>
            <h3 className="text-xl font-bold text-red-400 uppercase tracking-wide">National Cyber Crime Hotline</h3>
            <p className="text-slate-400 text-sm font-medium mt-0.5">Government of India official instant financial fraud response.</p>
        </div>
      </div>
        <a 
          href="tel:1930" 
          className="w-full md:w-auto text-center bg-red-600 hover:bg-red-500 text-white font-bold text-xl px-8 py-3 rounded-xl tracking-wider shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all active:scale-95"
        >
          CALL 1930
        </a>
      </div>

      <div className="bg-[#0d1527]/80 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 shadow-2xl relative">
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-3 bg-blue-500 rounded-full" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">1-Minute Panic Action (Asset Freeze)</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Target Bank / Wallet</label>
            <select 
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-1 focus:ring-blue-500 focus:outline-none text-slate-200 font-medium text-sm transition-all shadow-inner cursor-pointer"
            >
              <option value="">-- CHOOSE YOUR BANK --</option>
              {bankRegistry.map((bank, index) => (
                <option key={index} value={bank.name}>{bank.name}</option>
              ))}
            </select>
            
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              *If your bank is not listed, immediately send "BLOCK" via SMS to your service provider's standard helpline or dial 1930.
            </p>
          </div>

          <div className="h-full flex items-center justify-center">
            {currentBank ? (
              <div className="w-full space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-center">
                    <span className="text-xs text-slate-400 block uppercase mb-1 font-medium">Helpline</span>
                    <a href={`tel:${currentBank.contact}`} className="text-lg font-extrabold text-blue-400 tracking-wide hover:underline break-all">
                      {currentBank.contact}
                    </a>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-center flex flex-col justify-center">
                    <span className="text-xs text-slate-400 block uppercase mb-1 font-medium">Action Portal</span>
                    <a 
                      href={currentBank.blockUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs font-bold text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 py-1.5 px-3 rounded-lg transition-colors uppercase tracking-wider"
                    >
                      Block Link ↗
                    </a>
                  </div>
                </div>
          
                <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-3">
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-1">⚡ Instant SMS Protocol</span>
                  <p className="text-sm text-slate-200">
                    {currentBank.smsGuide}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm text-center border border-dashed border-slate-800/60 rounded-xl p-8 w-full flex items-center justify-center min-h-[140px]">
                [Awaiting Selection]: Choose a bank to retrieve critical anti-fraud channels.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default EmergencyDesk;