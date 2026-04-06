import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedCross from './ui/AnimatedCross';

const DROPDOWN_TABS = [
  { id: 'navigation', label: 'Navigation' },
  { id: 'case-types', label: 'Nevada Case Types' },
  { id: 'case-guides', label: 'Nevada Case Guides' },
  { id: 'attorneys', label: "For Attorney's" },
];

const DROPDOWN_CONTENT = {
  navigation: [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Insurance Tactics', path: '/insurance-tactics' },
    { label: 'Your Rights', path: '/your-rights' },
    { label: 'Legal Notice', path: '/legal-notice' },
    { label: 'Contact Us', href: 'mailto:support@claimcalculator.ai' },
  ],
  'case-types': [
    { label: 'Car Accidents', desc: 'The most common injury case in Nevada. Rear-end collisions, intersection crashes, and freeway pileups on I-15 and US-95.', range: '$5,000 - $150,000+', path: '/calculator' },
    { label: 'Ride Share Accidents', desc: 'Las Vegas is one of the busiest Ride Share markets in the country. Active trips carry up to $1M in commercial coverage.', range: '$15,000 - $100,000+', path: '/calculator' },
    { label: 'Strip & Pedestrian Accidents', desc: 'The Las Vegas Strip sees some of the highest pedestrian traffic in the U.S. These cases tend to involve severe injuries.', range: '$30,000 - $500,000+', path: '/calculator' },
    { label: 'Casino & Hotel Injuries', desc: 'Wet floors, dim lighting, escalator malfunctions. Nevada premises liability law holds property owners accountable.', range: '$10,000 - $250,000+', path: '/calculator' },
    { label: 'Motorcycle Accidents', desc: 'Year-round riding means year-round risk. Motorcyclists face severe injuries and higher medical costs.', range: '$25,000 - $300,000+', path: '/calculator' },
    { label: 'Truck & 18-Wheeler Accidents', desc: 'I-15 between Las Vegas and LA is one of the heaviest commercial trucking corridors in the West.', range: '$50,000 - $1,000,000+', path: '/calculator' },
    { label: 'Construction Zone Crashes', desc: 'Narrowed lanes, sudden detours, and poor signage. Liability can fall on drivers, contractors, or government agencies.', range: '$15,000 - $200,000+', path: '/calculator' },
    { label: 'Parking Lot & Garage Accidents', desc: 'Casino garages, mall lots, and downtown structures. Low visibility and distracted drivers cause more damage than expected.', range: '$5,000 - $75,000+', path: '/calculator' },
  ],
  'case-guides': [
    { label: 'How Comparative Fault Works', desc: 'Nevada follows modified comparative negligence rules under NRS 41.141. Your recovery is reduced by your percentage of fault, and if you are more than 50% at fault, you cannot recover damages.', path: '/your-rights' },
    { label: 'After a Las Vegas Accident', desc: 'Step-by-step guide to protecting your rights immediately after a Nevada car accident: what to document, who to call, and what not to say.', path: '/how-it-works' },
    { label: "Nevada's 2-Year Filing Deadline", desc: 'Under NRS 11.190, you have two years from the date of the accident to file a personal injury lawsuit in Nevada. Missing this deadline means losing your right to compensation entirely.', path: '/your-rights' },
    { label: 'Insurance Lowball Tactics', desc: 'Learn how insurance companies minimize payouts through early lowball offers, recorded statements, delayed processing, and confusing policy language.', path: '/insurance-tactics' },
    { label: 'Strip & Casino Injury Liability', desc: "Nevada premises liability law requires property owners — including casinos and hotels — to maintain safe conditions. If you're injured due to negligence on their property, they may be liable.", path: '/your-rights' },
    { label: 'Understanding Your Medical Bills', desc: 'Medical bills are a core component of your case value. Learn how medical expense documentation impacts your settlement and why keeping every record matters.', path: '/how-it-works' },
  ],
  attorneys: [
    { label: 'Partner With Us', desc: 'Join ClaimCalculator.ai as a participating Nevada-licensed attorney. Receive pre-qualified leads from people actively seeking legal representation.', href: 'mailto:partners@claimcalculator.ai' },
    { label: 'Submit a Case Result', desc: 'Help improve our settlement estimates by sharing anonymized case outcomes. Your data helps people across Nevada get more accurate valuations.', href: 'mailto:results@claimcalculator.ai' },
    { label: 'Attorney Login', desc: 'Access your attorney dashboard to manage leads, track case submissions, and view analytics.', href: '#' },
    { label: 'Privacy Policy', desc: 'Read our full privacy policy covering how user data is collected, stored, and protected.', path: '/privacy-policy' },
    { label: 'Terms of Service', desc: 'Review the terms governing use of ClaimCalculator.ai, including disclaimers and limitations.', path: '/terms-of-service' },
  ],
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('navigation');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNav = (item) => {
    setIsOpen(false);
    window.scrollTo(0, 0);
    if (item.href) {
      window.location.href = item.href;
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const items = DROPDOWN_CONTENT[activeTab] || [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c0e12]/75 backdrop-blur-2xl saturate-150 border-b border-white/[0.06]">
      <nav className="flex justify-between items-center w-full px-4 lg:px-8 h-[72px] max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {/* Sparkling + sign — clickable dropdown trigger */}
          <button
            ref={buttonRef}
            onClick={() => setIsOpen((v) => !v)}
            className="relative flex-shrink-0 group"
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <div className="w-9 h-9 sm:w-[42px] sm:h-[42px] lg:w-12 lg:h-12 relative transition-transform duration-300 group-hover:scale-110" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 209, 255, 0.5))' }}>
              <AnimatedCross className="w-full h-full" />
            </div>
          </button>

          {/* Logo text — click goes home */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => { window.scrollTo(0, 0); navigate('/'); }}
          >
            <img
              src="/logos/claimcalculator-wordmark.png"
              alt="ClaimCalculator.ai"
              className="hidden sm:inline h-[30px] lg:h-9 w-auto object-contain"
            />
            <img
              src="/logos/claimcalculator-wordmark.png"
              alt="ClaimCalculator.ai"
              className="sm:hidden h-[18px] w-auto object-contain"
              style={{ maxWidth: 'calc(100vw - 170px)' }}
            />
          </div>
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

      {/* Dropdown Panel */}
      <div
        ref={dropdownRef}
        className={`absolute top-[72px] left-0 right-0 z-40 transition-all duration-300 ease-out origin-top ${
          isOpen
            ? 'opacity-100 scale-y-100 pointer-events-auto'
            : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
        style={{ transformOrigin: 'top center' }}
      >
        <div className="bg-[#111318] backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5">

            {/* Tab Bar */}
            <div className="flex flex-wrap gap-2 mb-5 pb-4 border-b border-white/[0.06]">
              {DROPDOWN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-headline font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_rgba(164,230,255,0.1)]'
                      : 'text-[#bbc9cf] hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Grid */}
            <div
              className={`grid gap-3 ${
                activeTab === 'navigation' || activeTab === 'attorneys'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className="text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/25 hover:bg-primary/[0.04] transition-all duration-200 group flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-headline font-bold text-on-background group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                    {item.range && (
                      <span className="text-[10px] font-headline font-bold text-[#4ADE80] ml-2 flex-shrink-0">
                        {item.range}
                      </span>
                    )}
                  </div>
                  {item.desc && (
                    <p className="text-[11px] text-on-surface-variant/60 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {/* Bottom CTA row */}
            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <p className="text-[11px] text-outline">
                ClaimCalculator.ai — Nevada's AI-Powered Personal Injury Calculator
              </p>
              <button
                onClick={() => { setIsOpen(false); navigate('/calculator'); }}
                className="cta-gradient text-on-primary-fixed px-5 py-2 rounded-lg font-headline font-bold text-xs transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Get Free Estimate →
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
