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
  const [activityKey, setActivityKey] = useState(0)

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
            <ActivityLog key={activityKey} leadId={lead.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
