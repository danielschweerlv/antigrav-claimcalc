import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CalculatorPage from './pages/CalculatorPage.jsx'
import HowItWorksPage from './pages/HowItWorksPage.jsx'
import InsuranceTacticsPage from './pages/InsuranceTacticsPage.jsx'
import YourRightsPage from './pages/YourRightsPage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import TermsOfServicePage from './pages/TermsOfServicePage.jsx'
import LegalNoticePage from './pages/LegalNoticePage.jsx'
import SuccessStoriesPage from './pages/SuccessStoriesPage.jsx'
import InjuryValuesPage from './pages/InjuryValuesPage.jsx'
import CaseGuidesPage from './pages/CaseGuidesPage.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { CanvasRevealEffect } from './components/ui/canvas-reveal-effect'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#111318]">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-[#111318]"
          colors={[
            [0, 209, 255],
            [99, 102, 241],
          ]}
          dotSize={3}
          reverse={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0%,_#111318_100%)] opacity-80 pointer-events-none" />
      </div>
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/insurance-tactics" element={<InsuranceTacticsPage />} />
          <Route path="/your-rights" element={<YourRightsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/legal-notice" element={<LegalNoticePage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/injury-values" element={<InjuryValuesPage />} />
          <Route path="/case-guides" element={<CaseGuidesPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </StrictMode>,
)
