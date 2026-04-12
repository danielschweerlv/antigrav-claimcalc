import { useEffect, useRef } from 'react'
import { useSpring, useTransform, motion, useInView } from 'framer-motion'

export function AnimatedCounter({
  value = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.5,
  className = '',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
    duration: duration * 1000,
  })

  const display = useTransform(spring, (current) => {
    const num = decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString()
    return `${prefix}${num}${suffix}`
  })

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, value, spring])

  return (
    <motion.span
      ref={ref}
      className={`font-['Space_Grotesk'] font-bold tabular-nums ${className}`}
    >
      {display}
    </motion.span>
  )
}
