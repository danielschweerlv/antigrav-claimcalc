# Admin Dashboard Implementation Plan

**Goal:** Build a protected admin dashboard at `/admin` where Daniel can log in, view incoming leads, update lead statuses, and see conversion stats.

**Architecture:** Admin routes mount as a separate branch in `main.jsx`, outside the public Layout (no Header/Footer/canvas). Supabase JS client handles auth and data. RLS policies (already deployed) restrict data to authenticated admins. `useAuth` hook manages auth state. `ProtectedRoute` guards admin pages.

**Tech Stack:** React 19, Vite 8, Tailwind 3, Supabase JS client (`@supabase/supabase-js`), `date-fns`, `react-router-dom` 7, `lucide-react`

**Spec:** `docs/superpowers/specs/2026-04-09-backend-admin-design.md`

---

## Pre-requisites (already done)
- [x] `date-fns` installed
- [x] Admin profile seeded for `danielschweer@gmail.com` (super_admin)
- [x] RLS policies deployed
- [x] `log_lead_activity` function deployed

---

## Task 1: Fix Supabase Client — Enable Session Persistence

**Files:**
- Modify: `src/lib/supabase.js`

**Why:** Current client has `persistSession: false`, which means admin login won't survive page refreshes. Admin auth requires persistent sessions stored in localStorage.

**Step 1:** Update `src/lib/supabase.js` — remove the `auth: { persistSession: false }` option so it defaults to `true`:

```js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — see .env.example')
}

export const supabase = createClient(url ?? '', anonKey ?? '')
```

**Step 2:** Verify build still works:
Run: `cd /home/user/workspace/antigrav-claimcalc && npx vite build 2>&1 | tail -5`
Expected: Build succeeds with exit 0

**Step 3:** Commit:
```bash
git add src/lib/supabase.js
git commit -m "fix: enable session persistence for admin auth"
```

---

## Task 2: Create useAuth Hook

**Files:**
- Create: `src/hooks/useAuth.js`

**Step 1:** Create the hook:

```js
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = () => supabase.auth.signOut()

  return { user, loading, signOut }
}
```

**Step 2:** Verify build:
Run: `npx vite build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3:** Commit:
```bash
git add src/hooks/useAuth.js
git commit -m "feat: add useAuth hook for admin authentication"
```

---

## Task 3: Create LoginForm Component

**Files:**
- Create: `src/components/auth/LoginForm.jsx`

**Step 1:** Create the login form following Neon Nocturne design system:

```jsx
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
```

**Step 2:** Verify build.
**Step 3:** Commit: `git commit -m "feat: add LoginForm component"`

---

## Task 4: Create ProtectedRoute Component

**Files:**
- Create: `src/components/auth/ProtectedRoute.jsx`

**Step 1:** Create the route guard:

```jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthenticated(!!session)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setAuthenticated(!!session)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111318] flex items-center justify-center">
        <div className="text-[#a4e6ff] font-['Manrope']">Loading...</div>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
```

**Step 2:** Verify build.
**Step 3:** Commit: `git commit -m "feat: add ProtectedRoute component"`

---

## Task 5: Create LeadStatusBadge Component

**Files:**
- Create: `src/components/admin/LeadStatusBadge.jsx`

**Step 1:** Create the status badge:

```jsx
const statusConfig = {
  new: { label: 'New', color: '#a4e6ff', bg: 'rgba(164, 230, 255, 0.15)' },
  contacted: { label: 'Contacted', color: '#bbc9cf', bg: 'rgba(187, 201, 207, 0.15)' },
  qualified: { label: 'Qualified', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)' },
  sent_to_attorney: { label: 'Sent', color: '#a4e6ff', bg: 'rgba(164, 230, 255, 0.15)' },
  converted: { label: 'Converted', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)' },
  rejected: { label: 'Rejected', color: '#ffb4ab', bg: 'rgba(255, 180, 171, 0.15)' },
  lost: { label: 'Lost', color: '#ffb4ab', bg: 'rgba(255, 180, 171, 0.15)' },
}

