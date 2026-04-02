import React from 'react'
import { motion } from 'framer-motion'

/**
 * Persistent animated orbital ring background.
 * Fixed to viewport — stays visible while scrolling.
 * Styled in the ClaimCalculator.ai primary cyan color palette.
 */
export default function OrbitBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* Center glow core */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '2px',
          height: '2px',
        }}
      >
        {/* Rings — each animated at different speeds/phases */}
        {[
          { size: 340,  duration: 18, opacity: 0.12, delay: 0,    color: 'rgba(164, 230, 255, 1)' },
          { size: 520,  duration: 28, opacity: 0.08, delay: -4,   color: 'rgba(0, 209, 255, 1)' },
          { size: 720,  duration: 40, opacity: 0.06, delay: -10,  color: 'rgba(164, 230, 255, 1)' },
          { size: 940,  duration: 55, opacity: 0.04, delay: -18,  color: 'rgba(76, 214, 255, 1)' },
          { size: 1180, duration: 70, opacity: 0.03, delay: -30,  color: 'rgba(0, 209, 255, 1)' },
          { size: 1440, duration: 90, opacity: 0.025, delay: -40, color: 'rgba(164, 230, 255, 1)' },
        ].map((ring, i) => (
          <motion.div
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: ring.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: ring.delay,
            }}
            style={{
              position: 'absolute',
              width: ring.size,
              height: ring.size,
              top: -ring.size / 2,
              left: -ring.size / 2,
              borderRadius: '50%',
              border: `1px solid ${ring.color}`,
              opacity: ring.opacity,
            }}
          >
            {/* Glowing dot traveling around the ring */}
            <div
              style={{
                position: 'absolute',
                top: -3,
                left: '50%',
                transform: 'translateX(-50%)',
                width: i < 2 ? 6 : 4,
                height: i < 2 ? 6 : 4,
                borderRadius: '50%',
                background: ring.color,
                boxShadow: `0 0 ${i < 2 ? 12 : 8}px ${ring.color}`,
                opacity: i < 3 ? 0.9 : 0.5,
              }}
            />
          </motion.div>
        ))}

        {/* Inner radial glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            top: -300,
            left: -300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(164,230,255,0.04) 0%, rgba(0,209,255,0.02) 40%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Subtle radial gradient vignette to blend into page */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(17,19,24,0.5) 70%, rgba(17,19,24,0.92) 100%)',
        }}
      />
    </div>
  )
}
