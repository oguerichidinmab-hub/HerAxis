import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head */}
      <circle cx="12" cy="4" r="2.5" fill="currentColor" />
      {/* Body with stylized pregnant belly */}
      <path 
        d="M12 7.5c-2 0-3.5 1.5-3.5 4v4c0 1.5 1 2.5 2.5 2.5h1c3 0 5-2 5-5s-2-5-5-5z" 
        fill="currentColor" 
      />
      {/* Legs */}
      <rect x="9.5" y="18" width="1.5" height="3" rx="0.75" fill="currentColor" />
      <rect x="12.5" y="18" width="1.5" height="3" rx="0.75" fill="currentColor" />
    </svg>
  );
};

export const LogoFull: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size={size} className="text-pink-600" />
      <span className="font-bold text-stone-900 tracking-tighter" style={{ fontSize: size * 0.6 }}>
        HERAXIS
      </span>
    </div>
  );
};