export function LeadStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.new

  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-['Inter'] font-medium"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  )
}
```

**Step 2:** Verify build.
**Step 3:** Commit: `git commit -m "feat: add LeadStatusBadge component"`

---

## Task 6: Create ActivityLog Component

**Files:**
- Create: `src/components/admin/ActivityLog.jsx`

**Step 1:** Create the activity log:

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'

const actionLabels = {
  created: 'Lead submitted',
  viewed: 'Lead viewed',
  status_changed: 'Status changed',
  note_added: 'Note added',
  exported: 'Lead exported',
  sent_to_attorney: 'Sent to attorney',
  attorney_response: 'Attorney responded',
}

export function ActivityLog({ leadId }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [leadId])

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('lead_activity')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error) {
      setActivities(data || [])
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-[#bbc9cf] text-sm font-['Manrope']">Loading...</div>
  }

  if (activities.length === 0) {
    return <div className="text-[#bbc9cf] text-sm font-['Manrope']">No activity yet</div>
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="text-sm">
          <div className="text-[#e2e2e8] font-['Manrope']">
            {actionLabels[activity.action] || activity.action}
          </div>
          {activity.details?.from && activity.details?.to && (
            <div className="text-[#bbc9cf] font-['Manrope']">
              {activity.details.from} → {activity.details.to}
            </div>
          )}
          <div className="text-[#bbc9cf] text-xs font-['Manrope']">
            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Step 2:** Verify build.
**Step 3:** Commit: `git commit -m "feat: add ActivityLog component"`

---

## Task 7: Create AdminLayout Component

**Files:**
- Create: `src/components/admin/AdminLayout.jsx`

**Step 1:** Create the sidebar layout:

```jsx
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout({ children }) {
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-[#111318] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D0D0D] border-r border-[#333539] flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-[#333539]">
          <h1 className="text-[#a4e6ff] font-bold text-xl font-['Space_Grotesk']">
            ClaimCalc Admin
          </h1>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                  transition-colors font-['Manrope']
                  ${isActive
                    ? 'bg-[#333539] text-[#a4e6ff]'
                    : 'text-[#bbc9cf] hover:bg-[#1e2024] hover:text-[#e2e2e8]'
                  }
                `}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#333539]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full
                       text-[#bbc9cf] hover:bg-[#1e2024] hover:text-[#e2e2e8]
                       transition-colors font-['Manrope']"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

**Step 2:** Verify build.
**Step 3:** Commit: `git commit -m "feat: add AdminLayout with sidebar navigation"`

---

## Task 8: Create Dashboard Component

**Files:**
- Create: `src/components/admin/Dashboard.jsx`

**Step 1:** Create the stats dashboard:

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react'
import { LeadStatusBadge } from './LeadStatusBadge'
import { formatDistanceToNow } from 'date-fns'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    convertedLeads: 0,
    revenue: 0,
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchRecentLeads()
  }, [])

  const fetchStats = async () => {
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const { count: newLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo.toISOString())

    const { count: qualifiedLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .in('status', ['qualified', 'sent_to_attorney', 'converted'])

    const { count: convertedLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'converted')

    setStats({
      totalLeads: totalLeads || 0,
      newLeads: newLeads || 0,
      qualifiedLeads: qualifiedLeads || 0,
      convertedLeads: convertedLeads || 0,
      revenue: (convertedLeads || 0) * 2000,
    })
  }

  const fetchRecentLeads = async () => {
    const { data } = await supabase
      .from('leads')
      .select('id, contact_name, case_type, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    setRecentLeads(data || [])
    setLoading(false)
  }

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: '#a4e6ff' },
    { label: 'New (7 days)', value: stats.newLeads, icon: Clock, color: '#a4e6ff' },
    { label: 'Qualified', value: stats.qualifiedLeads, icon: TrendingUp, color: '#4ADE80' },
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: '#4ADE80' },
  ]

  const formatCaseType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-6">
        Dashboard
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-[#1e2024] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#bbc9cf] text-sm font-['Inter']">
                  {stat.label}
                </span>
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <div
                className="text-3xl font-bold font-['Space_Grotesk']"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent leads */}
      <div className="bg-[#1e2024] rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk']">
            Recent Leads
          </h2>
          <Link
            to="/admin/leads"
            className="text-[#a4e6ff] text-sm hover:underline font-['Manrope']"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="text-[#bbc9cf] font-['Manrope']">Loading...</div>
        ) : recentLeads.length === 0 ? (
          <div className="text-[#bbc9cf] text-center py-8 font-['Manrope']">
            No leads yet. They will appear here when someone completes the calculator.
          </div>
        ) : (
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                to={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between p-3 rounded-lg
                           hover:bg-[#333539]/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[#e2e2e8] font-['Manrope']">
                      {lead.contact_name}
                    </div>
                    <div className="text-[#bbc9cf] text-sm font-['Manrope']">
                      {formatCaseType(lead.case_type)}
                    </div>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </div>
                <div className="text-[#bbc9cf] text-sm font-['Manrope']">
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Step 2:** Verify build.
**Step 3:** Commit: `git commit -m "feat: add Dashboard with stats and recent leads"`

---

## Task 9: Create LeadList Component

**Files:**
- Create: `src/components/admin/LeadList.jsx`

**Step 1:** Create the filterable lead table:

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LeadStatusBadge } from './LeadStatusBadge'
import { formatDistanceToNow } from 'date-fns'

export function LeadList() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchLeads()
  }, [filter])

  const fetchLeads = async () => {
    setLoading(true)

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching leads:', error)
    } else {
      setLeads(data || [])
    }

    setLoading(false)
  }

  const formatCaseType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const formatEstimate = (low, high) => {
    if (!low && !high) return '—'
    if (low && high) return `$${low.toLocaleString()} – $${high.toLocaleString()}`
    return `$${(low || high)?.toLocaleString()}`
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#e2e2e8] font-['Space_Grotesk']">
          Leads
        </h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#333539] text-[#e2e2e8] px-4 py-2 rounded-lg
                     border border-[#333539] font-['Manrope']"
        >
          <option value="all">All Leads</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="sent_to_attorney">Sent to Attorney</option>
          <option value="converted">Converted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="text-[#bbc9cf] font-['Manrope']">Loading...</div>
      ) : leads.length === 0 ? (
        <div className="text-[#bbc9cf] text-center py-12 font-['Manrope']">
          No leads found
        </div>
      ) : (
        <div className="bg-[#1e2024] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333539]">
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Contact</th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Case Type</th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Estimate</th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Status</th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-[#333539] hover:bg-[#333539]/30
                             transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    <Link to={`/admin/leads/${lead.id}`} className="block">
                      <div className="text-[#e2e2e8] font-['Manrope']">
                        {lead.contact_name}
                      </div>
                      <div className="text-[#bbc9cf] text-sm">
                        {lead.contact_email}
                      </div>
                      {lead.contact_phone && (
                        <div className="text-[#bbc9cf] text-sm">
                          {lead.contact_phone}
                        </div>
                      )}
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link to={`/admin/leads/${lead.id}`} className="block">
                      <div className="text-[#e2e2e8] font-['Manrope']">
                        {formatCaseType(lead.case_type)}
                      </div>
                      <div className="text-[#bbc9cf] text-sm">
                        {lead.zip_code || 'No ZIP'}
                      </div>
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link to={`/admin/leads/${lead.id}`} className="block">
                      <div className="text-[#a4e6ff] font-['Manrope'] font-medium">
                        {formatEstimate(lead.estimated_value_low, lead.estimated_value_high)}
                      </div>
                      {lead.has_lawyer && (
                        <div className="text-[#ffb4ab] text-sm">
                          Has lawyer
                        </div>
                      )}
                    </Link>
                  </td>
                  <td className="p-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="p-4 text-[#bbc9cf] text-sm font-['Manrope']">
                    {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

**Step 2:** Verify build.
**Step 3:** Commit: `git commit -m "feat: add LeadList with status filtering"`

---

## Task 10: Create LeadDetail Component

**Files:**
- Create: `src/components/admin/LeadDetail.jsx`

**Step 1:** Create the lead detail view with actions and activity:

```jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LeadStatusBadge } from './LeadStatusBadge'
import { ActivityLog } from './ActivityLog'
import { format } from 'date-fns'
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react'

export function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (id) {
      fetchLead()
      logView()
    }
  }, [id])

  const fetchLead = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching lead:', error)
    } else {
      setLead(data)
    }
    setLoading(false)
  }

  const logView = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    await supabase.from('lead_activity').insert({
      lead_id: id,
      action: 'viewed',
      performed_by: session?.user?.id ?? null,
      details: {},
    })
  }

  const updateStatus = async (newStatus) => {
    setUpdating(true)

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      const { data: { session } } = await supabase.auth.getSession()
      await supabase.from('lead_activity').insert({
        lead_id: id,
        action: 'status_changed',
        performed_by: session?.user?.id ?? null,
        details: { from: lead.status, to: newStatus },
      })

      setLead({ ...lead, status: newStatus })
    }

    setUpdating(false)
  }

  if (loading) {
    return <div className="text-[#bbc9cf] font-['Manrope']">Loading...</div>
  }

  if (!lead) {
    return <div className="text-[#bbc9cf] font-['Manrope']">Lead not found</div>
  }

  const formatCaseType = (type) =>
    type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/leads')}
          className="p-2 rounded-lg bg-[#333539] text-[#bbc9cf]
                     hover:bg-[#1e2024] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#e2e2e8] font-['Space_Grotesk']">
            {lead.contact_name}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <LeadStatusBadge status={lead.status} />
            <span className="text-[#bbc9cf] text-sm font-['Manrope']">
              Submitted {format(new Date(lead.created_at), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact card */}
          <div className="bg-[#1e2024] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-[#e2e2e8] font-['Manrope']">
                <Mail size={18} className="text-[#a4e6ff] flex-shrink-0" />
                <a href={`mailto:${lead.contact_email}`} className="hover:text-[#a4e6ff] truncate">
                  {lead.contact_email}
                </a>
              </div>
              {lead.contact_phone && (
                <div className="flex items-center gap-3 text-[#e2e2e8] font-['Manrope']">
                  <Phone size={18} className="text-[#a4e6ff] flex-shrink-0" />
                  <a href={`tel:${lead.contact_phone}`} className="hover:text-[#a4e6ff]">
                    {lead.contact_phone}
                  </a>
                </div>
              )}
              {lead.zip_code && (
                <div className="flex items-center gap-3 text-[#e2e2e8] font-['Manrope']">
                  <MapPin size={18} className="text-[#a4e6ff] flex-shrink-0" />
                  {lead.zip_code}
                </div>
              )}
              {lead.accident_date && (
                <div className="flex items-center gap-3 text-[#e2e2e8] font-['Manrope']">
                  <Calendar size={18} className="text-[#a4e6ff] flex-shrink-0" />
                  Accident: {format(new Date(lead.accident_date), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>

          {/* Case details card */}
          <div className="bg-[#1e2024] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-4">
              Case Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[#bbc9cf] text-sm mb-1 font-['Inter']">Case Type</div>
                <div className="text-[#e2e2e8] font-['Manrope']">
                  {formatCaseType(lead.case_type)}
                </div>
              </div>
              {lead.accident_type && (
                <div>
                  <div className="text-[#bbc9cf] text-sm mb-1 font-['Inter']">Accident Type</div>
                  <div className="text-[#e2e2e8] font-['Manrope']">{lead.accident_type}</div>
                </div>
              )}
              {lead.fault_status && (
                <div>
                  <div className="text-[#bbc9cf] text-sm mb-1 font-['Inter']">Fault Status</div>
                  <div className="text-[#e2e2e8] font-['Manrope']">
                    {formatCaseType(lead.fault_status)}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[#bbc9cf] text-sm mb-1 font-['Inter']">Has Lawyer</div>
                <div className={lead.has_lawyer ? 'text-[#ffb4ab] font-[\'Manrope\']' : 'text-[#4ADE80] font-[\'Manrope\']'}>
                  {lead.has_lawyer ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {lead.injury_types && Array.isArray(lead.injury_types) && lead.injury_types.length > 0 && (
              <div className="mb-4">
                <div className="text-[#bbc9cf] text-sm mb-2 font-['Inter']">Injuries</div>
                <div className="flex flex-wrap gap-2">
                  {lead.injury_types.map((injury, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#333539] rounded-full text-[#e2e2e8] text-sm font-['Manrope']"
                    >
                      {injury}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {lead.case_description && (
              <div>
                <div className="text-[#bbc9cf] text-sm mb-2 font-['Inter']">Description</div>
                <div className="text-[#e2e2e8] bg-[#333539] rounded-lg p-4 font-['Manrope']">
                  {lead.case_description}
                </div>
              </div>
            )}
          </div>

          {/* Estimate card */}
          <div className="bg-[#1e2024] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-4">
              Estimate
            </h2>
            <div className="text-3xl font-bold text-[#a4e6ff] font-['Space_Grotesk']">
              ${lead.estimated_value_low?.toLocaleString() || '—'}
              {lead.estimated_value_high ? ` – $${lead.estimated_value_high.toLocaleString()}` : ''}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions card */}
          <div className="bg-[#1e2024] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              {lead.status === 'new' && (
                <button
                  onClick={() => updateStatus('contacted')}
                  disabled={updating}
                  className="w-full py-2 px-4 bg-[#333539] text-[#e2e2e8] rounded-lg
                             hover:bg-[#a4e6ff] hover:text-[#111318] transition-colors
                             disabled:opacity-50 font-['Manrope']"
                >
                  Mark as Contacted
                </button>
              )}
              {(lead.status === 'new' || lead.status === 'contacted') && (
                <button
                  onClick={() => updateStatus('qualified')}
                  disabled={updating}
                  className="w-full py-2 px-4 bg-[#4ADE80] text-[#111318] rounded-lg
                             hover:bg-[#4ADE80]/80 transition-colors
                             disabled:opacity-50 font-medium font-['Manrope']"
                >
                  Mark as Qualified
                </button>
              )}
              {lead.status === 'qualified' && (
                <button
                  onClick={() => updateStatus('sent_to_attorney')}
                  disabled={updating}
                  className="w-full py-2 px-4 bg-[#a4e6ff] text-[#111318] rounded-lg
                             hover:bg-[#a4e6ff]/80 transition-colors
                             disabled:opacity-50 font-medium font-['Manrope']"
                >
                  Send to Attorney
                </button>
              )}
              {lead.status === 'sent_to_attorney' && (
                <button
                  onClick={() => updateStatus('converted')}
                  disabled={updating}
                  className="w-full py-2 px-4 bg-[#4ADE80] text-[#111318] rounded-lg
                             hover:bg-[#4ADE80]/80 transition-colors
                             disabled:opacity-50 font-medium font-['Manrope']"
                >
                  Mark as Converted ($2,000)
                </button>
              )}
              {!['rejected', 'lost', 'converted'].includes(lead.status) && (
                <button
                  onClick={() => updateStatus('rejected')}
                  disabled={updating}
                  className="w-full py-2 px-4 bg-[#333539] text-[#ffb4ab] rounded-lg
                             hover:bg-[#ffb4ab]/20 transition-colors
                             disabled:opacity-50 font-['Manrope']"
                >
                  Reject Lead
                </button>
              )}
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-[#1e2024] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-4">
              Activity
            </h2>
            <ActivityLog leadId={lead.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 2:** Verify build.
**Step 3:** Commit: `git commit -m "feat: add LeadDetail with status actions and activity log"`

---

## Task 11: Wire Admin Routes into main.jsx

**Files:**
- Modify: `src/main.jsx`

**Step 1:** Add admin route branch outside the public Layout. Add lazy imports for admin components and a separate route tree that does NOT include the Header/Footer/CanvasRevealEffect.

The key change: wrap admin routes in their own `<Routes>` tree with `ProtectedRoute` and `AdminLayout`, separate from the public `Layout` component.

See implementation details below — the full `main.jsx` replaces the existing file.

**Step 2:** Verify build:
Run: `npx vite build 2>&1 | tail -10`
Expected: Build succeeds

**Step 3:** Commit:
```bash
git add src/main.jsx
git commit -m "feat: wire admin routes into main.jsx"
```

---

## Task 12: Full Build Verification & Push

**Step 1:** Run full build:
```bash
npx vite build
```
Expected: Build succeeds with exit 0, no errors

**Step 2:** Verify all files exist:
```bash
ls -la src/hooks/useAuth.js
ls -la src/components/auth/LoginForm.jsx src/components/auth/ProtectedRoute.jsx
ls -la src/components/admin/AdminLayout.jsx src/components/admin/Dashboard.jsx
ls -la src/components/admin/LeadList.jsx src/components/admin/LeadDetail.jsx
ls -la src/components/admin/LeadStatusBadge.jsx src/components/admin/ActivityLog.jsx
```

**Step 3:** Create feature branch and push:
```bash
git checkout -b feat/admin-dashboard
git push origin feat/admin-dashboard
```

**Step 4:** Create PR to main.
