import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CpuArchitecture } from './ui/cpu-architecture'
import AnimatedCross from './ui/AnimatedCross'

export default function Footer() {
  const navigate = useNavigate()

  const navTo = (path) => {
    window.scrollTo(0, 0)
    navigate(path)
  }

  return (
    <footer className="py-8 px-4 lg:px-6 relative z-0">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top row: Logo */}
        <div className="flex flex-col items-center lg:items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.4))' }}>
              <AnimatedCross className="w-full h-full" />
            </div>
            <img
              src="/logos/claimcalculator-wordmark.png"
              alt="ClaimCalculator.ai"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>
          <p className="text-on-surface-variant font-body text-sm leading-relaxed text-center lg:text-left max-w-sm">
            Helping people across Nevada understand the true value of their cases and connect with experienced local attorneys.
          </p>
        </div>

        {/* 3-Column Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">

          {/* Column 1: Company */}
          <div className="space-y-3">
            <h6 className="text-white text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Company</h6>
            <ul className="space-y-2 mt-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'How It Works', path: '/how-it-works' },
                { label: 'Success Stories', path: '/success-stories' },
                { label: 'Contact', href: 'mailto:support@claimcalculator.ai' },
              ].map(({ label, path, href }) => (
                <li key={label}>
                  {href ? (
                    <a className="text-outline hover:text-[#00d1ff] transition-colors text-sm font-body" href={href}>{label}</a>
                  ) : (
                    <button onClick={() => navTo(path)} className="text-outline hover:text-[#00d1ff] transition-colors text-sm font-body text-left">{label}</button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h6 className="text-white text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Resources</h6>
            <ul className="space-y-2 mt-2">
              {[
                { label: 'Injury Values', path: '/injury-values' },
                { label: 'Nevada Case by Case Play Book', path: '/case-guides' },
                { label: 'Insurance Tactics', path: '/insurance-tactics' },
                { label: 'Your Rights', path: '/your-rights' },
                { label: 'Free Evaluation', path: '/calculator' },
              ].map(({ label, path }) => (
                <li key={label}>
                  <button onClick={() => navTo(path)} className="text-outline hover:text-[#00d1ff] transition-colors text-sm font-body text-left">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-3">
            <h6 className="text-white text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Legal</h6>
            <ul className="space-y-2 mt-2">
              {[
                { label: 'Privacy Policy', path: '/privacy-policy' },
                { label: 'Terms of Service', path: '/terms-of-service' },
                { label: 'Legal Notice', path: '/legal-notice' },
              ].map(({ label, path }) => (
                <li key={label}>
                  <button onClick={() => navTo(path)} className="text-outline hover:text-[#00d1ff] transition-colors text-sm font-body text-left">{label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Block */}
        <div className="pt-6 border-t border-outline-variant/10 space-y-4">

          {/* Centered CPU Architecture — above disclaimers */}
          <div className="flex justify-center pb-2">
            <CpuArchitecture
              className="w-48 h-24 sm:w-64 sm:h-32 lg:w-80 lg:h-40"
              animateText={true}
              animateLines={true}
              animateMarkers={true}
              showCpuConnections={true}
            />
          </div>

          <div>
            <p className="text-[10px] font-label font-bold text-outline/60 uppercase tracking-widest mb-2">General Disclaimer</p>
            <p className="text-outline/40 text-[9px] sm:text-[10px] font-body leading-[1.6] text-justify">
              This website provides estimates for informational and educational purposes only. Nothing on this site is legal advice, and no attorney-client relationship is created by using this tool. If you have been injured, consult a licensed Nevada personal injury attorney before making any decisions about your case.
            </p>
          </div>

          {/* Disclaimer Block 2 — Attorney Advertising Disclosure */}
          <div>
            <p className="text-[10px] font-label font-bold text-outline/60 uppercase tracking-widest mb-2">Attorney Advertising Disclosure</p>
            <p className="text-outline/40 text-[9px] sm:text-[10px] font-body leading-[1.6] text-justify">
              ClaimCalculator.ai is an attorney advertising service. No attorney-client relationship is formed by visiting this website, using the calculator, or submitting your information through any form on this site. Attorneys and law firms who may contact you through this service have paid an advertising fee to participate. That fee does not affect the estimate you receive or the outcome of your case. By submitting your information, you consent to being contacted by a participating Nevada-licensed attorney or their representative by phone call, text message, or email regarding your potential case. The estimates provided by this tool are not guarantees of settlement value. Every case is different. Under Nevada's modified comparative negligence law (NRS 41.141), your recovery depends on your share of fault, the severity of your injuries, available insurance coverage, and other factors specific to your situation. If you are found more than 50% at fault, Nevada law bars you from recovering any damages.
            </p>
          </div>

          {/* Data Sources Disclaimer */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
            <p style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.28)',
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Data sources referenced by ClaimCalculator.ai include publicly available records from Nevada state and local government agencies. ClaimCalculator.ai is not affiliated with, endorsed by, or sponsored by any government agency, law enforcement organization, or third-party entity referenced on this site. This tool provides general estimates only and does not constitute legal advice.
            </p>
          </div>

          {/* Copyright */}
          <p className="text-[#bbc9cf] font-bold text-[10px] sm:text-[11px] font-body opacity-40 pt-2 border-t border-outline-variant/5 mt-3 text-center">
            &copy; {new Date().getFullYear()} ClaimCalculator.ai. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
