import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function FaqAccordion({ items }) {
  const [activeFaq, setActiveFaq] = useState(null)

  if (!items || items.length === 0) return null

  return (
    <div className="space-y-3">
      {items.map((faq, i) => (
        <div 
          key={i} 
          className="rounded-2xl bg-surface-container-low border border-outline-variant/10 overflow-hidden"
        >
          <button 
            className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-surface-container transition-colors group"
            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
          >
            <h3 className="text-[15px] font-headline text-on-background leading-snug pr-4 transition-colors group-hover:text-primary">
              {faq.q}
            </h3>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${activeFaq === i ? 'bg-primary border-primary text-on-primary-fixed' : 'bg-surface-container-high border-outline-variant/20 text-on-surface-variant hover:border-primary/40'}`}>
              <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </div>
          </button>
          
          {activeFaq === i && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="px-5 pb-6 pt-1 text-sm font-body text-on-surface-variant leading-relaxed whitespace-pre-wrap border-t border-outline-variant/5 mt-1 pt-4">
                {faq.a}
              </div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}
