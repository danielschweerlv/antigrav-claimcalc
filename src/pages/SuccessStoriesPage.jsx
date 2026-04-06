import React from 'react'
import SuccessStoriesSection from '../components/SuccessStoriesSection'

export default function SuccessStoriesPage() {
  return (
    <div className="relative min-h-screen bg-transparent pt-[58px]">
      <main className="relative z-10">
        <SuccessStoriesSection standalone />
      </main>
    </div>
  )
}
