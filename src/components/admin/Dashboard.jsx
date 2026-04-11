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
