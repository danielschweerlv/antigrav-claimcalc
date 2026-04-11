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
