import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedGroup } from '../components/ui/animated-group'

const transitionVariants = {
  container: { visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } },
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 12 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { type: 'spring', bounce: 0.3, duration: 1.5 } },
  },
}

const GUIDES = {
  'comparative-fault': {
    headline: 'How Fault Affects What You Can Recover',
    intro: 'Nevada follows a rule called modified comparative negligence. It means your fault level directly affects your payout. Here is what you need to know before talking to any adjuster.',
    sections: [
      {
        title: 'The 50% Rule',
        body: 'Nevada Revised Statute 41.141 sets a clear line. If you are 50% or less at fault, you can still recover money. But your payout gets reduced by your percentage of fault. If you are 51% or more at fault, you recover nothing.',
      },
      {
        title: 'How the Math Works',
        body: 'Say your case is worth $100,000. If you are found 20% at fault, you receive $80,000. The insurer subtracts your share of fault from the total. That is why fault percentages matter so much in negotiations.',
      },
      {
        title: 'How Insurers Use This Against You',
        body: 'Adjusters are trained to push your fault percentage as high as possible. They do this to reduce what they owe you. Even a small shift in fault, from 10% to 30%, can cost you thousands. Do not accept their fault assessment without pushing back.',
      },
      {
        title: 'What to Do',
        body: 'Get your own documentation. Photographs, witness statements, and the police report all matter. An attorney can challenge the insurer\'s fault assignment. Do not guess your own fault level. Let the facts speak.',
      },
    ],
    cta: 'Want to see how fault affects your case value? Run the free estimate. It takes about 3 minutes.',
    icon: 'balance',
    tag: 'Fault',
  },
  'what-to-do-after-accident': {
    headline: 'What to Do Right After a Car Accident in Nevada',
    intro: 'The first hours after an accident shape your entire case. Most people do not know what steps matter most. Here is what you should do, and what to avoid.',
    sections: [
      {
        title: 'Step 1: Call 911 and Get a Police Report',
        body: 'Always call 911, even for minor accidents. A police report creates an official record. Insurance companies take documented reports seriously. Without one, it is your word against theirs.',
      },
      {
        title: 'Step 2: Get Medical Attention Right Away',
        body: 'Go to a doctor even if you feel fine. Some injuries, like whiplash or internal damage, show up days later. Delaying care gives insurers a reason to say your injuries were not from the accident. Treat early and document everything.',
      },
      {
        title: 'Step 3: Document the Scene',
        body: 'Take photos of every vehicle, the road, traffic signs, and your injuries. More photos are always better than fewer. If there are witnesses, get their contact information. This evidence is hard to recreate later.',
      },
      {
        title: 'Step 4: Do Not Give a Recorded Statement',
        body: 'The other driver\'s insurance company may call you quickly. Do not give them a recorded statement. You are not required to. Anything you say can be used to reduce your payout. Politely decline and consult an attorney first.',
      },
      {
        title: 'Step 5: Contact an Attorney Before Signing Anything',
        body: 'Do not sign any release or settlement offer without legal advice. Once you sign, your case is closed, even if your injuries turn out to be worse than expected. An attorney can tell you if an offer is fair.',
      },
    ],
    cta: 'Not sure what your case is worth after the accident? Get a free estimate in minutes.',
    icon: 'checklist',
    tag: 'Steps',
  },
  '2-year-deadline': {
    headline: "Nevada's 2-Year Deadline: Do Not Miss It",
    intro: 'You have a limited window to act after a car accident in Nevada. Miss it, and you likely lose your right to recover anything. Here is what the deadline means and why it matters.',
    sections: [
      {
        title: 'The Statute of Limitations',
        body: 'Nevada law (NRS 11.190) gives you two years to file a personal injury lawsuit. The clock starts on the date of the accident. Not when you feel pain. Not when you hire an attorney. The date of the accident.',
      },
      {
        title: 'What Happens If You Miss It',
        body: 'If you file after the two-year window, the court will almost certainly dismiss your case. The other driver\'s insurance company knows this deadline. They may delay and stall on purpose to run the clock out.',
      },
      {
        title: 'Exceptions Are Rare',
        body: 'There are very few exceptions to this rule. One is if the injured person is a minor. Another is if the defendant was out of state for a period of time. Do not count on an exception applying to your situation.',
      },
      {
        title: 'Why You Should Act Early',
        body: 'Evidence disappears over time. Witnesses forget details. Surveillance footage gets deleted. The sooner you start building your case, the stronger it will be. Waiting costs you options.',
      },
      {
        title: 'The Smart Move',
        body: 'Even if you are not sure you want to file a lawsuit, talk to an attorney early. It costs nothing to get a free case evaluation. It can cost you everything to wait too long.',
      },
    ],
    cta: 'Find out what your case may be worth before time runs out. Run the free estimate now.',
    icon: 'timer',
    tag: 'Deadline',
  },
  'insurance-tactics': {
    headline: 'Tactics Insurance Companies Use to Pay You Less',
    intro: 'Insurance adjusters are not on your side. Their job is to close your case for as little money as possible. Knowing their tactics helps you protect yourself.',
    sections: [
      {
        title: 'The Lowball First Offer',
        body: 'The first offer is almost never the fair one. Adjusters are trained to open low. Many people accept the first number because they need money fast. That number rarely covers all your medical bills, let alone your pain and suffering.',
      },
      {
        title: 'The Recorded Statement Trap',
        body: 'An adjuster may call you and ask for a recorded statement "just to process the case." Do not do it. They are looking for inconsistencies. Even a small slip in wording can be used to reduce your payout.',
      },
      {
        title: 'Delay, Delay, Delay',
        body: 'Some insurers intentionally slow down the process. They hope you will get frustrated and accept a lower offer. They also know about the 2-year deadline. A long delay can work in their favor.',
      },
      {
        title: 'Using Your Social Media Against You',
        body: 'Adjusters and defense attorneys monitor social media. A photo of you at a family event could be used to say you were not seriously injured. Keep your profiles private and avoid posting anything about the accident.',
      },
      {
        title: 'Disputing Your Injuries',
        body: 'Insurers may say your injuries were pre-existing or not caused by the accident. They will look for gaps in your medical treatment. Treating consistently with a doctor, right from the start, is your best defense.',
      },
      {
        title: 'Pressuring a Quick Settlement',
        body: 'If they sense you do not know your case value, they may push for a fast settlement before you know the full extent of your injuries. Once you settle, you cannot go back for more. Do not rush.',
      },
    ],
    cta: 'Know what adjusters know about your case value. Run the free estimate before you negotiate.',
    icon: 'visibility',
    tag: 'Tactics',
  },
  'casino-premise-liability': {
    headline: 'Injured at a Casino or Business in Nevada? Here Is What to Know.',
    intro: 'Nevada property owners, including casinos, hotels, and businesses, are required by law to keep their premises safe. If they fail and you get hurt, you may have a case. Here is how Nevada premises liability law works.',
    sections: [
      {
        title: 'The Legal Duty of Care',
        body: 'Nevada law (NRS 41.130) requires property owners to maintain reasonably safe conditions for guests and visitors. This applies to casinos, hotels, shopping centers, parking garages, and private businesses. If a dangerous condition existed and they knew, or should have known, about it, they may be liable.',
      },
      {
        title: 'Common Types of Premises Liability Cases',
        body: 'Slip and fall on wet or uneven floors is the most common type. Other cases include negligent security (assault or robbery that proper security would have prevented), elevator and escalator accidents, and falling objects. Any hazard a reasonable owner should have fixed can be the basis of a case.',
      },
      {
        title: 'Casinos Have Aggressive Legal Teams',
        body: 'Nevada casinos are sophisticated defendants. They have in-house attorneys and security teams on standby. They will pull surveillance footage quickly, sometimes to use it against you. You need to act fast. Document everything before the property has a chance to clean it up or delete footage.',
      },
      {
        title: 'What to Do Right Away',
        body: 'Report the incident to the property manager and get a written incident report. Photograph the hazard and your injuries immediately. Get the names and contact information of any witnesses. Seek medical attention the same day. Do not give a statement to the property\'s insurance company without legal advice.',
      },
      {
        title: 'Documentation Is Everything',
        body: 'In premises liability cases, early evidence is critical. The property owner\'s team will begin building their defense right away. You need to do the same. Your medical records, photos, and witness accounts are the foundation of your case.',
      },
    ],
    cta: 'Not sure if your injury at a Nevada property qualifies as a case? Get a free estimate and find out.',
    icon: 'apartment',
    tag: 'Liability',
  },
  'medical-bills': {
    headline: 'How Your Medical Bills Affect Your Case Value',
    intro: 'Medical bills are one of the biggest factors in what your case is worth. Understanding how they are calculated, and what comes out of your settlement, puts you in a better position to negotiate.',
    sections: [
      {
        title: 'Special Damages: Your Actual Bills',
        body: 'Special damages are the concrete, measurable losses from your accident. Medical bills are the main component. This includes emergency room visits, follow-up appointments, physical therapy, imaging, and prescriptions. Every bill should be documented. Keep all records.',
      },
      {
        title: 'General Damages: Pain and Suffering',
        body: 'General damages cover non-economic losses, including pain, suffering, emotional distress, and loss of enjoyment of life. Adjusters typically calculate these as a multiplier of your special damages. A more serious injury with consistent treatment tends to produce a higher multiplier. This is why treating regularly matters.',
      },
      {
        title: 'Medical Liens',
        body: 'If you received treatment at a facility that agreed to wait for payment until your case settles, they have placed a lien on your settlement. This means a portion of your payout goes directly to the provider. Liens reduce your net recovery, so it is important to know what liens exist before you settle.',
      },
      {
        title: 'Health Insurance Subrogation',
        body: 'If your health insurance paid your medical bills, they may have a right to be reimbursed from your settlement. This is called subrogation. The amount they are owed varies depending on your policy and the type of plan. An attorney can often negotiate this amount down.',
      },
      {
        title: 'Why Consistent Treatment Matters',
        body: 'Gaps in your medical care are used against you. If you stopped treating and then resumed, the insurer may argue your injuries are not as serious as stated. Treating consistently from the start builds a record that supports your case value.',
      },
    ],
    cta: 'See how your medical bills factor into your total case estimate. Run the free calculator now.',
    icon: 'local_hospital',
    tag: 'Medical',
  },
}

