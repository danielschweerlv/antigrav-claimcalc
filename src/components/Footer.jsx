import React from 'react'
import { useNavigate } from 'react-router-dom'
import AIChipLogo from './ui/AIChipLogo'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-[#0c0e12] py-10 px-4 lg:px-6 relative z-50">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-10 lg:gap-16 xl:gap-24">
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ClaimCalculator.ai" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(0,209,255,0.4)]" />
              <span className="text-base font-bold text-on-background font-['Space_Grotesk']">ClaimCalculator<span className="text-primary">.ai</span></span>
            </div>
            <p className="text-on-surface-variant font-['Manrope'] text-xs leading-relaxed">
              Helping Nevada car accident victims understand the true value of their claims through AI and expert legal connections.
            </p>
          </div>
          
          {/* Centered Large AI Microchip Logo */}
          <div className="flex flex-shrink-0 items-center justify-center py-6 lg:py-0">
             <div className="bg-[#111318]/40 p-4 sm:p-6 rounded-[2rem] border border-outline-variant/10">
               <AIChipLogo className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44" />
             </div>
          </div>
          
          <div className="grid grid-cols-2 md:flex md:gap-16 gap-8 text-sm w-full xl:w-auto xl:justify-end">
            <div className="space-y-3">
              <h6 className="text-white font-bold text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Resources</h6>
              <ul className="space-y-2 mt-2">
                <li><button onClick={() => window.scrollTo(0,0) || navigate('/legal-notice')} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-['Manrope']">Legal Notice</button></li>
                <li><button onClick={() => window.scrollTo(0,0) || navigate('/terms-of-service')} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-['Manrope']">Terms of Service</button></li>
                <li><button onClick={() => window.scrollTo(0,0) || navigate('/privacy-policy')} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-['Manrope']">Privacy Policy</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h6 className="text-white font-bold text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Information</h6>
              <ul className="space-y-2 mt-2">
                <li><button onClick={() => window.scrollTo(0,0) || navigate('/how-it-works')} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-['Manrope']">How It Works</button></li>
                <li><button onClick={() => window.scrollTo(0,0) || navigate('/insurance-tactics')} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-['Manrope']">Insurance Tactics</button></li>
                <li><button onClick={() => window.scrollTo(0,0) || navigate('/your-rights')} className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-['Manrope']">Your Rights</button></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h6 className="text-white font-bold text-[11px] uppercase tracking-widest bg-white/5 inline-block px-2 py-1 rounded">Contact</h6>
              <ul className="space-y-2 mt-2">
                <li><a className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-['Manrope']" href="mailto:support@claimcalculator.ai">Contact Us</a></li>
                <li><a className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-['Manrope']" href="#">Partner With Us</a></li>
                <li><a className="text-outline hover:text-[#00d1ff] transition-colors text-xs font-['Manrope']" href="#">Support</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-outline-variant/10 space-y-4">
          <p className="text-outline/40 text-[9px] sm:text-[10px] font-['Manrope'] leading-[1.6] text-justify">
            Advertising paid for by participating attorneys in a joint advertising program. A list of joint advertising attorneys can be found at Sponsors. You can request an attorney by name. ClaimCalculator.ai is not a law firm or an attorney referral service. This advertisement is not legal advice and is not a guarantee or prediction of the outcome of your legal matter. Every case is different, and testimonials should not be relied on as a prediction of the outcome of your legal matter. The outcome depends on the laws, facts, and circumstances unique to each case. Monetary results portrayed by testimonials are not typical. Testimonial results do not apply to all participating attorneys and are not indicative of any future results by any particular attorney. Hiring an attorney is an important decision that should not be based solely on advertising. Request free information about your attorney's background and experience. This advertising does not imply a higher quality of legal services than those provided by other attorneys or that the attorneys are certified specialists or experts in any area of law. Individuals appearing on this website are paid actors and/or spokesperson(s), not lawyers or clients. Any depictions of accidents, consultations, or other events are dramatizations. Additional disclaimers and state-specific notices may be found at Legal Notice.
          </p>
          <p className="text-outline/40 text-[9px] sm:text-[10px] font-['Manrope'] leading-[1.6] text-justify">
            The settlement estimate provided by ClaimCalculator.ai is produced using a proprietary model informed by more than 9,000 prior U.S. settlements and multiple third-party data sources. This tool is for informational and illustrative purposes only and does not constitute legal advice, a valuation, or a guarantee of results. Actual outcomes depend on the specific facts of your case and the attorney representing you. Past results do not predict future outcomes. Every case is unique, and actual results depend on specific facts, applicable law, and your attorney's representation. Use of this tool does not create an attorney-client relationship. This tool has inherent limitations and may not capture all relevant factors. You should consult with a qualified Nevada attorney before making decisions about your case.
          </p>
          <p className="text-[#bbc9cf] font-bold text-[10px] sm:text-[11px] font-['Manrope'] opacity-40 pt-2 border-t border-outline-variant/5 mt-4 text-center">
            © {new Date().getFullYear()} ClaimCalculator.ai. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
