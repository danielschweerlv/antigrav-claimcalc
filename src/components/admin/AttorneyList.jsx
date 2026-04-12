import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AttorneyForm } from './AttorneyForm'
import { Plus, Pencil } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function AttorneyList() {
  const [attorneys, setAttorneys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [leadCounts, setLeadCounts] = useState({})

  useEffect(() => {
    fetchAttorneys()
  }, [])

  const fetchAttorneys = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('attorney_partners')
      .select('*')
      .order('is_active', { ascending: false })
      .order('name', { ascending: true })

    if (!error) {
      setAttorneys(data || [])
      await fetchLeadCounts(data || [])
    }

    setLoading(false)
  }

  const fetchLeadCounts = async (attorneyData) => {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const { data } = await supabase
      .from('lead_assignments')
      .select('attorney_id')
      .gte('assigned_at', monthAgo.toISOString())

    if (data) {
      const counts = {}
      data.forEach((a) => {
        counts[a.attorney_id] = (counts[a.attorney_id] || 0) + 1
      })
      setLeadCounts(counts)
    }
  }

  const handleSave = async (formData) => {
    if (editing) {
      const { error } = await supabase
        .from('attorney_partners')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editing.id)

      if (!error) {
        setShowForm(false)
        setEditing(null)
        fetchAttorneys()
      }
    } else {
      const { error } = await supabase
        .from('attorney_partners')
        .insert(formData)

      if (!error) {
        setShowForm(false)
        fetchAttorneys()
      }
    }
  }

  const formatCaseTypes = (types) => {
    if (!types || types.length === 0) return '—'
    return types.map((t) => t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())).join(', ')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#e2e2e8] font-['Space_Grotesk']">
          Attorneys
        </h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#a4e6ff] to-[#00d1ff] text-[#111318] font-bold rounded-lg hover:opacity-90 transition-opacity font-['Space_Grotesk']"
        >
          <Plus size={18} />
          Add Attorney
        </button>
      </div>

      {loading ? (
        <div className="text-[#bbc9cf] font-['Manrope']">Loading...</div>
      ) : attorneys.length === 0 ? (
        <div className="text-[#bbc9cf] text-center py-12 font-['Manrope']">
          No attorney partners yet. Add one to start routing leads.
        </div>
      ) : (
        <div className="bg-[#1e2024] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333539]">
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Attorney</th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Case Types</th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Leads/Month</th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Price</th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Status</th>
                <th className="text-left p-4 text-[#bbc9cf] font-['Inter'] text-sm font-medium">Added</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {attorneys.map((att) => {
                const monthCount = leadCounts[att.id] || 0
                const atLimit = att.max_leads_per_month && monthCount >= att.max_leads_per_month

                return (
                  <tr
                    key={att.id}
                    className={`border-b border-[#333539] transition-colors ${!att.is_active ? 'opacity-50' : 'hover:bg-[#333539]/30'}`}
                  >
                    <td className="p-4">
                      <div className="text-[#e2e2e8] font-['Manrope']">{att.name}</div>
                      {att.firm_name && (
                        <div className="text-[#bbc9cf] text-sm">{att.firm_name}</div>
                      )}
                      <div className="text-[#bbc9cf] text-sm">{att.email}</div>
                    </td>
                    <td className="p-4 text-[#e2e2e8] text-sm font-['Manrope']">
                      {formatCaseTypes(att.case_types_accepted)}
                    </td>
                    <td className="p-4">
                      <div className={`text-sm font-['Manrope'] ${atLimit ? 'text-[#ffb4ab]' : 'text-[#e2e2e8]'}`}>
                        {monthCount} / {att.max_leads_per_month || '∞'}
                      </div>
                    </td>
                    <td className="p-4 text-[#a4e6ff] font-['Manrope'] font-medium">
                      ${att.price_per_lead?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-['Inter'] font-medium"
                        style={{
                          color: att.is_active ? '#4ADE80' : '#ffb4ab',
                          backgroundColor: att.is_active ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255, 180, 171, 0.15)',
                        }}
                      >
                        {att.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-[#bbc9cf] text-sm font-['Manrope']">
                      {formatDistanceToNow(new Date(att.created_at), { addSuffix: true })}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => { setEditing(att); setShowForm(true) }}
                        className="p-2 rounded-lg text-[#bbc9cf] hover:bg-[#333539] hover:text-[#e2e2e8] transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <AttorneyForm
          attorney={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
