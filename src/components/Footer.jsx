import React from 'react'
import { useNavigate } from 'react-router-dom'
import AIChipLogo from './ui/AIChipLogo'

export default function Footer() {
  const navigate = useNavigate()

  const navTo = (path) => {
    window.scrollTo(0, 0)
    navigate(path)
  }

  return (
    <footer className="bg-[#0c0e12] py-10 px-4 lg:px-6 relative z-50">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Top row: Logo + AI chip */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-sm text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <img src="/logo.png" alt="ClaimCalculator.ai" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(0,209,255,0.4)]" />
              <span className="text-base font-bold text-on-background font-headline">ClaimCalculator<span className="text-primary">.ai</span></span>
            </div>
            <p className="text-on-surface-variant font-body text-xs leading-relaxed">
              Helping Nevada accident victims understand the true value of their claims and connect with experienced local attorneys.
            </p>
          </div>

          {/* AI Microchip Logo */}
          <div className="flex flex-shrink-0 items-center justify-center">
            <div className="bg-[#111318]/40 p-4 sm:p-6 rounded-[2rem] border border-outline-variant/10">
              <AIChipLogo className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44" />
            </div>
          </div>
        </div>

        {/* 4-Column Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">

          {/* Column 1: Nevada Claim Guides */}
          <div className="space-y-3">
            <h6 className="text-white font-bold text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Nevada Claim Guides</h6>
            <ul className="space-y-2 mt-2">
              {[
                { label: 'How Comparative Fault Works', path: '/your-rights' },
                { label: 'After a Las Vegas Accident', path: '/how-it-works' },
                { label: "Nevada's 2-Year Filing Deadline", path: '/your-rights' },
                { label: 'Insurance Lowball Tactics', path: '/insurance-tactics' },
                { label: 'Strip & Casino Injury Liability', path: '/your-rights' },
                { label: 'Understanding Your Medical Bills', path: '/how-it-works' },
              ].map(({ label, path }) => (
                <li key={label}>
                  <button onClick={() => navTo(path)} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-body text-left">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h6 className="text-white font-bold text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Navigation</h6>
            <ul className="space-y-2 mt-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'How It Works', path: '/how-it-works' },
                { label: 'Insurance Tactics', path: '/insurance-tactics' },
                { label: 'Your Rights', path: '/your-rights' },
                { label: 'Legal Notice', path: '/legal-notice' },
                { label: 'Contact Us', href: 'mailto:support@claimcalculator.ai' },
              ].map(({ label, path, href }) => (
                <li key={label}>
                  {href ? (
                    <a className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-body" href={href}>{label}</a>
                  ) : (
                    <button onClick={() => navTo(path)} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-body text-left">{label}</button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Nevada Case Types */}
          <div className="space-y-3">
            <h6 className="text-white font-bold text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Nevada Case Types</h6>
            <ul className="space-y-2 mt-2">
              {[
                'Car Accidents',
                'Uber & Lyft Accidents',
                'Strip & Pedestrian Accidents',
                'Casino & Hotel Injuries',
                'Motorcycle Accidents',
                'Truck & 18-Wheeler Accidents',
                'Construction Zone Crashes',
                'Parking Lot & Garage Accidents',
              ].map((label) => (
                <li key={label}>
                  <button onClick={() => navTo('/calculator')} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-body text-left">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: For Attorneys */}
          <div className="space-y-3">
            <h6 className="text-white font-bold text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">For Attorneys</h6>
            <ul className="space-y-2 mt-2">
              {[
                { label: 'Partner With Us', href: 'mailto:partners@claimcalculator.ai' },
                { label: 'Submit a Case Result', href: 'mailto:results@claimcalculator.ai' },
                { label: 'Attorney Login', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-body" href={href}>{label}</a>
                </li>
              ))}
            </ul>

            {/* Legal page links */}
            <div className="pt-4 mt-4 border-t border-outline-variant/10">
              <ul className="space-y-2">
                {[
                  { label: 'Privacy Policy', path: '/privacy-policy' },
                  { label: 'Terms of Service', path: '/terms-of-service' },
                ].map(({ label, path }) => (
                  <li key={label}>
                    <button onClick={() => navTo(path)} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-body text-left">{label}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer Block 1 — General Disclaimer */}
        <div className="pt-8 border-t border-outline-variant/10 space-y-5">
          <div>
            <p className="text-[10px] font-label font-bold text-outline/60 uppercase tracking-widest mb-2">General Disclaimer</p>
            <p className="text-outline/40 text-[9px] sm:text-[10px] font-body leading-[1.6] text-justify">
              This website provides estimates for informational and educational purposes only. Nothing on this site is legal advice, and no attorney-client relationship is created by using this tool. If you have been injured, consult a licensed Nevada personal injury attorney before making any decisions about your claim.
            </p>
          </div>

          {/* Disclaimer Block 2 — Attorney Advertising Disclosure */}
          <div>
            <p className="text-[10px] font-label font-bold text-outline/60 uppercase tracking-widest mb-2">Attorney Advertising Disclosure</p>
            <p className="text-outline/40 text-[9px] sm:text-[10px] font-body leading-[1.6] text-justify">
              ClaimCalculator.ai is an attorney advertising service. No attorney-client relationship is formed by visiting this website, using the calculator, or submitting your information through any form on this site. Attorneys and law firms who may contact you through this service have paid an advertising fee to participate. That fee does not affect the estimate you receive or the outcome of your claim. By submitting your information, you consent to being contacted by a participating Nevada-licensed attorney or their representative by phone call, text message, or email regarding your potential claim. The estimates provided by this tool are not guarantees of settlement value. Every case is different. Under Nevada's modified comparative negligence law (NRS 41.141), your recovery depends on your share of fault, the severity of your injuries, available insurance coverage, and other factors specific to your situation. If you are found more than 50% at fault, Nevada law bars you from recovering any damages.
            </p>
          </div>

          {/* Copyright */}
          <p className="text-[#bbc9cf] font-bold text-[10px] sm:text-[11px] font-body opacity-40 pt-2 border-t border-outline-variant/5 mt-4 text-center">
            &copy; {new Date().getFullYear()} ClaimCalculator.ai. All Rights Reserved.
          </p>
        </div>

        {/* Data sources disclaimer */}
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <p style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.28)',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto',
            padding: '16px 24px 24px',
            lineHeight: 1.6,
          }}>
            Data sources referenced by ClaimCalculator.ai include publicly available records from Nevada state and local government agencies. ClaimCalculator.ai is not affiliated with, endorsed by, or sponsored by any government agency, law enforcement organization, or third-party entity referenced on this site. This tool provides general estimates only and does not constitute legal advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
