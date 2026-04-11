# Backend & Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase-backed lead capture from the calculator form and a protected admin dashboard for managing leads.

**Architecture:** Supabase Direct — React talks to Supabase via the JS client, no server-side API. RLS policies authorize access: anonymous users can insert leads, authenticated admins can read/update everything. Admin pages live outside the public Layout in `main.jsx`.

**Tech Stack:** React 19, Vite 8, Tailwind 3, Supabase JS client, date-fns, react-router-dom 7

**Spec:** `docs/superpowers/specs/2026-04-09-backend-admin-design.md`

---

## File Map

### New Files
| File | Responsibility |
|---|---|
| `supabase/schema.sql` | Database schema — user runs in Supabase SQL Editor |
| `.env.example` | Template for required environment variables |
| `src/lib/supabase.js` | Supabase client initialization (singleton) |
| `src/lib/submitLead.js` | Maps calculator form data to DB columns, inserts lead |
| `src/hooks/useAuth.js` | React hook for auth state (user, loading, signOut) |
| `src/components/auth/LoginForm.jsx` | Admin login page |
| `src/components/auth/ProtectedRoute.jsx` | Route guard — redirects to login if unauthenticated |
| `src/components/admin/AdminLayout.jsx` | Sidebar + main content shell |
| `src/components/admin/Dashboard.jsx` | Stats overview + recent leads |
| `src/components/admin/LeadList.jsx` | Filterable lead table |
| `src/components/admin/LeadDetail.jsx` | Single lead view + status actions + activity log |
| `src/components/admin/LeadStatusBadge.jsx` | Color-coded status pill |
| `src/components/admin/ActivityLog.jsx` | Activity timeline for a lead |

### Modified Files
| File | Change |
|---|---|
| `.gitignore` | Add `.env`, `.superpowers/` |
| `src/main.jsx` | Add admin route branch outside public Layout |
| `src/components/CalculatorForm.jsx` | Call `submitLead()` in `showResult` function |

---

## Task 1: Project setup — dependencies, env, gitignore

**Files:**
- Modify: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/daniel/Desktop/antigrav-claimcalc/antigrav-claimcalc
npm install @supabase/supabase-js date-fns
```

Expected: packages added to `package.json` dependencies, `node_modules` updated.

- [ ] **Step 2: Create `.env.example`**

Create `.env.example` at the project root:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- [ ] **Step 3: Update `.gitignore`**

Add these lines to the end of `.gitignore`:

```
# Environment variables
.env

# Superpowers brainstorm artifacts
.superpowers/
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .env.example .gitignore
git commit -m "add supabase and date-fns dependencies, env template"
```

---

## Task 2: Database schema SQL file

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Create `supabase/schema.sql`**

```sql
-- ClaimCalculator.ai Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM types
CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'sent_to_attorney',
  'converted',
  'rejected',
  'lost'
);

CREATE TYPE case_type AS ENUM (
  'motor_vehicle',
  'premises_liability',
  'work_injury',
  'product_liability',
  'other'
);

CREATE TYPE fault_status AS ENUM (
  'not_at_fault',
  'partial_fault',
  'at_fault',
  'unknown'
);

CREATE TYPE activity_type AS ENUM (
  'created',
  'viewed',
  'status_changed',
  'note_added',
  'exported',
  'sent_to_attorney',
  'attorney_response'
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Status
  status lead_status DEFAULT 'new',

  -- Case info from calculator
  case_type case_type NOT NULL,
  accident_type TEXT,
  injury_types JSONB DEFAULT '[]'::jsonb,
  fault_status fault_status DEFAULT 'unknown',

  -- Motor vehicle specific
  ev_involved BOOLEAN DEFAULT FALSE,
  commercial_vehicle BOOLEAN DEFAULT FALSE,

  -- Premises liability specific
  report_filed JSONB DEFAULT '[]'::jsonb,
  cameras_witnesses BOOLEAN,
  surface_conditions TEXT,
  lighting_conditions TEXT,

  -- Timing
  accident_date DATE,
  accident_timeframe TEXT,

  -- Insurance
  has_own_insurance BOOLEAN,
  own_insurance_company TEXT,
  other_party_insurance TEXT,
  adjuster_contacted BOOLEAN,

  -- Legal
  has_lawyer BOOLEAN DEFAULT FALSE,
  case_description TEXT,

  -- Contact info
  zip_code TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,

  -- Estimate
  estimated_value_low INTEGER,
  estimated_value_high INTEGER,

  -- Attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,

  -- Internal
  notes TEXT,
  priority INTEGER DEFAULT 0
);

