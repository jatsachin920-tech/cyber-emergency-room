import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const AnalyticsChart = ({ stats }) => {

  const total = stats?.totalDetected || 0;
  const banking = stats?.bankingFrauds || 0;
  const utility = stats?.utilityFrauds || 0;

  const otherScams = Math.max(0, total - (banking + utility));

  const data = [
    { name: 'Banking Phishing', count: banking, color: '#EF4444' }, 
    { name: 'Utility Frauds', count: utility, color: '#F59E0B' },  
    { name: 'Other Scams', count: otherScams, color: '#3B82F6' }  
  ];

  const hasData = data.some(item => item.count > 0);

  const displayData = hasData ? data : [
    { name: 'Monitoring System...', count: 1, color: '#334155' } 
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 bg-[#0d1527]/90 border border-slate-800/60 backdrop-blur-md p-5 rounded-xl shadow-2xl">
      
      <div className="bg-[#131e35] border border-slate-800/40 p-4 rounded-xl min-h-[260px] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-mono font-bold text-slate-200 tracking-wide">
            📊 Threat Distribution (Volume)
          </h4>
          {!hasData && (
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono animate-pulse">
              STANDBY MODE
            </span>
          )}
        </div>
        
        <div className="h-48 w-full font-mono text-[11px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData} margin={{ bottom: 35 }}>
              <XAxis dataKey="name" stroke="#64748b" tickLine={false} interval={0}  
          
              tick={({ x, y, payload }) => {
              const words = payload.value.split(' ');
              return (
              <text x={x} y={y+10} cx={x} cy={y} dy={20} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="monospace">
              <tspan x={x} dy="0" className="hidden md:inline">{payload.value}</tspan>
              <tspan x={x} dy="0" className="inline md:hidden">{words[0]}</tspan>
              {words[1] && <tspan x={x} dy="12" className="inline md:hidden">{words[1]}</tspan>}
              </text>
              );
             }}
             />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={25} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#131e35] border border-slate-800/40 p-4 rounded-xl min-h-[260px] flex flex-col items-center justify-between">
        <h4 className="text-sm font-mono font-bold text-slate-200 tracking-wide align-self-start w-full text-left mb-3">
          🍩 Threat Share (Percentage)
        </h4>
        
        <div className="h-48 w-full font-mono text-[11px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={hasData ? 5 : 0}
                animationDuration={800}
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {hasData && <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }} />}
            </PieChart>
          </ResponsiveContainer>
       
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total</span>
            <span className="text-xl font-black text-slate-200 font-mono">{total}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsChart;