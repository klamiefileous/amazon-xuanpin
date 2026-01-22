
import React, { useState } from 'react';
import { AnalysisStatus, MarketAnalysis } from './types';
import { performProductAnalysis } from './services/gemini';
import AnalysisDashboard from './components/AnalysisDashboard';

const App: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<MarketAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setStatus(AnalysisStatus.FETCHING);
    setError(null);
    setResult(null);

    try {
      const data = await performProductAnalysis(keyword);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed. The AI model might be experiencing high latency with grounding tools.');
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-bolt text-white text-xs"></i>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">AmzPulse <span className="text-indigo-600 italic">AI</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600">Dashboard</a>
            <a href="#" className="hover:text-indigo-600">History</a>
            <a href="#" className="bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-600">Amazon US Mode</a>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <header className="bg-white border-b border-slate-100 pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Amazon Product Selection <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Intelligence Agent</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
            Our agent uses Google Search grounding to scan Amazon and Reddit in real-time.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
            <input 
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter product keyword (e.g. ergonomic desk lamp)..."
              disabled={status === AnalysisStatus.FETCHING || status === AnalysisStatus.ANALYZING}
              className="w-full px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl shadow-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-lg placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={status === AnalysisStatus.FETCHING || status === AnalysisStatus.ANALYZING || !keyword}
              className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center shadow-lg"
            >
              {status === AnalysisStatus.FETCHING ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <>Analyze</>
              )}
            </button>
          </form>

          {status === AnalysisStatus.FETCHING && (
            <div className="mt-8 flex flex-col items-center">
              <div className="flex space-x-1 mb-4">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></div>
              </div>
              <p className="text-sm text-indigo-600 font-medium">Researching marketplace data via Grounding tools... This can take up to 30 seconds.</p>
            </div>
          )}
        </div>
      </header>

      {/* Results Section */}
      <main className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {status === AnalysisStatus.COMPLETED && result && (
          <AnalysisDashboard data={result} keyword={keyword} />
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="bg-rose-50 border border-rose-200 p-8 rounded-2xl text-center shadow-sm">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-rose-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-rose-900 mb-2">Service Temporarily Unavailable</h3>
            <p className="text-rose-700 max-w-md mx-auto">{error}</p>
            <p className="text-xs text-rose-400 mt-4">Tip: The "Pro" models sometimes time out during heavy grounding tasks. We are currently using the "Flash" model for better reliability.</p>
            <button 
              onClick={() => setStatus(AnalysisStatus.IDLE)}
              className="mt-6 px-6 py-2 bg-white border border-rose-200 rounded-lg text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === AnalysisStatus.IDLE && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { title: 'Grounding-Ready', icon: 'fa-globe', desc: 'Uses real-time web search to find current Amazon prices and Reddit trends.' },
              { title: 'Sentiment Engine', icon: 'fa-comments', desc: 'Scans social signals to detect product pain points and feature gaps.' },
              { title: 'Risk Guard', icon: 'fa-shield-halved', desc: 'Predicts marketplace barriers using competitor review and BSR density.' }
            ].map((feature, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-info-circle text-indigo-600 mr-2"></i>
              System Status
            </h3>
            <p className="text-sm text-slate-500">
              The 500 RPC error usually indicates a transient timeout between the AI Gateway and the Google grounding tools. 
              We've optimized the request to use <strong>gemini-3-flash-preview</strong> and simplified the context to reduce latency.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
