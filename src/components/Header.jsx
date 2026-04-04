import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c0e12]/75 backdrop-blur-2xl saturate-150 border-b border-white/[0.06]">
      <nav className="flex justify-between items-center w-full px-4 lg:px-8 h-[72px] max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <img 
            src="/logo.png" 
            alt="ClaimCalculator.ai Logo" 
            className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0,209,255,0.4)] transition-transform duration-300 group-hover:scale-105"
          />
          <span className="hidden sm:inline text-2xl lg:text-3xl font-black tracking-tighter text-on-background font-headline leading-none">
            ClaimCalculator<span className="text-primary">.ai</span>
          </span>
          <span className="sm:hidden text-[clamp(0.875rem,3.5vw,1.25rem)] font-black tracking-tighter text-on-background font-headline leading-none">
            ClaimCalc<span className="text-primary">.ai</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-10">
          {[
            { label: 'How It Works', path: '/how-it-works' },
            { label: 'Insurance Tactics', path: '/insurance-tactics' },
            { label: 'Your Rights', path: '/your-rights' },
          ].map(({ label, path }) => (
            <button 
              key={path}
              onClick={() => navigate(path)} 
              className={`nav-link-animated font-headline transition-colors text-[15px] font-medium ${
                location.pathname === path 
                  ? 'text-primary font-bold' 
                  : 'text-[#bbc9cf] hover:text-on-background'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Action Button */}
        {location.pathname !== '/calculator' && (
          <button
            onClick={() => navigate('/calculator')}
            className="cta-gradient cta-shimmer text-on-primary-fixed px-4 sm:px-6 py-2 sm:py-2.5 rounded-[12px] font-headline font-bold text-xs sm:text-sm active:scale-95 duration-200 shadow-[0_0_20px_rgba(164,230,255,0.15)] hover:shadow-[0_0_30px_rgba(164,230,255,0.3)] transition-all hover:-translate-y-0.5 flex-shrink-0"
          >
            Free Evaluation
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
