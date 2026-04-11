import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#111318] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#a4e6ff] font-['Space_Grotesk']">
            ClaimCalc Admin
          </h1>
          <p className="text-[#bbc9cf] mt-2 font-['Manrope']">Sign in to manage leads</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e2024] rounded-xl p-8">
          {error && (
            <div className="bg-[#ffb4ab]/20 text-[#ffb4ab] px-4 py-3 rounded-lg mb-4 text-sm font-['Manrope']">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[#bbc9cf] text-sm mb-2 font-['Inter']">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#333539] text-[#e2e2e8] px-4 py-3 rounded-lg
                         border border-[#333539] focus:border-[#a4e6ff]
                         focus:outline-none transition-colors font-['Manrope']"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#bbc9cf] text-sm mb-2 font-['Inter']">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#333539] text-[#e2e2e8] px-4 py-3 rounded-lg
                         border border-[#333539] focus:border-[#a4e6ff]
                         focus:outline-none transition-colors font-['Manrope']"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#a4e6ff] to-[#00d1ff]
                       text-[#111318] font-bold rounded-lg hover:opacity-90
                       transition-opacity disabled:opacity-50 font-['Space_Grotesk']"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
