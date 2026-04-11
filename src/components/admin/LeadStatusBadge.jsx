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
