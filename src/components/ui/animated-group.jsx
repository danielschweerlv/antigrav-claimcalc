import { motion } from 'framer-motion'
import React from 'react'

const defaultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const defaultItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export function AnimatedGroup({ children, className, variants, preset }) {
  const containerVariants = variants?.container ?? defaultContainerVariants
  const itemVariants = variants?.item ?? defaultItemVariants

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
