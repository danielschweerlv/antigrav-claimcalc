import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { DollarSign, FileText, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCaseType(raw) {
  if (!raw) return '—'
  return raw
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function formatCurrency(cents) {
  if (cents == null || isNaN(cents)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return format(new Date(dateStr), 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

function resolveAmount(row) {
  if (row.payout_amount != null) return row.payout_amount
  if (row.attorney_partners?.price_per_lead != null)
    return row.attorney_partners.price_per_lead
  return 200000
}

// ─── Badges ─────────────────────────────────────────────────────────────────

const PAYOUT_BADGE = {
  unpaid:   'text-[#ffb4ab] bg-[#ffb4ab]/15',
  invoiced: 'text-[#a4e6ff] bg-[#a4e6ff]/15',
  paid:     'text-[#4ADE80] bg-[#4ADE80]/15',
}

const OUTCOME_BADGE = {
  pending:   'text-[#a4e6ff] bg-[#a4e6ff]/15',
  accepted:  'text-[#4ADE80] bg-[#4ADE80]/15',
  rejected:  'text-[#ffb4ab] bg-[#ffb4ab]/15',
  converted: 'text-[#4ADE80] bg-[#4ADE80]/15',
}

function Badge({ value, map }) {
  const cls = map[value] ?? 'text-[#bbc9cf] bg-[#bbc9cf]/15'
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize font-[Inter] ${cls}`}
    >
      {value ?? '—'}
    </span>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-[#333539] bg-[#1e2024] px-5 py-4 flex-1 min-w-0"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${accent}20` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="font-[Inter] text-xs text-[#bbc9cf] uppercase tracking-wide truncate">
          {label}
        </p>
        <p className="font-[Space_Grotesk] text-xl font-semibold text-[#e2e2e8] mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  )
}

// ─── Select ──────────────────────────────────────────────────────────────────

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2">
      <label className="font-[Inter] text-xs text-[#bbc9cf] whitespace-nowrap">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-[#333539] bg-[#1e2024] px-3 py-1.5 font-[Inter] text-sm text-[#e2e2e8] focus:outline-none focus:ring-1 focus:ring-[#a4e6ff]/50 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function PayoutList() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [payoutFilter, setPayoutFilter] = useState('all')
  const [outcomeFilter, setOutcomeFilter] = useState('all')

  const [selectedIds, setSelectedIds] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchAssignments = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('lead_assignments')
      .select(
        '*, leads(contact_name, case_type, status), attorney_partners(name, firm_name, price_per_lead)'
      )
      .order('assigned_at', { ascending: false })

    if (err) {
      setError(err.message)
    } else {
      setAssignments(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  // ── Derived stats ────────────────────────────────────────────────────────

  const totalAssigned = assignments.length
  const unpaidCount = assignments.filter(
    (a) => a.payout_status === 'unpaid'
  ).length
  const invoicedCount = assignments.filter(
    (a) => a.payout_status === 'invoiced'
  ).length
  const totalPaid = assignments
    .filter((a) => a.payout_status === 'paid')
    .reduce((sum, a) => sum + (a.payout_amount ?? 0), 0)

  // ── Filtered rows ────────────────────────────────────────────────────────

  const filtered = assignments.filter((a) => {
    const matchesPayout =
      payoutFilter === 'all' || a.payout_status === payoutFilter
    const matchesOutcome =
      outcomeFilter === 'all' || a.outcome === outcomeFilter
    return matchesPayout && matchesOutcome
  })

  // ── Checkbox helpers ─────────────────────────────────────────────────────

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((a) => selectedIds.includes(a.id))

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filtered.some((a) => a.id === id))
      )
    } else {
      const newIds = filtered.map((a) => a.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...newIds])))
    }
  }

  const toggleOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // ── Bulk actions ─────────────────────────────────────────────────────────

  const handleBulkAction = async (newStatus) => {
    if (selectedIds.length === 0) return
    setBulkLoading(true)
    const updates = selectedIds.map((id) => {
      const row = assignments.find((a) => a.id === id)
      const update = { payout_status: newStatus }
      if (newStatus === 'paid') {
        update.payout_date = new Date().toISOString().split('T')[0]
        if (!row.payout_amount) {
          update.payout_amount =
            row.attorney_partners?.price_per_lead ?? 200000
        }
      }
      return supabase.from('lead_assignments').update(update).eq('id', id)
    })
    await Promise.all(updates)
    setSelectedIds([])
    await fetchAssignments()
    setBulkLoading(false)
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-[#111318] p-6 md:p-8"
      style={{ fontFamily: 'Manrope, sans-serif' }}
    >
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-[#e2e2e8]"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Payouts
        </h1>
        <p className="mt-1 text-sm text-[#bbc9cf]">
          Track and manage lead assignment payouts
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-6 flex flex-wrap gap-4">
        <StatCard
          icon={Clock}
          label="Total Assigned"
          value={totalAssigned.toLocaleString()}
          accent="#a4e6ff"
        />
        <StatCard
          icon={DollarSign}
          label="Unpaid"
          value={unpaidCount.toLocaleString()}
          accent="#ffb4ab"
        />
        <StatCard
          icon={FileText}
          label="Invoiced"
          value={invoicedCount.toLocaleString()}
          accent="#a4e6ff"
        />
        <StatCard
          icon={CheckCircle}
          label="Total Paid"
          value={formatCurrency(totalPaid)}
          accent="#4ADE80"
        />
      </div>

      {/* Card wrapper */}
      <div className="rounded-xl border border-[#333539] bg-[#1e2024] overflow-hidden">
        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-4 border-b border-[#333539] px-5 py-4">
          <FilterSelect
            label="Payout Status"
            value={payoutFilter}
            onChange={setPayoutFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'unpaid', label: 'Unpaid' },
              { value: 'invoiced', label: 'Invoiced' },
              { value: 'paid', label: 'Paid' },
            ]}
          />
          <FilterSelect
            label="Outcome"
            value={outcomeFilter}
            onChange={setOutcomeFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'converted', label: 'Converted' },
            ]}
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="font-[Inter] text-sm text-[#bbc9cf]">
                {selectedIds.length} selected
              </span>
              <button
                disabled={bulkLoading}
                onClick={() => handleBulkAction('invoiced')}
                className="rounded-lg border border-[#a4e6ff]/40 px-3 py-1.5 font-[Inter] text-sm text-[#a4e6ff] hover:bg-[#a4e6ff]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Invoiced
              </button>
              <button
                disabled={bulkLoading}
                onClick={() => handleBulkAction('paid')}
                className="rounded-lg bg-gradient-to-r from-[#a4e6ff] to-[#00d1ff] px-3 py-1.5 font-[Inter] text-sm font-semibold text-[#111318] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Paid
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#a4e6ff] border-t-transparent" />
            <span className="ml-3 font-[Inter] text-sm text-[#bbc9cf]">
              Loading payouts…
            </span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-[Inter] text-sm text-[#ffb4ab]">
              Failed to load: {error}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <DollarSign size={32} className="text-[#333539] mb-3" />
            <p className="font-[Space_Grotesk] text-base font-semibold text-[#e2e2e8]">
              No payouts found
            </p>
            <p className="mt-1 font-[Inter] text-sm text-[#bbc9cf]">
              Try adjusting the filters above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-[#333539]">
                  <th className="w-10 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-[#333539] bg-[#111318] accent-[#a4e6ff] cursor-pointer"
                    />
                  </th>
                  {[
                    'Lead',
                    'Attorney',
                    'Case Type',
                    'Assigned',
                    'Outcome',
                    'Payout Status',
                    'Amount',
                    'Payout Date',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-[Inter] text-xs font-semibold uppercase tracking-wide text-[#bbc9cf]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => {
                  const isSelected = selectedIds.includes(row.id)
                  const amount = resolveAmount(row)
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-[#333539]/60 transition-colors hover:bg-[#111318]/60 ${
                        isSelected ? 'bg-[#a4e6ff]/5' : ''
                      } ${idx === filtered.length - 1 ? 'border-b-0' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(row.id)}
                          className="h-4 w-4 rounded border-[#333539] bg-[#111318] accent-[#a4e6ff] cursor-pointer"
                        />
                      </td>

                      {/* Lead Name */}
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/leads/${row.lead_id}`}
                          className="font-[Manrope] text-sm font-medium text-[#a4e6ff] hover:underline"
                        >
                          {row.leads?.contact_name ?? '—'}
                        </Link>
                      </td>

                      {/* Attorney */}
                      <td className="px-4 py-3">
                        <div className="font-[Manrope] text-sm text-[#e2e2e8]">
                          {row.attorney_partners?.name ?? '—'}
                        </div>
                        {row.attorney_partners?.firm_name && (
                          <div className="font-[Inter] text-xs text-[#bbc9cf]">
                            {row.attorney_partners.firm_name}
                          </div>
                        )}
                      </td>

                      {/* Case Type */}
                      <td className="px-4 py-3 font-[Inter] text-sm text-[#e2e2e8]">
                        {formatCaseType(row.leads?.case_type)}
                      </td>

                      {/* Assigned Date */}
                      <td className="px-4 py-3 font-[Inter] text-sm text-[#bbc9cf] whitespace-nowrap">
                        {formatDate(row.assigned_at)}
                      </td>

                      {/* Outcome */}
                      <td className="px-4 py-3">
                        <Badge value={row.outcome} map={OUTCOME_BADGE} />
                      </td>

                      {/* Payout Status */}
                      <td className="px-4 py-3">
                        <Badge value={row.payout_status} map={PAYOUT_BADGE} />
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-[Inter] text-sm font-semibold text-[#e2e2e8] whitespace-nowrap">
                        {formatCurrency(amount)}
                      </td>

                      {/* Payout Date */}
                      <td className="px-4 py-3 font-[Inter] text-sm text-[#bbc9cf] whitespace-nowrap">
                        {formatDate(row.payout_date)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
