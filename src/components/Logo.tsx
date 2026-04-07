import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Gradient Definition */}
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
          <stop offset="100%" stopColor="#fb7185" /> {/* rose-400 */}
        </linearGradient>
      </defs>

      {/* Stylized "H" - The Nurturing Arc */}
      {/* Left Pillar */}
      <rect 
        x="25" 
        y="20" 
        width="12" 
        height="60" 
        rx="6" 
        fill="url(#logo-gradient)" 
      />
      
      {/* Right Pillar */}
      <rect 
        x="63" 
        y="20" 
        width="12" 
        height="60" 
        rx="6" 
        fill="url(#logo-gradient)" 
      />
      
      {/* The Arc (Crossbar) */}
      <path 
        d="M37 50C37 50 45 42 50 42C55 42 63 50 63 50" 
        stroke="url(#logo-gradient)" 
        strokeWidth="10" 
        strokeLinecap="round" 
      />
      
      {/* Small Sparkle/Dot for "Life" */}
      <circle cx="50" cy="30" r="4" fill="#fb7185" className="animate-pulse" />
    </svg>
  );
};

export const LogoFull: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={32} />
      <span className="text-2xl font-black tracking-tighter text-stone-900">
        HERA<span className="text-rose-500">XIS</span>
      </span>
    </div>
  );
};