-- Lead activity log
CREATE TABLE lead_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  action activity_type NOT NULL,
  performed_by UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users (uses Supabase Auth, this is for profile data)
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_case_type ON leads(case_type);
CREATE INDEX idx_leads_zip ON leads(zip_code);
CREATE INDEX idx_lead_activity_lead_id ON lead_activity(lead_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated admins get full access
CREATE POLICY "Admins can do everything with leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything with lead_activity"
  ON lead_activity FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read own profile"
  ON admin_profiles FOR ALL
  USING (auth.uid() = id);

-- Allow anonymous inserts for lead capture (public calculator)
CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Function to log lead activity
CREATE OR REPLACE FUNCTION log_lead_activity(
  p_lead_id UUID,
  p_action activity_type,
  p_details JSONB DEFAULT '{}'::jsonb,
  p_performed_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO lead_activity (lead_id, action, details, performed_by)
  VALUES (p_lead_id, p_action, p_details, p_performed_by)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/schema.sql
git commit -m "add database schema for leads, activity log, admin profiles"
```

---

## Task 3: Supabase client

**Files:**
- Create: `src/lib/supabase.js`

- [ ] **Step 1: Create `src/lib/supabase.js`**

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Graceful degradation: if env vars are missing, supabase will be null
// and submitLead will no-op. The calculator still works for end users.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase.js
git commit -m "add Supabase client with graceful degradation"
```

---

## Task 4: Lead submission function

**Files:**
- Create: `src/lib/submitLead.js`

- [ ] **Step 1: Create `src/lib/submitLead.js`**

```js
import { supabase } from './supabase'

const CASE_TYPE_MAP = {
  'Motor Vehicle Accident': 'motor_vehicle',
  'Premises Liability/Slip and Fall': 'premises_liability',
  'Work-Related Injury': 'work_injury',
  'Product Liability': 'product_liability',
  'Other': 'other',
}

const FAULT_MAP = {
  'Not my fault': 'not_at_fault',
  'Mostly other driver': 'partial_fault',
  'Shared / unclear': 'partial_fault',
  'Mostly me': 'at_fault',
}

/**
 * Submit a lead to Supabase from calculator form data.
 * Non-blocking — errors are logged but never surface to the user.
 *
 * @param {object} formData - The calculator form state object
 * @param {object} estimate - The result of calcSettlement(formData)
 */
export async function submitLead(formData, estimate) {
  if (!supabase) return // graceful degradation if env vars missing

  try {
    const urlParams = new URLSearchParams(window.location.search)
    const isMotorVehicle = formData.caseType === 'Motor Vehicle Accident'

    // Map fault status
    let faultStatus = 'unknown'
    if (isMotorVehicle) {
      faultStatus = FAULT_MAP[formData.fault] || 'unknown'
    } else {
      faultStatus = formData.faultAtFault === 'Yes' ? 'at_fault' : formData.faultAtFault === 'No' ? 'not_at_fault' : 'unknown'
    }

    const leadData = {
      // Case info
      case_type: CASE_TYPE_MAP[formData.caseType] || 'other',
      accident_type: formData.type || null,
      injury_types: formData.injuries || [],
      fault_status: faultStatus,

      // Motor vehicle specific
      ev_involved: formData.evInvolved === 'Yes',
      commercial_vehicle: formData.commercialVehicle === 'Yes',

      // Premises liability specific
      report_filed: formData.reportedTo || [],
      cameras_witnesses: formData.cameras === 'Yes' || formData.witnesses === 'Yes',
      surface_conditions: formData.surface || null,
      lighting_conditions: formData.lighting || null,

      // Timing
      accident_timeframe: formData.when || null,

      // Insurance
      has_own_insurance: formData.myInsurer !== 'I Have No Insurance' && !!formData.myInsurer,
      own_insurance_company: formData.myInsurer || null,
      other_party_insurance: formData.otherInsurer || null,
      adjuster_contacted: formData.adjuster === 'Yes',

      // Legal
      has_lawyer: formData.hiredLawyer === 'Yes',
      case_description: formData.description || null,

      // Contact
      zip_code: formData.zip || null,
      contact_name: `${formData.firstName} ${formData.lastName}`.trim(),
      contact_email: formData.email,
      contact_phone: formData.phone || null,

      // Estimate
      estimated_value_low: estimate.withLow || null,
      estimated_value_high: estimate.withHigh || null,

      // Attribution
      utm_source: urlParams.get('utm_source') || null,
      utm_medium: urlParams.get('utm_medium') || null,
      utm_campaign: urlParams.get('utm_campaign') || null,
      referrer: document.referrer || null,
    }

    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()

    if (error) {
      console.error('Error submitting lead:', error)
      return
    }

    // Log the creation activity
    await supabase.rpc('log_lead_activity', {
      p_lead_id: data.id,
      p_action: 'created',
      p_details: { source: 'calculator' },
    })
  } catch (err) {
    console.error('Error submitting lead:', err)
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/submitLead.js
git commit -m "add lead submission function with form-to-DB mapping"
```

---

## Task 5: Integrate lead submission into calculator form

**Files:**
- Modify: `src/components/CalculatorForm.jsx:1-3` (imports) and `src/components/CalculatorForm.jsx:653-663` (showResult function)

- [ ] **Step 1: Add import at top of `CalculatorForm.jsx`**

Add this import after the existing imports (after line 2):

```js
import { submitLead } from '../lib/submitLead'
```

- [ ] **Step 2: Modify the `showResult` function (line 653)**

Replace the existing `showResult` function:

```js
  const showResult = () => {
    setContactTouched({ firstName: true, lastName: true, email: true, phone: true })
    if (!contactComplete) return
    setDirection(1)
    setStepIndex(-1)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
    }, 2200)
  }
```

With:

```js
  const showResult = () => {
    setContactTouched({ firstName: true, lastName: true, email: true, phone: true })
    if (!contactComplete) return
    setDirection(1)
    setStepIndex(-1)
    setLoading(true)

    // Submit lead to Supabase (non-blocking, fire-and-forget)
    submitLead(data, calcSettlement(data))

    setTimeout(() => {
      setLoading(false)
      setDone(true)
    }, 2200)
  }
```

- [ ] **Step 3: Verify the app builds**

```bash
cd /Users/daniel/Desktop/antigrav-claimcalc/antigrav-claimcalc
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/CalculatorForm.jsx
git commit -m "integrate lead submission into calculator form"
```

---

## Task 6: Auth hook

**Files:**
- Create: `src/hooks/useAuth.js`

- [ ] **Step 1: Create `src/hooks/useAuth.js`**

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = () => supabase?.auth.signOut()

  return { user, loading, signOut }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useAuth.js
git commit -m "add useAuth hook for Supabase auth state"
```

---

## Task 7: ProtectedRoute and LoginForm

**Files:**
- Create: `src/components/auth/ProtectedRoute.jsx`
- Create: `src/components/auth/LoginForm.jsx`

- [ ] **Step 1: Create `src/components/auth/ProtectedRoute.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111318] flex items-center justify-center">
        <div className="text-[#a4e6ff]">Loading...</div>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
```

- [ ] **Step 2: Create `src/components/auth/LoginForm.jsx`**

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

    if (!supabase) {
      setError('Supabase is not configured. Check environment variables.')
      setLoading(false)
      return
    }

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
            ClaimCalculator Admin
          </h1>
          <p className="text-[#bbc9cf] mt-2">Sign in to manage leads</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e2024] rounded-xl p-8">
          {error && (
            <div className="bg-[#ffb4ab]/20 text-[#ffb4ab] px-4 py-3 rounded-lg mb-4 text-sm">
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

- [ ] **Step 3: Commit**

```bash
git add src/components/auth/ProtectedRoute.jsx src/components/auth/LoginForm.jsx
git commit -m "add admin login form and protected route guard"
```

---

## Task 8: LeadStatusBadge component

**Files:**
- Create: `src/components/admin/LeadStatusBadge.jsx`

- [ ] **Step 1: Create `src/components/admin/LeadStatusBadge.jsx`**

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

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/LeadStatusBadge.jsx
git commit -m "add LeadStatusBadge component"
```

---

## Task 9: ActivityLog component

**Files:**
- Create: `src/components/admin/ActivityLog.jsx`

- [ ] **Step 1: Create `src/components/admin/ActivityLog.jsx`**

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
    if (!supabase || !leadId) return

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

    fetchActivities()
  }, [leadId])

  if (loading) {
    return <div className="text-[#bbc9cf] text-sm">Loading...</div>
  }

  if (activities.length === 0) {
    return <div className="text-[#bbc9cf] text-sm">No activity yet</div>
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="text-sm">
          <div className="text-[#e2e2e8]">
            {actionLabels[activity.action] || activity.action}
          </div>
          {activity.details?.from && activity.details?.to && (
            <div className="text-[#bbc9cf]">
              {activity.details.from} → {activity.details.to}
            </div>
          )}
          <div className="text-[#bbc9cf] text-xs">
            {formatDistanceToNow(new Date(activity.created_at), {
              addSuffix: true,
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/ActivityLog.jsx
git commit -m "add ActivityLog component"
```

---

## Task 10: AdminLayout component

**Files:**
- Create: `src/components/admin/AdminLayout.jsx`

- [ ] **Step 1: Create `src/components/admin/AdminLayout.jsx`**

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
    await supabase?.auth.signOut()
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
            const isActive =
              item.href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                  transition-colors font-['Manrope']
                  ${
                    isActive
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
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/AdminLayout.jsx
git commit -m "add AdminLayout with sidebar navigation"
```

---

## Task 11: Dashboard component

**Files:**
- Create: `src/components/admin/Dashboard.jsx`

- [ ] **Step 1: Create `src/components/admin/Dashboard.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react'
import { LeadStatusBadge } from './LeadStatusBadge'

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
    if (!supabase) return
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

  const formatCaseType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: '#a4e6ff' },
    { label: 'New (7 days)', value: stats.newLeads, icon: Clock, color: '#a4e6ff' },
    { label: 'Qualified', value: stats.qualifiedLeads, icon: TrendingUp, color: '#4ADE80' },
    {
      label: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: '#4ADE80',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-6">
        Dashboard
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
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
            className="text-[#a4e6ff] text-sm hover:underline"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="text-[#bbc9cf]">Loading...</div>
        ) : recentLeads.length === 0 ? (
          <div className="text-[#bbc9cf] text-center py-8">
            No leads yet. They'll appear here when someone completes the
            calculator.
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
                <div>
                  <div className="text-[#e2e2e8] font-['Manrope']">
                    {lead.contact_name}
                  </div>
                  <div className="text-[#bbc9cf] text-sm">
                    {formatCaseType(lead.case_type)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LeadStatusBadge status={lead.status} />
                  <span className="text-[#bbc9cf] text-sm">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
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

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/Dashboard.jsx
git commit -m "add admin Dashboard with stats and recent leads"
```

---

## Task 12: LeadList component

**Files:**
- Create: `src/components/admin/LeadList.jsx`

- [ ] **Step 1: Create `src/components/admin/LeadList.jsx`**

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
    if (!supabase) return
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
    if (low && high)
      return `$${low.toLocaleString()} - $${high.toLocaleString()}`
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
        <div className="text-[#bbc9cf]">Loading...</div>
      ) : leads.length === 0 ? (
        <div className="text-[#bbc9cf] text-center py-12">No leads found</div>
      ) : (
        <div className="bg-[#1e2024] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333539]">
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">
                  Contact
                </th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">
                  Case Type
                </th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">
                  Estimate
                </th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">
                  Received
                </th>
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
                        {formatEstimate(
                          lead.estimated_value_low,
                          lead.estimated_value_high
                        )}
                      </div>
                      {lead.has_lawyer && (
                        <div className="text-[#ffb4ab] text-sm">Has lawyer</div>
                      )}
                    </Link>
                  </td>
                  <td className="p-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="p-4 text-[#bbc9cf] text-sm font-['Manrope']">
                    {formatDistanceToNow(new Date(lead.created_at), {
                      addSuffix: true,
                    })}
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

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/LeadList.jsx
git commit -m "add LeadList with status filtering and lead table"
```

---

## Task 13: LeadDetail component

**Files:**
- Create: `src/components/admin/LeadDetail.jsx`

- [ ] **Step 1: Create `src/components/admin/LeadDetail.jsx`**

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
    if (!supabase || !id) return
    fetchLead()
    logView()
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
    await supabase.rpc('log_lead_activity', {
      p_lead_id: id,
      p_action: 'viewed',
      p_details: {},
    })
  }

  const updateStatus = async (newStatus) => {
    setUpdating(true)

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      await supabase.rpc('log_lead_activity', {
        p_lead_id: id,
        p_action: 'status_changed',
        p_details: { from: lead.status, to: newStatus },
      })

      setLead({ ...lead, status: newStatus })
    }

    setUpdating(false)
  }

  const formatCaseType = (type) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const formatFaultStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  if (loading) {
    return <div className="text-[#bbc9cf]">Loading...</div>
  }

  if (!lead) {
    return <div className="text-[#bbc9cf]">Lead not found</div>
  }

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
            <span className="text-[#bbc9cf] text-sm">
              Submitted{' '}
              {format(new Date(lead.created_at), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main info — 2/3 */}
        <div className="col-span-2 space-y-6">
          {/* Contact card */}
          <div className="bg-[#1e2024] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-[#e2e2e8]">
                <Mail size={18} className="text-[#a4e6ff]" />
                <a
                  href={`mailto:${lead.contact_email}`}
                  className="hover:text-[#a4e6ff]"
                >
                  {lead.contact_email}
                </a>
              </div>
              {lead.contact_phone && (
                <div className="flex items-center gap-3 text-[#e2e2e8]">
                  <Phone size={18} className="text-[#a4e6ff]" />
                  <a
                    href={`tel:${lead.contact_phone}`}
                    className="hover:text-[#a4e6ff]"
                  >
                    {lead.contact_phone}
                  </a>
                </div>
              )}
              {lead.zip_code && (
                <div className="flex items-center gap-3 text-[#e2e2e8]">
                  <MapPin size={18} className="text-[#a4e6ff]" />
                  {lead.zip_code}
                </div>
              )}
              {lead.accident_date && (
                <div className="flex items-center gap-3 text-[#e2e2e8]">
                  <Calendar size={18} className="text-[#a4e6ff]" />
                  Accident:{' '}
                  {format(new Date(lead.accident_date), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>

          {/* Case details card */}
          <div className="bg-[#1e2024] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-4">
              Case Details
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[#bbc9cf] text-sm mb-1">Case Type</div>
                <div className="text-[#e2e2e8]">
                  {formatCaseType(lead.case_type)}
                </div>
              </div>
              {lead.accident_type && (
                <div>
                  <div className="text-[#bbc9cf] text-sm mb-1">
                    Accident Type
                  </div>
                  <div className="text-[#e2e2e8]">{lead.accident_type}</div>
                </div>
              )}
              <div>
                <div className="text-[#bbc9cf] text-sm mb-1">Fault Status</div>
                <div className="text-[#e2e2e8]">
                  {formatFaultStatus(lead.fault_status)}
                </div>
              </div>
              <div>
                <div className="text-[#bbc9cf] text-sm mb-1">Has Lawyer</div>
                <div
                  className={
                    lead.has_lawyer ? 'text-[#ffb4ab]' : 'text-[#4ADE80]'
                  }
                >
                  {lead.has_lawyer ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {lead.injury_types && lead.injury_types.length > 0 && (
              <div className="mb-4">
                <div className="text-[#bbc9cf] text-sm mb-2">Injuries</div>
                <div className="flex flex-wrap gap-2">
                  {lead.injury_types.map((injury, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#333539] rounded-full text-[#e2e2e8] text-sm"
                    >
                      {injury}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {lead.case_description && (
              <div>
                <div className="text-[#bbc9cf] text-sm mb-2">Description</div>
                <div className="text-[#e2e2e8] bg-[#333539] rounded-lg p-4">
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
              {lead.estimated_value_high &&
                ` - $${lead.estimated_value_high.toLocaleString()}`}
            </div>
          </div>
        </div>

        {/* Sidebar — 1/3 */}
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
                             disabled:opacity-50"
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
                             disabled:opacity-50 font-medium"
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
                             disabled:opacity-50 font-medium"
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
                             disabled:opacity-50 font-medium"
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
                             disabled:opacity-50"
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

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/LeadDetail.jsx
git commit -m "add LeadDetail with status workflow and activity log"
```

---

## Task 14: Wire up admin routes in main.jsx

**Files:**
- Modify: `src/main.jsx`

- [ ] **Step 1: Update `src/main.jsx`**

Replace the entire contents of `src/main.jsx` with:

```jsx
import { StrictMode, useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { CanvasRevealEffect } from './components/ui/canvas-reveal-effect'

// Public pages
const App                 = lazy(() => import('./App.jsx'))
const CalculatorPage      = lazy(() => import('./pages/CalculatorPage.jsx'))
const HowItWorksPage      = lazy(() => import('./pages/HowItWorksPage.jsx'))
const InsuranceTacticsPage = lazy(() => import('./pages/InsuranceTacticsPage.jsx'))
const YourRightsPage      = lazy(() => import('./pages/YourRightsPage.jsx'))
const PrivacyPolicyPage   = lazy(() => import('./pages/PrivacyPolicyPage.jsx'))
const TermsOfServicePage  = lazy(() => import('./pages/TermsOfServicePage.jsx'))
const LegalNoticePage     = lazy(() => import('./pages/LegalNoticePage.jsx'))
const SuccessStoriesPage  = lazy(() => import('./pages/SuccessStoriesPage.jsx'))
const InjuryValuesPage    = lazy(() => import('./pages/InjuryValuesPage.jsx'))
const CaseGuidesPage      = lazy(() => import('./pages/CaseGuidesPage.jsx'))
const CaseGuideDetailPage = lazy(() => import('./pages/CaseGuideDetailPage.jsx'))

// Admin pages
const LoginForm     = lazy(() => import('./components/auth/LoginForm.jsx').then(m => ({ default: m.LoginForm })))
const AdminLayout   = lazy(() => import('./components/admin/AdminLayout.jsx').then(m => ({ default: m.AdminLayout })))
const Dashboard     = lazy(() => import('./components/admin/Dashboard.jsx').then(m => ({ default: m.Dashboard })))
const LeadList      = lazy(() => import('./components/admin/LeadList.jsx').then(m => ({ default: m.LeadList })))
const LeadDetail    = lazy(() => import('./components/admin/LeadDetail.jsx').then(m => ({ default: m.LeadDetail })))
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute.jsx').then(m => ({ default: m.ProtectedRoute })))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#111318]">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-[#111318]"
          colors={[
            [0, 209, 255],
            [99, 102, 241],
          ]}
          dotSize={3}
          reverse={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0%,_#111318_100%)] opacity-80 pointer-events-none" />
      </div>
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Suspense fallback={<div className="min-h-screen bg-[#111318]" />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/insurance-tactics" element={<InsuranceTacticsPage />} />
          <Route path="/your-rights" element={<YourRightsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/legal-notice" element={<LegalNoticePage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/injury-values" element={<InjuryValuesPage />} />
          <Route path="/case-guides" element={<CaseGuidesPage />} />
          <Route path="/case-guides/:slug" element={<CaseGuideDetailPage />} />
        </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}

function AdminRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111318]" />}>
      <Routes>
        <Route path="/admin/login" element={<LoginForm />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout><Dashboard /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute>
              <AdminLayout><LeadList /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads/:id"
          element={
            <ProtectedRoute>
              <AdminLayout><LeadDetail /></AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}

function AppRouter() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return isAdmin ? <AdminRoutes /> : <PublicLayout />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 2: Verify the app builds**

```bash
cd /Users/daniel/Desktop/antigrav-claimcalc/antigrav-claimcalc
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx
git commit -m "add admin route branch with protected dashboard, leads, and login"
```

---

## Task 15: Final build verification and cleanup

- [ ] **Step 1: Verify full build**

```bash
cd /Users/daniel/Desktop/antigrav-claimcalc/antigrav-claimcalc
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server starts, public site loads at `http://localhost:5173`, admin login loads at `http://localhost:5173/admin/login`.

- [ ] **Step 3: Commit any remaining changes**

If any files were missed:

```bash
git status
git add -A
git commit -m "final build verification and cleanup"
```
