import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#111318]/90 backdrop-blur-xl border-b border-outline-variant/10">
      <nav className="flex justify-between items-center w-full px-4 py-3 max-w-7xl mx-auto">
        
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
          <span className="text-3xl font-black tracking-tighter text-on-background font-['Space_Grotesk'] leading-none">
            ClaimCalculator<span className="text-primary">.ai</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-10">
          <button 
            onClick={() => navigate('/how-it-works')} 
            className={`font-['Space_Grotesk'] transition-colors text-lg ${location.pathname === '/how-it-works' ? 'text-primary font-bold' : 'text-[#bbc9cf] hover:text-[#00d1ff]'}`}
          >
            How It Works
          </button>
          <button 
            onClick={() => navigate('/insurance-tactics')} 
            className={`font-['Space_Grotesk'] transition-colors text-lg ${location.pathname === '/insurance-tactics' ? 'text-primary font-bold' : 'text-[#bbc9cf] hover:text-[#00d1ff]'}`}
          >
            Insurance Tactics
          </button>
          <button 
            onClick={() => navigate('/your-rights')} 
            className={`font-['Space_Grotesk'] transition-colors text-lg ${location.pathname === '/your-rights' ? 'text-primary font-bold' : 'text-[#bbc9cf] hover:text-[#00d1ff]'}`}
          >
            Your Rights
          </button>
        </div>

        {/* Action Button */}
        {location.pathname !== '/calculator' && (
          <button
            onClick={() => navigate('/calculator')}
            className="cta-gradient text-on-primary-fixed px-6 py-3 rounded-full font-bold text-base active:scale-95 duration-200 shadow-[0_0_20px_rgba(164,230,255,0.2)] hover:shadow-[0_0_30px_rgba(164,230,255,0.4)]"
          >
            Free Evaluation
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