const TAG_COLORS = {
  Fault: { bg: 'rgba(164,230,255,0.12)', border: 'rgba(164,230,255,0.25)', text: '#a4e6ff' },
  Steps: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', text: '#4ADE80' },
  Deadline: { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.25)', text: '#FB923C' },
  Tactics: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#EF4444' },
  Liability: { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.25)', text: '#FACC15' },
  Medical: { bg: 'rgba(216,217,255,0.12)', border: 'rgba(216,217,255,0.25)', text: '#d8d9ff' },
}

export default function CaseGuideDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const guide = GUIDES[slug]

  if (!guide) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-headline text-on-background">Guide Not Found</h1>
          <p className="text-on-surface-variant">The guide you are looking for does not exist.</p>
          <button
            onClick={() => navigate('/case-guides')}
            className="cta-gradient text-on-primary-fixed px-6 py-3 rounded-xl font-headline font-bold text-sm"
          >
            Back to All Guides
          </button>
        </div>
      </div>
    )
  }

  const colors = TAG_COLORS[guide.tag]

  return (
    <div className="relative min-h-screen bg-transparent">
      <main className="relative z-10 pt-[58px]">

        {/* Breadcrumb */}
        <section className="px-4 lg:px-8 pt-8">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-outline">
              <Link to="/case-guides" className="hover:text-primary transition-colors">Nevada Case by Case Play Book</Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-on-surface-variant">{guide.headline}</span>
            </nav>
          </div>
        </section>

        {/* Hero Header */}
        <section className="px-4 lg:px-8 pt-8 lg:pt-12 pb-8 lg:pb-12">
          <AnimatedGroup variants={transitionVariants} className="max-w-4xl mx-auto space-y-5">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-4xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {guide.icon}
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              >
                {guide.tag}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline text-on-background leading-tight">
              {guide.headline}
            </h1>
            <p className="text-base lg:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
              {guide.intro}
            </p>
          </AnimatedGroup>
        </section>

        {/* Content Sections */}
        <section className="px-4 lg:px-8 py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            <AnimatedGroup
              variants={{ container: { visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }, item: transitionVariants.item }}
              className="space-y-5"
            >
              {guide.sections.map((section, i) => (
                <div
                  key={section.title}
                  className="p-6 lg:p-8 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/15 transition-colors duration-300"
                >
                  <h2 className="text-lg lg:text-xl font-headline text-on-background mb-3">{section.title}</h2>
                  <p className="text-sm lg:text-base text-on-surface-variant leading-relaxed">{section.body}</p>
                </div>
              ))}
            </AnimatedGroup>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 lg:py-24 px-4 lg:px-8">
          <motion.div
            className="max-w-2xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.2 }}
          >
            <div className="p-6 lg:p-10 rounded-2xl bg-primary/5 border border-primary/15 space-y-4">
              <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>calculate</span>
              <p className="text-on-surface-variant text-base lg:text-lg max-w-md mx-auto">
                {guide.cta}
              </p>
              <button
                onClick={() => navigate('/calculator')}
                className="cta-gradient cta-shimmer text-on-primary-fixed px-10 py-5 rounded-[16px] font-headline font-bold text-lg inline-flex items-center gap-2 shadow-[0_0_30px_rgba(164,230,255,0.2)] hover:shadow-[0_8px_40px_rgba(164,230,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 group"
              >
                Get My Free Estimate
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>arrow_forward</span>
              </button>
            </div>

            {/* Back link */}
            <Link
              to="/case-guides"
              className="inline-flex items-center gap-1 text-sm text-outline hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to all guides
            </Link>
          </motion.div>
        </section>

      </main>
    </div>
  )
}
