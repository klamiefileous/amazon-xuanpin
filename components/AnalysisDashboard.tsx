
import React from 'react';
import { MarketAnalysis } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

interface Props {
  data: MarketAnalysis;
  keyword: string;
}

const AnalysisDashboard: React.FC<Props> = ({ data, keyword }) => {
  const getRecColor = (rec: string) => {
    switch (rec) {
      case 'YES': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'NO': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-amber-600 bg-amber-50 border-amber-200';
    }
  };

  const riskData = [
    { subject: 'Competition', A: data.competitionLevel, fullMark: 10 },
    { subject: 'Risk', A: data.riskLevel, fullMark: 10 },
    { subject: 'Entry Barrier', A: data.entryBarrier, fullMark: 10 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Overview Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center ${getRecColor(data.recommendation)}`}>
          <span className="text-sm font-bold uppercase tracking-widest mb-2">Final Verdict</span>
          <h2 className="text-5xl font-black mb-2">{data.recommendation}</h2>
          <div className="w-full bg-white/50 rounded-full h-2 mt-4">
            <div className="bg-current h-2 rounded-full" style={{ width: `${data.confidenceScore}%` }}></div>
          </div>
          <p className="text-xs mt-2 opacity-80">Confidence: {data.confidenceScore}%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pricing Strategy</span>
          <div className="flex-grow flex flex-col justify-center">
            <p className="text-2xl font-bold text-slate-800">{data.priceStrategy}</p>
            <p className="text-sm text-slate-500 mt-2">Suggested launch price based on competitor clusters.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Risk Radar</span>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" fontSize={10} />
                <Radar name="Metrics" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <i className="fa-solid fa-chart-line text-indigo-500 mr-2"></i>
            12-Month Search Velocity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center italic">Historical data synthesized from search grounding results.</p>
        </div>

        {/* Opportunities & Risks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">SWOT Highlights</h3>
          <div className="space-y-4 flex-grow">
            <div>
              <h4 className="text-xs font-bold text-emerald-600 uppercase mb-2">Opportunities</h4>
              <ul className="space-y-2">
                {data.opportunityPoints.map((point, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start">
                    <i className="fa-solid fa-check text-emerald-500 mt-1 mr-2 text-[10px]"></i>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-600 uppercase mb-2">Major Risks</h4>
              <ul className="space-y-2">
                {data.coreRisks.map((risk, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start">
                    <i className="fa-solid fa-triangle-exclamation text-rose-500 mt-1 mr-2 text-[10px]"></i>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Snapshot */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <i className="fa-brands fa-amazon text-orange-500 mr-2"></i>
          Market Landscape (Top Competitors)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="text-left py-3 px-2">Product Title</th>
                <th className="text-left py-3 px-2">Price</th>
                <th className="text-left py-3 px-2">BSR</th>
                <th className="text-left py-3 px-2">Reviews</th>
                <th className="text-left py-3 px-2">Badge</th>
              </tr>
            </thead>
            <tbody>
              {data.competitors.map((comp, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-2 font-medium text-slate-700 max-w-xs truncate">{comp.title}</td>
                  <td className="py-4 px-2 text-slate-600">{comp.price}</td>
                  <td className="py-4 px-2 text-slate-600">#{comp.bsr}</td>
                  <td className="py-4 px-2 text-slate-600">{comp.reviews?.toLocaleString()}</td>
                  <td className="py-4 px-2">
                    {comp.isNewRelease && (
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-1 rounded-full font-bold">NEW</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social Pulse */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <i className="fa-brands fa-reddit-alien text-orange-500 mr-3 text-2xl"></i>
            Social Sentiment Engine
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            data.redditSentiment.sentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' :
            data.redditSentiment.sentiment === 'Negative' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-400'
          }`}>
            {data.redditSentiment.sentiment} Sentiment
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-slate-400 text-sm mb-4">Volume: <span className="text-white font-medium">{data.redditSentiment.discussionVolume}</span></p>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Customer Voice</h4>
              <div className="space-y-3">
                {data.redditSentiment.keyConcerns.map((concern, idx) => (
                  <div key={idx} className="bg-white/5 p-4 rounded-xl text-sm border border-white/10 italic">
                    "{concern}"
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-6 border border-white/10 rounded-2xl bg-white/5">
             <i className="fa-solid fa-robot text-indigo-400 text-4xl mb-4"></i>
             <p className="text-center text-slate-300 text-sm">
               LLM has scanned Reddit threads to extract the "Customer Voice". These points represent critical pain points you can solve to gain market share.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
