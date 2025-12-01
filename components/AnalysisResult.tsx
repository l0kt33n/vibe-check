import React from 'react';
import { VibeAnalysisResult } from '../types';
import VibeMeter from './VibeMeter';
import { CheckCircle2, AlertTriangle, Cpu, Terminal } from 'lucide-react';

interface AnalysisResultProps {
  result: VibeAnalysisResult;
  repoName: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, repoName }) => {
  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header Verdict */}
      <div className="text-center mb-10">
        <h2 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Target Analyzed: {repoName}</h2>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">
          {result.verdict}
        </h1>
        <div className="flex justify-center gap-2">
           {result.aiToolsDetected.map((tool, idx) => (
             <span key={idx} className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-cyan-400 font-mono flex items-center gap-1">
               <Cpu size={12} /> {tool}
             </span>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left Col: Meter */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col items-center justify-center">
          <VibeMeter score={result.score} />
          <p className="text-center text-gray-400 text-sm mt-4 px-6 italic">
            "{result.reasoning.split('.')[0]}."
          </p>
        </div>

        {/* Right Col: Details */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Terminal size={20} className="text-fuchsia-500" />
              Analysis Log
            </h3>
            
            <div className="space-y-4">
              {result.evidence.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-gray-300 group">
                  <div className="mt-1 min-w-[16px]">
                     {result.score > 50 ? (
                       <CheckCircle2 size={16} className="text-green-500" />
                     ) : (
                       <AlertTriangle size={16} className="text-yellow-500" />
                     )}
                  </div>
                  <p className="group-hover:text-white transition-colors leading-relaxed border-b border-gray-800 pb-2 w-full">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800">
             <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">AI Reasoning</h4>
             <p className="text-sm text-gray-400 leading-relaxed">
               {result.reasoning}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;