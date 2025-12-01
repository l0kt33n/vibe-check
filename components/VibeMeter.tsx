import React from 'react';

interface VibeMeterProps {
  score: number;
}

const VibeMeter: React.FC<VibeMeterProps> = ({ score }) => {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s < 30) return 'text-blue-500 shadow-blue-500/50';
    if (s < 70) return 'text-yellow-400 shadow-yellow-400/50';
    return 'text-fuchsia-500 shadow-fuchsia-500/50';
  };

  const getBarColor = (s: number) => {
    if (s < 30) return 'bg-blue-500';
    if (s < 70) return 'bg-yellow-400';
    return 'bg-fuchsia-500';
  };

  const colorClass = getColor(score);
  const barClass = getBarColor(score);

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Glow Ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-opacity-20 border-white blur-sm ${score > 80 ? 'animate-pulse' : ''}`}></div>
        
        {/* SVG Gauge */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#1f2937"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={283} // 2 * pi * 45
            strokeDashoffset={283 - (283 * score) / 100}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${colorClass.split(' ')[0]}`}
          />
        </svg>

        {/* Score Text */}
        <div className="absolute flex flex-col items-center">
          <span className={`text-6xl font-black font-mono tracking-tighter ${colorClass} drop-shadow-lg`}>
            {score}%
          </span>
          <span className="text-gray-400 text-xs uppercase tracking-widest mt-2">Vibe Index</span>
        </div>
      </div>
    </div>
  );
};

export default VibeMeter;