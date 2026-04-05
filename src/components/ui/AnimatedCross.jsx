import React, { useEffect, useRef } from 'react'

/**
 * Animated dotted cross/plus icon.
 * Renders an SVG grid of circles in a + shape.
 * Dots randomly "illuminate" — brightening and glowing at staggered intervals.
 */

// Cross layout: 11×11 grid, only cells within the + shape are filled
// The cross arms are 4 dots wide (columns 3-6 for vertical, rows 3-6 for horizontal in 0-indexed from a 10x10)
// Actually, based on the image: the cross is about 11 dots across the arms, 4 dots wide per arm
// Let me map it precisely from the source image:
// Top arm: cols 3-6, rows 0-3    (4 wide, 4 tall)
// Middle: cols 0-9, rows 3-6     (10 wide, 4 tall) - full horizontal band
// Bottom arm: cols 3-6, rows 7-10 (4 wide, 4 tall)

const GRID_SIZE = 11
const DOT_R = 4.2
const GAP = 11.5
const PAD = 6

// Generate cross mask
function isCrossDot(row, col) {
  // Horizontal bar: rows 3–6 (0-indexed from 10), all columns 0–10
  if (row >= 3 && row <= 7 && col >= 0 && col <= 10) return true
  // Vertical bar: cols 3–7, all rows
  if (col >= 3 && col <= 7 && row >= 0 && row <= 10) return true
  return false
}

// Teal color palette from the original image
const COLORS = [
  '#0BA5B5', // deep teal
  '#2DC5D3', // medium teal
  '#5DD8E2', // light teal  
  '#8DE8EE', // lighter teal
  '#B5F0F5', // very light teal
  '#D6F7FA', // near white teal
]

function getBaseColor(row, col) {
  // Gradient from edges (dark teal) to center (light/faded)
  const cx = 5, cy = 5
  const dist = Math.sqrt((row - cy) ** 2 + (col - cx) ** 2)
  const maxDist = 7.07
  const normalised = dist / maxDist
  // Edges are darker, center is lighter
  const idx = Math.min(COLORS.length - 1, Math.floor((1 - normalised) * COLORS.length))
  return COLORS[idx]
}

export default function AnimatedCross({ className = '', size = 48 }) {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const circles = svg.querySelectorAll('circle[data-dot]')
    if (!circles.length) return

    const intervals = []

    circles.forEach((circle) => {
      // Random interval between 1.5s and 5s per dot
      const scheduleGlow = () => {
        const delay = 1500 + Math.random() * 3500
        const timeout = setTimeout(() => {
          // Illuminate: brighten and add glow
          circle.style.transition = 'filter 0.4s ease-in, opacity 0.4s ease-in'
          circle.style.filter = 'drop-shadow(0 0 4px rgba(164, 230, 255, 0.9)) brightness(1.6)'
          circle.style.opacity = '1'

          // Fade back
          setTimeout(() => {
            circle.style.transition = 'filter 0.8s ease-out, opacity 0.8s ease-out'
            circle.style.filter = 'none'
            circle.style.opacity = ''
          }, 400 + Math.random() * 300)

          scheduleGlow() // reschedule
        }, delay)
        intervals.push(timeout)
      }

      // Stagger initial start
      const initDelay = Math.random() * 3000
      const initTimeout = setTimeout(scheduleGlow, initDelay)
      intervals.push(initTimeout)
    })

    return () => intervals.forEach(clearTimeout)
  }, [])

  const dots = []
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!isCrossDot(row, col)) continue
      const cx = PAD + col * GAP + DOT_R
      const cy = PAD + row * GAP + DOT_R
      const fill = getBaseColor(row, col)
      dots.push(
        <circle
          key={`${row}-${col}`}
          data-dot=""
          cx={cx}
          cy={cy}
          r={DOT_R}
          fill={fill}
          style={{ opacity: 0.85 }}
        />
      )
    }
  }

  const viewSize = PAD * 2 + GRID_SIZE * GAP
  return (
    <svg
      ref={svgRef}
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {dots}
    </svg>
  )
}
