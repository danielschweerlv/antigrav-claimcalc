import React from 'react';

export default function AIChipLogo({ className = "w-24 h-24" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* Outer Glow / Base */}
      <rect x="25" y="25" width="50" height="50" rx="8" stroke="url(#chipGradient)" strokeWidth="3" fill="#111318" />
      
      {/* Inner Screen */}
      <rect x="32" y="32" width="36" height="36" rx="4" stroke="url(#chipGradient)" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.05" />

      {/* Text AI */}
      <text x="50" y="52" fontFamily="'Space Grotesk', system-ui, sans-serif" fontWeight="900" fontSize="18" fill="url(#chipGradient)" textAnchor="middle" dominantBaseline="middle">AI</text>
      {/* Text Powered */}
      <text x="50" y="62" fontFamily="'Manrope', system-ui, sans-serif" fontWeight="600" fontSize="6" fill="#ffffff" textAnchor="middle" opacity="0.8">POWERED</text>

      {/* Top Pins */}
      <path d="M40 25 L40 18 C40 12 30 12 30 5" stroke="url(#chipGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="35" y="21" width="10" height="4" rx="1" fill="url(#chipGradient)" />
      
      <path d="M60 25 L60 18 C60 12 70 12 70 5" stroke="url(#chipGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="55" y="21" width="10" height="4" rx="1" fill="url(#chipGradient)" />

      {/* Bottom Pins */}
      <path d="M40 75 L40 82 C40 88 30 88 30 95" stroke="url(#chipGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="35" y="75" width="10" height="4" rx="1" fill="url(#chipGradient)" />

      <path d="M60 75 L60 82 C60 88 70 88 70 95" stroke="url(#chipGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="55" y="75" width="10" height="4" rx="1" fill="url(#chipGradient)" />

      {/* Left Pins */}
      <path d="M25 40 L18 40 C12 40 12 30 5 30" stroke="url(#chipGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="21" y="35" width="4" height="10" rx="1" fill="url(#chipGradient)" />

      <path d="M25 60 L18 60 C12 60 12 70 5 70" stroke="url(#chipGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="21" y="55" width="4" height="10" rx="1" fill="url(#chipGradient)" />

      {/* Right Pins */}
      <path d="M75 40 L82 40 C88 40 88 30 95 30" stroke="url(#chipGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="75" y="35" width="4" height="10" rx="1" fill="url(#chipGradient)" />

      <path d="M75 60 L82 60 C88 60 88 70 95 70" stroke="url(#chipGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <rect x="75" y="55" width="4" height="10" rx="1" fill="url(#chipGradient)" />

    </svg>
  );
}
