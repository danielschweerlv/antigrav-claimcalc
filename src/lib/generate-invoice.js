import { jsPDF } from 'jspdf'

/**
 * Format a case type string: replace underscores with spaces, capitalize each word.
 * e.g. "motor_vehicle" → "Motor Vehicle"
 */
function formatCaseType(caseType) {
  if (!caseType) return ''
  return caseType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format cents to a dollar string: e.g. 200000 → "$2,000.00"
 */
function formatCurrency(cents) {
  const dollars = (cents ?? 200000) / 100
  return '$' + dollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Format a date string or Date object to "Month DD, YYYY"
 */
function formatDate(dateInput) {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * Generate and download a PDF invoice.
 *
 * @param {Object} params
 * @param {{ id: string, assigned_at: string, payout_amount: number|null }} params.assignment
 * @param {{ contact_name: string, case_type: string }} params.lead
 * @param {{ name: string, firm_name: string, email: string, phone: string }} params.attorney
 */
export function generateInvoice({ assignment, lead, attorney }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth()   // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight() // 841.89 pt
  const marginLeft = 48
  const marginRight = pageWidth - 48
  const contentWidth = marginRight - marginLeft

  // Derived values
  const rawId = (assignment?.id ?? '00000000').replace(/-/g, '')
  const invoiceNumber = 'INV-' + rawId.slice(0, 8).toUpperCase()
  const dateIssued = formatDate(new Date())
  const dateAssigned = formatDate(assignment?.assigned_at)
  const payoutCents = assignment?.payout_amount ?? 200000
  const amountFormatted = formatCurrency(payoutCents)
  const caseTypeFormatted = formatCaseType(lead?.case_type)
  const lineDescription = `Lead Referral — ${lead?.contact_name ?? ''} (${caseTypeFormatted})`

  // ── Colours & helpers ───────────────────────────────────────────────────────
  const PRIMARY = [30, 64, 175]    // indigo-800 — professional blue
  const DARK = [31, 31, 31]
  const MID = [100, 100, 100]
  const LIGHT_BG = [245, 247, 250]
  const BORDER = [210, 215, 225]

  const setColor = (rgb, type = 'text') => {
    if (type === 'text') doc.setTextColor(...rgb)
    else if (type === 'fill') doc.setFillColor(...rgb)
    else if (type === 'draw') doc.setDrawColor(...rgb)
  }

  // ── White background ────────────────────────────────────────────────────────
  setColor([255, 255, 255], 'fill')
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // ── Header bar ──────────────────────────────────────────────────────────────
  setColor(PRIMARY, 'fill')
  doc.rect(0, 0, pageWidth, 72, 'F')

  // "INVOICE" title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  setColor([255, 255, 255], 'text')
  doc.text('INVOICE', marginLeft, 46)

  // Company name in header
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('ClaimCalculator.ai', marginRight, 34, { align: 'right' })
  doc.text('www.claimcalculator.ai', marginRight, 50, { align: 'right' })

  // ── Invoice meta block ───────────────────────────────────────────────────────
  let y = 104

  // Invoice number row
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  setColor(MID, 'text')
  doc.text('INVOICE NUMBER', marginLeft, y)
  doc.text('DATE ISSUED', pageWidth / 2, y)

  y += 14
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  setColor(DARK, 'text')
  doc.text(invoiceNumber, marginLeft, y)
  doc.text(dateIssued, pageWidth / 2, y)

  // Thin divider
  y += 22
  setColor(BORDER, 'draw')
  doc.setLineWidth(0.5)
  doc.line(marginLeft, y, marginRight, y)

  // ── From / Bill To ───────────────────────────────────────────────────────────
  y += 24

  const colMid = pageWidth / 2

  // Section labels
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  setColor(PRIMARY, 'text')
  doc.text('FROM', marginLeft, y)
  doc.text('BILL TO', colMid, y)

  y += 14
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setColor(DARK, 'text')
  doc.text('ClaimCalculator.ai', marginLeft, y)
  doc.text(attorney?.name ?? '', colMid, y)

  y += 15
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  setColor(MID, 'text')
  doc.text('www.claimcalculator.ai', marginLeft, y)
  doc.text(attorney?.firm_name ?? '', colMid, y)

  y += 14
  doc.text(attorney?.email ?? '', colMid, y)

  y += 14
  doc.text(attorney?.phone ?? '', colMid, y)

  // ── Line item table ──────────────────────────────────────────────────────────
  y += 36

  const colDescX = marginLeft
  const colDateX = marginLeft + contentWidth * 0.62
  const colAmtX  = marginRight

  const tableHeaderHeight = 28
  const tableRowHeight = 36

  // Table header background
  setColor(PRIMARY, 'fill')
  doc.rect(marginLeft, y, contentWidth, tableHeaderHeight, 'F')

  // Header text
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  setColor([255, 255, 255], 'text')
  doc.text('DESCRIPTION', colDescX + 8, y + 18)
  doc.text('DATE ASSIGNED', colDateX, y + 18)
  doc.text('AMOUNT', colAmtX, y + 18, { align: 'right' })

  y += tableHeaderHeight

  // Row background (alternating light)
  setColor(LIGHT_BG, 'fill')
  doc.rect(marginLeft, y, contentWidth, tableRowHeight, 'F')

  // Row border
  setColor(BORDER, 'draw')
  doc.setLineWidth(0.5)
  doc.rect(marginLeft, y, contentWidth, tableRowHeight, 'S')

  // Row text
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  setColor(DARK, 'text')
  doc.text(lineDescription, colDescX + 8, y + 22)

  doc.setFontSize(10)
  setColor(MID, 'text')
  doc.text(dateAssigned, colDateX, y + 22)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  setColor(DARK, 'text')
  doc.text(amountFormatted, colAmtX, y + 22, { align: 'right' })

  y += tableRowHeight

  // ── Total row ────────────────────────────────────────────────────────────────
  const totalRowHeight = 36
  setColor([235, 240, 255], 'fill')
  doc.rect(marginLeft, y, contentWidth, totalRowHeight, 'F')

  setColor(BORDER, 'draw')
  doc.setLineWidth(0.5)
  doc.rect(marginLeft, y, contentWidth, totalRowHeight, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setColor(PRIMARY, 'text')
  doc.text('TOTAL DUE', colDescX + 8, y + 23)
  doc.text(amountFormatted, colAmtX, y + 23, { align: 'right' })

  y += totalRowHeight

  // ── Footer ───────────────────────────────────────────────────────────────────
  const footerY = pageHeight - 56

  // Footer divider
  setColor(BORDER, 'draw')
  doc.setLineWidth(0.5)
  doc.line(marginLeft, footerY, marginRight, footerY)

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(10)
  setColor(MID, 'text')
  doc.text('Thank you for your business.', marginLeft, footerY + 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Payment terms: Net 30', marginLeft, footerY + 34)

  // ── Save / download ──────────────────────────────────────────────────────────
  doc.save(`invoice-${invoiceNumber}.pdf`)
}
