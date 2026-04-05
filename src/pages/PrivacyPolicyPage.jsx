import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const sections = [
  {
    id: 'introduction',
    num: '1',
    title: 'Introduction',
    content: (
      <div className="space-y-4">
        <p>Welcome. You have arrived at a website provided by ClaimCalculator.ai (hereinafter "Company," "we," "our" or "us") or one of our affiliates. Our mission is to bridge the gap between a law firm's need to grow and an underserved community's need for trustworthy legal services.</p>
        <p>We take your privacy seriously. We provide this Privacy Policy ("Policy") to tell you what information we collect about you, how we obtain it, how we share it, and how you may limit the ways in which we use your personal information. If you have questions about this Policy after you review it, feel free to contact us at <a href="mailto:privacy@claimcalculator.ai" className="text-primary hover:underline">privacy@claimcalculator.ai</a>.</p>
      </div>
    ),
  },
  {
    id: 'scope',
    num: '2',
    title: 'Scope',
    content: (
      <div className="space-y-4">
        <p>This Policy applies when you use or access our website or any landing page operated by us that links to this Policy, or when you otherwise provide Personal Information or interact with us online, via phone calls or other communications with our representatives or in-person.</p>
        <p>For this Policy, "Personal Information" is information that identifies, relates to, or could reasonably be linked with you or your household. We refer to all the above as our "Services." Our Services are used by people who contact us looking for legal services ("Users"), attorneys and law firms with whom we partner ("Firms") and individuals seeking employment with us ("Employment Applicants").</p>
        <p>Please note that if you provide your information while interacting with our Sites or Services, we will take that as your agreement to our collection, use, and disclosure of your information as set forth in this Policy.</p>
        <p>This Policy does not apply to any products, goods, services, websites, or content that are offered by third parties ("Third Party Services"), which are governed by their respective privacy policies.</p>
      </div>
    ),
  },
  {
    id: 'what-we-collect',
    num: '3',
    title: 'What Information We Collect',
    content: (
      <div className="space-y-6">
        <p>As a general rule, we limit the Personal Information we collect to that which is adequate, relevant, and reasonably necessary for us to provide our Services to you.</p>
        <div>
          <h4 className="text-sm font-bold text-on-background mb-3 uppercase tracking-widest text-xs">Information That You Provide to Us</h4>
          <p className="mb-3">As you interact with our Sites or Services, we may collect some or all of the following Personal Information via webforms and other communications with you:</p>
          <ul className="space-y-2">
            {[
              'Contact information such as your first and last name, email address, home or business address, telephone numbers and mobile numbers',
              'Age, date of birth and gender',
              'Status of driver\'s registration and insurance',
              'Job title and your current or past employment or educational information',
              'Disability status or other health information',
              'Details of your vehicle, pedestrian or workplace accident(s) or incident(s), including dates, times and locations; names or other identifying information of other individuals involved; the extent of your injuries, damages and/or treatment',
              'Audiovisual information such as recordings of your voice for calls to our representatives',
              'Other information that you voluntarily provide that could reasonably be used to identify you personally',
            ].map(item => (
              <li key={item} className="flex gap-2.5 text-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-background mb-3 uppercase tracking-widest text-xs">Information That Is Automatically Collected</h4>
          <p className="mb-3">Like many businesses, we automatically collect certain information when you visit or interact with our Sites ("Usage Information"), including:</p>
          <ul className="space-y-2">
            {[
              'Your IP address or another unique identifier',
              'Your device functionality (browser, operating system, hardware, mobile network information)',
              'Referring and exit web pages and URLs',
              'Areas within the Sites that you visit and your activities there',
              'Your device location or other location information, including zip code, state or country',
              'Information about your engagement with our emails',
              'Statistical information about how users, collectively, use the Sites',
            ].map(item => (
              <li key={item} className="flex gap-2.5 text-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-background mb-3 uppercase tracking-widest text-xs">Information Collected from Third Parties</h4>
          <p>Our Sites may include functionality that allows certain interactions between our Sites and your account on a third-party website or application. We also may obtain information about traffic and usage from third parties. We do not have control over the information that is collected, used, and shared by these third parties. We encourage you to review their privacy statements.</p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-background mb-3 uppercase tracking-widest text-xs">Information We Infer</h4>
          <p>We derive information or draw inferences about you based on information we collect. For example, based on your contact information or language spoken, we may infer your interest in certain attorneys or law firms.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'cookies',
    num: '4',
    title: 'Use of Cookies and Other Tracking Technologies',
    content: (
      <div className="space-y-4">
        <p>We may use various methods and technologies to store or collect Usage Information ("Tracking Technologies"), including:</p>
        <ul className="space-y-2">
          {[
            'Cookies — files placed on a device to uniquely identify your browser or store information on your device',
            'Pixels — small graphic files that allow us to monitor use of the Sites',
            'Web Beacons — small tags placed on our pages',
            'Embedded Scripts — code that collects information about your interactions',
            'Browser Fingerprinting — collection and analysis of device data for identification',
            'Recognition Technologies — statistical tools used to recognize users across devices',
          ].map(item => (
            <li key={item} className="flex gap-2.5 text-sm text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'why-we-collect',
    num: '5',
    title: 'Why We Collect Information',
    content: (
      <div className="space-y-4">
        <p>We use the information we collect about you in a variety of ways, including:</p>
        <ul className="space-y-2">
          {[
            'To process your request for legal services and facilitate the functionality of our Sites',
            'To communicate with you about your requests and our Services',
            'To respond to your service inquiries and requests for information',
            'To maintain, improve, and analyze our Sites or Services',
            'To detect, prevent, or investigate suspicious activity or fraud',
            'To comply with applicable legal and regulatory obligations',
            'To enforce our terms, policies, and agreements',
            'To evaluate your application for employment',
          ].map(item => (
            <li key={item} className="flex gap-2.5 text-sm text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'ai-chatbots',
    num: '6',
    title: 'Use of AI Chatbots',
    content: (
      <p>We use chatbots operated by artificial intelligence ("AI") on some of our Sites. Users of the Sites may be interacting with an AI chatbot rather than a human. If you prefer to speak to a human, please contact us using the information in the Contact Us section below.</p>
    ),
  },
  {
    id: 'disclosure',
    num: '7',
    title: 'When We Disclose Information',
    content: (
      <div className="space-y-4">
        <p>As a business, we may need to disclose your personal information to service providers outside our organization. Certain nonpublic information about you may be disclosed in the following situations:</p>
        <ul className="space-y-2">
          {[
            'To comply with applicable law or respond to valid legal process, including from law enforcement or other government agencies',
            'As part of any actual or threatened legal proceedings, disclosing only the information necessary',
            'During a review of our practices under authorization of a state or national licensing board',
            'In conjunction with a prospective purchase, sale, or merger of all or part of our company',
            'To provide information to affiliates and nonaffiliated third parties who perform services for us under a contractual agreement',
          ].map(item => (
            <li key={item} className="flex gap-2.5 text-sm text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
        <p>We may also share your information with affiliates and other third parties for direct marketing purposes, as disclosed at the time you provide your information.</p>
      </div>
    ),
  },
  {
    id: 'ads',
    num: '8',
    title: 'Ads and Information About You',
    content: (
      <div className="space-y-4">
        <p>You may see certain ads because we participate in advertising networks administered by third parties. These networks track your online activities over time and across third party websites to show you advertisements tailored to your individual interests.</p>
        <p>You can opt out of targeted advertising on some platforms:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Meta', url: 'https://www.facebook.com/settings/?tab=ads' },
            { name: 'Google', url: 'https://adssettings.google.com/' },
            { name: 'Bing', url: 'https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads' },
            { name: 'LinkedIn', url: 'https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out' },
          ].map(({ name, url }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/10 text-xs text-primary hover:border-primary/30 transition-colors">
              {name}
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'children',
    num: '9',
    title: "Children's Privacy",
    content: (
      <p>Our Sites are not intended for use by children under the age of 18. We do not request, or knowingly collect, any personally identifiable information from children under the age of 18. If you are the parent or guardian of a child under 18 who you believe has provided their information to us, please contact us using the information in the Contact Us section below to request the deletion of that information.</p>
    ),
  },
  {
    id: 'outside-us',
    num: '10',
    title: 'Visitors to the Sites Outside of the United States',
    content: (
      <p>Our Sites are not intended for visitors outside of the United States. If you are visiting from a location outside of the U.S., your connection will be through and to servers located in the U.S. By using the Sites or providing us with any information, you consent to the transfer to, and processing, usage, sharing and storage of your information in the United States.</p>
    ),
  },
  {
    id: 'third-party-links',
    num: '11',
    title: 'Third-Party Links',
    content: (
      <p>For your convenience, the Sites and this Policy may contain links to other websites not controlled by us. We are not responsible for the privacy practices, advertising, products, services, or the content of such other websites. The use of third-party links on our Sites should not be deemed to imply that we endorse or have any affiliation with the links.</p>
    ),
  },
  {
    id: 'security',
    num: '12',
    title: 'Security',
    content: (
      <p>We incorporate commercially reasonable safeguards to help protect and secure your Personal Information. However, no data transmission over the Internet, mobile networks, wireless transmission, or electronic storage of information can be guaranteed 100% secure. As a result, we cannot guarantee or warrant the security of any information you transmit to or from the Sites, and you provide us with your information at your own risk.</p>
    ),
  },
  {
    id: 'retention',
    num: '13',
    title: 'Retention of Personal Information',
    content: (
      <div className="space-y-4">
        <p>We will retain your Personal Information only for as long as is necessary for the purposes set out in this Policy. When deciding how long to keep your information, we consider:</p>
        <ul className="space-y-2">
          {[
            'How long we have had a relationship with you or provided our Services to you',
            'Whether we are subject to any legal obligations requiring us to keep transaction records for a certain period',
            'Whether we have taken any legal positions in connection with statutes of limitation',
          ].map(item => (
            <li key={item} className="flex gap-2.5 text-sm text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'privacy-choices',
    num: '14',
    title: 'Your Privacy Choices',
    content: (
      <div className="space-y-4">
        <p><strong className="text-on-background">Updating Your Personal Information:</strong> If you would like to change your contact information, please contact us using the information in the Contact Us section below. We will make good faith efforts to make requested changes in our then active databases as soon as reasonably practicable.</p>
        <p><strong className="text-on-background">Communications Preferences:</strong> You can opt out of receiving emails or text messages from us at any time. To manage your preferences — or to opt out entirely — please unsubscribe at the bottom of our emails, reply "STOP" to our text messages, or contact us directly.</p>
        <p><strong className="text-on-background">Do Not Track:</strong> Do Not Track ("DNT") is a web browser setting that requests that a web application disable its tracking of an individual user. Currently, we do not monitor or take any action with respect to these signals or other mechanisms.</p>
        <p><strong className="text-on-background">Analytics:</strong> We use Google Analytics to help us understand how visitors use the Sites. You can opt out of Google Analytics by using <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's opt-out tool</a>.</p>
      </div>
    ),
  },
  {
    id: 'nevada',
    num: '15',
    title: 'Your Nevada Privacy Rights',
    content: (
      <div className="space-y-4">
        <p>This section applies solely to Nevada residents and is adopted to comply with Nevada Revised Statutes (NRS) Chapter 603A, including Senate Bill 220 and Senate Bill 260. Nevada residents have the following rights regarding their covered information:</p>
        <ul className="space-y-2">
          {[
            'To be informed of the categories of covered information collected and the third parties with whom it is shared',
            'To review and request changes to any of your covered information that has been collected',
            'To opt out of the "sale" of your covered information (as defined under NRS 603A.333), directing us not to sell your data to third parties who will license or sell it to others',
            'To be notified of any material changes to this Privacy Policy',
          ].map(item => (
            <li key={item} className="flex gap-2.5 text-sm text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
        <p>Because ClaimCalculator.ai caters specifically to Nevada residents, we prioritize your rights under NRS 603A. To exercise your right to opt out of the sale of your covered information or to review your data, please contact us at <a href="mailto:privacy@claimcalculator.ai" className="text-primary hover:underline">privacy@claimcalculator.ai</a> with the subject line "Nevada Privacy Rights Request". We will verify your identity and process your request within 60 days of receipt.</p>
      </div>
    ),
  },
  {
    id: 'other-states',
    num: '16',
    title: 'Your Privacy Rights under Other US State Laws',
    content: (
      <div className="space-y-4">
        <p>If you live in certain U.S. states — including California, Colorado, Connecticut, Oregon, Texas, Virginia, and others — you may have rights under applicable privacy laws, including:</p>
        <ul className="space-y-2">
          {[
            'To confirm whether or not we are processing your personal data and to access such data',
            'To correct inaccuracies in your personal data',
            'To delete your personal data',
            'To obtain a portable copy of your personal data',
            'To opt out of the processing of your personal data for targeted advertising or the sale of personal data',
            'Not to be discriminated against for exercising these rights',
          ].map(item => (
            <li key={item} className="flex gap-2.5 text-sm text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'changes',
    num: '17',
    title: 'Changes to This Privacy Policy',
    content: (
      <p>We may change this Privacy Policy at any time. We will post all changes to this Policy on this page and indicate at the top of the page the modified policy's effective date. We encourage you to refer to this page on an ongoing basis so that you are aware of our current privacy policy. By continuing to use the Sites or Services following any update, you agree to be bound by the Privacy Policy as changed.</p>
    ),
  },
  {
    id: 'contact',
    num: '18',
    title: 'Contact Us',
    content: (
      <div className="space-y-3">
        <p>If you have any questions or suggestions regarding this Policy, please contact us:</p>
        <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/10 space-y-2 text-sm">
          <p className="font-bold text-on-background">ClaimCalculator.ai</p>
          <p className="text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">mail</span>
            <a href="mailto:privacy@claimcalculator.ai" className="text-primary hover:underline">privacy@claimcalculator.ai</a>
          </p>
        </div>
      </div>
    ),
  },
]

export default function PrivacyPolicyPage() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(null)

  return (
    <div className="min-h-screen bg-transparent">

      {/* Nav */}
      

      <main className="pt-20 pb-24 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <motion.div
            className="text-center pt-12 pb-10 space-y-4"
            initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/15">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="text-xs font-label font-semibold text-primary uppercase tracking-widest">Last updated: 2024</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-on-background">Privacy <span className="text-primary italic">Policy</span></h1>
            <p className="text-on-surface-variant max-w-xl mx-auto text-base leading-relaxed">
              We take your privacy seriously. This policy explains exactly what data we collect, why we collect it, and how you can control it.
            </p>
          </motion.div>

          {/* Table of contents */}
          <motion.div
            className="mb-10 p-5 rounded-2xl border border-outline-variant/10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2, delay: 0.3 }}
          >
            <p className="text-xs font-label font-bold text-outline uppercase tracking-widest mb-4">Table of Contents</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {sections.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors py-1 group"
                >
                  <span className="text-[10px] font-bold text-outline w-5 flex-shrink-0">{s.num}.</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">{s.title}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section, i) => (
              <motion.div
                key={section.id}
                id={section.id}
                className="rounded-2xl border border-outline-variant/10 overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 1.1, delay: Math.min(i * 0.05, 0.3) }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 lg:p-6 text-left hover:bg-surface-container transition-colors"
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary w-7 flex-shrink-0">{section.num}.</span>
                    <h2 className="text-base font-headline font-bold text-on-background">{section.title}</h2>
                  </div>
                  <span className={`material-symbols-outlined text-outline flex-shrink-0 transition-transform duration-300 ${activeSection === section.id ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {activeSection === section.id && (
                  <motion.div
                    className="px-5 lg:px-6 pb-6 pt-2 text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="pt-4">{section.content}</div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Disclaimer */}
          <motion.div
            className="mt-10 p-5 rounded-2xl border border-outline-variant/5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="text-[11px] text-outline leading-relaxed">
              ClaimCalculator.ai is not a law firm or an attorney referral service. This advertisement is not legal advice and is not a guarantee or prediction of the outcome of your legal matter. Every case is different. The settlement estimate provided by ClaimCalculator.ai is for informational and illustrative purposes only and does not constitute legal advice, a valuation, or a guarantee of results. Use of this tool does not create an attorney-client relationship.
            </p>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
