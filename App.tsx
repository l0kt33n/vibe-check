import React, { useState } from 'react';
import { Search, Github, AlertCircle, Key, Loader2, Sparkles } from 'lucide-react';
import { parseRepoUrl, fetchRepoContext } from './services/githubService';
import { analyzeRepoVibe } from './services/geminiService';
import AnalysisResult from './components/AnalysisResult';
import { AnalysisStatus, VibeAnalysisResult } from './types';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VibeAnalysisResult | null>(null);
  const [analyzedRepoName, setAnalyzedRepoName] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const repoInfo = parseRepoUrl(url);
    if (!repoInfo) {
      setError("Invalid GitHub URL. Please use format: https://github.com/owner/repo");
      return;
    }

    setAnalyzedRepoName(`${repoInfo.owner}/${repoInfo.repo}`);
    setStatus(AnalysisStatus.FETCHING_GITHUB);

    try {
      const context = await fetchRepoContext(repoInfo, token);
      
      setStatus(AnalysisStatus.ANALYZING_GEMINI);
      const analysis = await analyzeRepoVibe(context);
      
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const isLoading = status === AnalysisStatus.FETCHING_GITHUB || status === AnalysisStatus.ANALYZING_GEMINI;

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <Sparkles className="text-fuchsia-500" size={24} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            VIBE CHECK
          </span>
        </div>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer"
          className="text-gray-500 hover:text-white transition-colors"
        >
          <Github size={24} />
        </a>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pt-10 pb-20 w-full max-w-7xl mx-auto">
        
        {/* Hero Section */}
        {status === AnalysisStatus.IDLE && (
           <div className="text-center mb-16 max-w-2xl animate-in fade-in zoom-in duration-500">
             <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
               Is your code <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600 glow-text">
                 Vibe Coded?
               </span>
             </h1>
             <p className="text-lg text-gray-400 mb-8 leading-relaxed">
               Detect if a repository was built with the help of AI assistants like Cursor, Windsurf, or Copilot.
               We analyze patterns, config files, and commit entropy.
             </p>
           </div>
        )}

        {/* Input Form */}
        <div className={`w-full max-w-2xl transition-all duration-500 ${result ? 'mb-12' : 'mb-0'}`}>
          <form onSubmit={handleAnalyze} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-gray-900 rounded-xl p-2 border border-gray-800 shadow-2xl">
              <div className="pl-4 text-gray-500">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 px-4 py-3 font-mono text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !url}
                className="bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Check Vibe'}
              </button>
            </div>
          </form>

          {/* Token Input Toggle */}
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 transition-colors"
            >
              <Key size={12} />
              {showTokenInput ? 'Hide Token Input' : 'Add GitHub Token (Optional, for higher rate limits)'}
            </button>
          </div>

          {showTokenInput && (
             <div className="mt-2 animate-in slide-in-from-top-2">
               <input
                 type="password"
                 value={token}
                 onChange={(e) => setToken(e.target.value)}
                 placeholder="ghp_xxxxxxxxxxxx"
                 className="w-full bg-gray-900/50 border border-gray-800 text-gray-300 text-xs rounded-lg p-3 focus:border-fuchsia-500 focus:outline-none transition-colors"
               />
               <p className="text-[10px] text-gray-600 mt-1 text-center">
                 Tokens are only used for this session to bypass GitHub API rate limits.
               </p>
             </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 flex flex-col items-center animate-in fade-in duration-500">
             <div className="relative">
               <div className="w-16 h-16 border-4 border-gray-800 border-t-fuchsia-500 rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
               </div>
             </div>
             <p className="mt-6 text-fuchsia-400 font-mono text-sm animate-pulse">
               {status === AnalysisStatus.FETCHING_GITHUB ? 'SCANNING REPO MATRIX...' : 'AI ANALYZING PATTERNS...'}
             </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 bg-red-900/20 border border-red-900/50 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3 animate-in shake">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {result && status === AnalysisStatus.COMPLETED && (
          <AnalysisResult result={result} repoName={analyzedRepoName} />
        )}

      </main>

      <footer className="relative z-10 p-6 text-center text-gray-700 text-xs">
        <p>Powered by Google Gemini 2.5 Flash & GitHub API • <span className="text-fuchsia-900/60 hover:text-fuchsia-500 transition-colors cursor-help" title="I didn't write this code, the AI did.">100% Vibe Coded</span></p>
      </footer>
    </div>
  );
};

export default App;