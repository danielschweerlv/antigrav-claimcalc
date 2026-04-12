import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { LeadStatusBadge } from './LeadStatusBadge'
import { ActivityLog } from './ActivityLog'
import { AssignLeadModal } from './AssignLeadModal'
import { generateInvoice } from '@/lib/generate-invoice'
import { format } from 'date-fns'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, UserCheck, FileText, DollarSign } from 'lucide-react'

export function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [activityKey, setActivityKey] = useState(0)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignment, setAssignment] = useState(null)

  useEffect(() => {
    if (id) {
      fetchLead()
      fetchAssignment()
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

  const fetchAssignment = async () => {
    const { data } = await supabase
      .from('lead_assignments')
      .select('*, attorney_partners(name, firm_name, email, phone, price_per_lead)')
      .eq('lead_id', id)
      .order('assigned_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) {
      setAssignment(data)
    }
  }

  const updateOutcome = async (newOutcome) => {
    if (!assignment) return
    setUpdating(true)

    const { error } = await supabase
      .from('lead_assignments')
      .update({ outcome: newOutcome, outcome_updated_at: new Date().toISOString() })
      .eq('id', assignment.id)

    if (!error) {
      const { data: { session } } = await supabase.auth.getSession()
      await supabase.from('lead_activity').insert({
        lead_id: id,
        action: 'outcome_changed',
        performed_by: session?.user?.id ?? null,
        details: { from: assignment.outcome, to: newOutcome },
      })

      if (newOutcome === 'converted' && lead.status !== 'converted') {
        await supabase.from('leads').update({ status: 'converted' }).eq('id', id)
        setLead({ ...lead, status: 'converted' })
      }

      setAssignment({ ...assignment, outcome: newOutcome, outcome_updated_at: new Date().toISOString() })
      setActivityKey((k) => k + 1)
    }

    setUpdating(false)
  }

  const updatePayoutStatus = async (newStatus) => {
    if (!assignment) return
    setUpdating(true)

    const update = { payout_status: newStatus }
    if (newStatus === 'paid') {
      update.payout_date = new Date().toISOString().split('T')[0]
      if (!assignment.payout_amount) {
        update.payout_amount = assignment.attorney_partners?.price_per_lead || 200000
      }
    }

    const { error } = await supabase
      .from('lead_assignments')
      .update(update)
      .eq('id', assignment.id)

    if (!error) {
      const { data: { session } } = await supabase.auth.getSession()
      await supabase.from('lead_activity').insert({
        lead_id: id,
        action: 'payout_status_changed',
        performed_by: session?.user?.id ?? null,
        details: { from: assignment.payout_status, to: newStatus },
      })

      setAssignment({ ...assignment, ...update })
      setActivityKey((k) => k + 1)
    }

    setUpdating(false)
  }

  const handleGenerateInvoice = () => {
    if (!assignment || !lead) return
    generateInvoice({
      assignment: {
        id: assignment.id,
        assigned_at: assignment.assigned_at,
        payout_amount: assignment.payout_amount || assignment.attorney_partners?.price_per_lead || 200000,
      },
      lead: { contact_name: lead.contact_name, case_type: lead.case_type },
      attorney: assignment.attorney_partners || {},
    })
  }

  const handleAssigned = () => {
    setShowAssignModal(false)
    fetchLead()
    fetchAssignment()
    setActivityKey((k) => k + 1)
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
      setActivityKey((k) => k + 1)
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
                <div className={`font-['Manrope'] ${lead.has_lawyer ? 'text-[#ffb4ab]' : 'text-[#4ADE80]'}`}>
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
                  onClick={() => setShowAssignModal(true)}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#a4e6ff] text-[#111318] rounded-lg
                             hover:bg-[#a4e6ff]/80 transition-colors
                             disabled:opacity-50 font-medium font-['Manrope']"
                >
                  <UserCheck size={16} />
                  Assign to Attorney
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

          {/* Assignment info */}
          {assignment && (
            <div className="bg-[#1e2024] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-4">
                Assignment
              </h2>
              <div className="space-y-3">
                <div className="text-[#e2e2e8] font-['Manrope'] font-medium">
                  {assignment.attorney_partners?.name || 'Unknown Attorney'}
                </div>
                {assignment.attorney_partners?.firm_name && (
                  <div className="text-[#bbc9cf] text-sm font-['Manrope']">
                    {assignment.attorney_partners.firm_name}
                  </div>
                )}
                <div className="text-[#bbc9cf] text-xs font-['Manrope']">
                  Assigned {format(new Date(assignment.assigned_at), 'MMM d, yyyy h:mm a')}
                </div>

                {/* Outcome */}
                <div className="pt-2 border-t border-[#333539]">
                  <div className="text-[#bbc9cf] text-xs font-['Inter'] mb-2">Outcome</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['pending', 'accepted', 'rejected', 'converted'].map((o) => (
                      <button
                        key={o}
                        onClick={() => updateOutcome(o)}
                        disabled={updating || assignment.outcome === o}
                        className={`px-2.5 py-1 rounded-lg text-xs font-['Manrope'] transition-colors ${
                          assignment.outcome === o
                            ? o === 'rejected'
                              ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/40'
                              : o === 'accepted' || o === 'converted'
                                ? 'bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/40'
                                : 'bg-[#a4e6ff]/20 text-[#a4e6ff] border border-[#a4e6ff]/40'
                            : 'bg-[#333539] text-[#bbc9cf] border border-[#333539] hover:border-[#bbc9cf]/40'
                        } disabled:cursor-default`}
                      >
                        {o.charAt(0).toUpperCase() + o.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payout */}
                <div className="pt-2 border-t border-[#333539]">
                  <div className="text-[#bbc9cf] text-xs font-['Inter'] mb-2">Payout</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-['Inter'] font-medium ${
                      assignment.payout_status === 'paid'
                        ? 'text-[#4ADE80] bg-[#4ADE80]/15'
                        : assignment.payout_status === 'invoiced'
                          ? 'text-[#a4e6ff] bg-[#a4e6ff]/15'
                          : 'text-[#ffb4ab] bg-[#ffb4ab]/15'
                    }`}>
                      {assignment.payout_status?.charAt(0).toUpperCase() + assignment.payout_status?.slice(1)}
                    </span>
                    <span className="text-[#a4e6ff] font-bold font-['Space_Grotesk'] text-sm">
                      ${((assignment.payout_amount || assignment.attorney_partners?.price_per_lead || 200000) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {assignment.payout_date && (
                    <div className="text-[#bbc9cf] text-xs font-['Manrope'] mb-2">
                      Paid {format(new Date(assignment.payout_date + 'T00:00:00'), 'MMM d, yyyy')}
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    {assignment.payout_status === 'unpaid' && (
                      <button
                        onClick={() => updatePayoutStatus('invoiced')}
                        disabled={updating}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#333539] text-[#a4e6ff] rounded-lg hover:bg-[#a4e6ff]/20 transition-colors disabled:opacity-50 text-sm font-['Manrope']"
                      >
                        <FileText size={14} />
                        Mark as Invoiced
                      </button>
                    )}
                    {(assignment.payout_status === 'unpaid' || assignment.payout_status === 'invoiced') && (
                      <button
                        onClick={() => updatePayoutStatus('paid')}
                        disabled={updating}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#4ADE80] text-[#111318] rounded-lg hover:bg-[#4ADE80]/80 transition-colors disabled:opacity-50 text-sm font-medium font-['Manrope']"
                      >
                        <DollarSign size={14} />
                        Mark as Paid
                      </button>
                    )}
                    <button
                      onClick={handleGenerateInvoice}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#333539] text-[#e2e2e8] rounded-lg hover:bg-[#333539]/80 transition-colors text-sm font-['Manrope']"
                    >
                      <FileText size={14} />
                      Download Invoice PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity log */}
          <div className="bg-[#1e2024] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk'] mb-4">
              Activity
            </h2>
            <ActivityLog key={activityKey} leadId={lead.id} />
          </div>
        </div>
      </div>

      {/* Assign Lead Modal */}
      {showAssignModal && (
        <AssignLeadModal
          lead={lead}
          onAssigned={handleAssigned}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </div>
  )
}
