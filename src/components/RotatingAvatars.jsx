import { useState, useRef, useEffect } from 'react'

const AVATAR_POOL = [
  'https://randomuser.me/api/portraits/thumb/men/89.jpg',
  'https://randomuser.me/api/portraits/thumb/women/82.jpg',
  'https://randomuser.me/api/portraits/thumb/men/49.jpg',
  'https://randomuser.me/api/portraits/thumb/men/72.jpg',
  'https://randomuser.me/api/portraits/thumb/women/75.jpg',
  'https://randomuser.me/api/portraits/thumb/women/56.jpg',
  'https://randomuser.me/api/portraits/thumb/women/92.jpg',
  'https://randomuser.me/api/portraits/thumb/women/78.jpg',
  'https://randomuser.me/api/portraits/thumb/men/12.jpg',
  'https://randomuser.me/api/portraits/thumb/women/93.jpg',
  'https://randomuser.me/api/portraits/thumb/men/10.jpg',
  'https://randomuser.me/api/portraits/thumb/women/22.jpg',
  'https://randomuser.me/api/portraits/thumb/men/58.jpg',
  'https://randomuser.me/api/portraits/thumb/men/33.jpg',
  'https://randomuser.me/api/portraits/thumb/men/63.jpg',
  'https://randomuser.me/api/portraits/thumb/women/94.jpg',
  'https://randomuser.me/api/portraits/thumb/men/87.jpg',
  'https://randomuser.me/api/portraits/thumb/men/53.jpg',
  'https://randomuser.me/api/portraits/thumb/men/25.jpg',
  'https://randomuser.me/api/portraits/thumb/women/51.jpg',
  'https://randomuser.me/api/portraits/thumb/men/5.jpg',
  'https://randomuser.me/api/portraits/thumb/men/82.jpg',
  'https://randomuser.me/api/portraits/thumb/men/22.jpg',
  'https://randomuser.me/api/portraits/thumb/men/86.jpg',
  'https://randomuser.me/api/portraits/thumb/women/66.jpg',
  'https://randomuser.me/api/portraits/thumb/women/44.jpg',
  'https://randomuser.me/api/portraits/thumb/women/28.jpg',
  'https://randomuser.me/api/portraits/thumb/women/58.jpg',
  'https://randomuser.me/api/portraits/thumb/men/29.jpg',
  'https://randomuser.me/api/portraits/thumb/men/75.jpg',
]

const STAGGER_MS = 180
const FADE_MS    = 400
const INTERVAL   = 5000

export default function RotatingAvatars() {
  const [slots, setSlots] = useState([0, 1, 2])
  const [fadingSlot, setFadingSlot] = useState(null)
  const offsetRef = useRef(3)
  const swapQueue = useRef([])
  const swapping  = useRef(false)

  const swapNext = () => {
    if (swapQueue.current.length === 0) { swapping.current = false; return }
    swapping.current = true
    const { slotIdx, newPoolIdx } = swapQueue.current.shift()
    setFadingSlot(slotIdx)
    setTimeout(() => {
      setSlots(prev => { const s = [...prev]; s[slotIdx] = newPoolIdx; return s })
      setFadingSlot(null)
      setTimeout(swapNext, STAGGER_MS)
    }, FADE_MS)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      swapQueue.current = [0, 1, 2].map(slotIdx => {
        const newPoolIdx = offsetRef.current % AVATAR_POOL.length
        offsetRef.current += 1
        return { slotIdx, newPoolIdx }
      })
      if (!swapping.current) swapNext()
    }, INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex -space-x-2.5">
      {slots.map((poolIdx, slot) => (
        <img
          key={`${slot}-${poolIdx}`}
          className="w-9 h-9 rounded-full border-2 border-[#111318] object-cover"
          style={{
            opacity: fadingSlot === slot ? 0 : 1,
            transform: fadingSlot === slot ? 'scale(0.85)' : 'scale(1)',
            transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
          }}
          src={AVATAR_POOL[poolIdx]}
          alt={`user ${slot + 1}`}
        />
      ))}
    </div>
  )
}
