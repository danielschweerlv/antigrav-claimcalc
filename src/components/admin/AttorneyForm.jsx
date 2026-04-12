import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const CASE_TYPE_OPTIONS = [
  { value: 'motor_vehicle', label: 'Motor Vehicle' },
  { value: 'premises_liability', label: 'Premises Liability' },
  { value: 'work_injury', label: 'Work Injury' },
  { value: 'product_liability', label: 'Product Liability' },
  { value: 'other', label: 'Other' },
]

export function AttorneyForm({ attorney, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    firm_name: '',
    email: '',
    phone: '',
    case_types_accepted: ['motor_vehicle'],
    zip_codes_covered: [],
    max_leads_per_month: '',
    price_per_lead: 2000,
    notes: '',
    is_active: true,
  })
  const [zipInput, setZipInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (attorney) {
      setForm({
        name: attorney.name || '',
        firm_name: attorney.firm_name || '',
        email: attorney.email || '',
        phone: attorney.phone || '',
        case_types_accepted: attorney.case_types_accepted || ['motor_vehicle'],
        zip_codes_covered: attorney.zip_codes_covered || [],
        max_leads_per_month: attorney.max_leads_per_month ?? '',
        price_per_lead: attorney.price_per_lead ?? 2000,
        notes: attorney.notes || '',
        is_active: attorney.is_active ?? true,
      })
    }
  }, [attorney])

  const toggleCaseType = (value) => {
    setForm((prev) => ({
      ...prev,
      case_types_accepted: prev.case_types_accepted.includes(value)
        ? prev.case_types_accepted.filter((t) => t !== value)
        : [...prev.case_types_accepted, value],
    }))
  }

  const addZip = () => {
    const zip = zipInput.trim()
    if (zip && !form.zip_codes_covered.includes(zip)) {
      setForm((prev) => ({
        ...prev,
        zip_codes_covered: [...prev.zip_codes_covered, zip],
      }))
    }
    setZipInput('')
  }

  const removeZip = (zip) => {
    setForm((prev) => ({
      ...prev,
      zip_codes_covered: prev.zip_codes_covered.filter((z) => z !== zip),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      max_leads_per_month: form.max_leads_per_month === '' ? null : Number(form.max_leads_per_month),
      price_per_lead: Number(form.price_per_lead),
    }
    await onSave(payload)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e2024] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#333539]">
          <h2 className="text-lg font-bold text-[#e2e2e8] font-['Space_Grotesk']">
            {attorney ? 'Edit Attorney' : 'Add Attorney'}
          </h2>
          <button onClick={onClose} className="text-[#bbc9cf] hover:text-[#e2e2e8] transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[#bbc9cf] text-sm mb-1 font-['Inter']">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-[#333539] text-[#e2e2e8] px-4 py-2.5 rounded-lg border border-[#333539] focus:border-[#a4e6ff] focus:outline-none font-['Manrope']"
            />
          </div>

          {/* Firm */}
          <div>
            <label className="block text-[#bbc9cf] text-sm mb-1 font-['Inter']">Firm Name</label>
            <input
              type="text"
              value={form.firm_name}
              onChange={(e) => setForm({ ...form, firm_name: e.target.value })}
              className="w-full bg-[#333539] text-[#e2e2e8] px-4 py-2.5 rounded-lg border border-[#333539] focus:border-[#a4e6ff] focus:outline-none font-['Manrope']"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#bbc9cf] text-sm mb-1 font-['Inter']">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-[#333539] text-[#e2e2e8] px-4 py-2.5 rounded-lg border border-[#333539] focus:border-[#a4e6ff] focus:outline-none font-['Manrope']"
              />
            </div>
            <div>
              <label className="block text-[#bbc9cf] text-sm mb-1 font-['Inter']">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#333539] text-[#e2e2e8] px-4 py-2.5 rounded-lg border border-[#333539] focus:border-[#a4e6ff] focus:outline-none font-['Manrope']"
              />
            </div>
          </div>

          {/* Case Types */}
          <div>
            <label className="block text-[#bbc9cf] text-sm mb-2 font-['Inter']">Case Types Accepted</label>
            <div className="flex flex-wrap gap-2">
              {CASE_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleCaseType(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-['Manrope'] transition-colors ${
                    form.case_types_accepted.includes(opt.value)
                      ? 'bg-[#a4e6ff]/20 text-[#a4e6ff] border border-[#a4e6ff]/40'
                      : 'bg-[#333539] text-[#bbc9cf] border border-[#333539]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ZIP Codes */}
          <div>
            <label className="block text-[#bbc9cf] text-sm mb-1 font-['Inter']">ZIP Codes Covered</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addZip())}
                placeholder="Add ZIP code"
                className="flex-1 bg-[#333539] text-[#e2e2e8] px-4 py-2.5 rounded-lg border border-[#333539] focus:border-[#a4e6ff] focus:outline-none font-['Manrope']"
              />
              <button
                type="button"
                onClick={addZip}
                className="px-4 py-2.5 bg-[#333539] text-[#e2e2e8] rounded-lg hover:bg-[#a4e6ff] hover:text-[#111318] transition-colors font-['Manrope']"
              >
                Add
              </button>
            </div>
            {form.zip_codes_covered.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.zip_codes_covered.map((zip) => (
                  <span
                    key={zip}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#333539] rounded text-sm text-[#e2e2e8] font-['Manrope']"
                  >
                    {zip}
                    <button type="button" onClick={() => removeZip(zip)} className="text-[#bbc9cf] hover:text-[#ffb4ab]">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {form.zip_codes_covered.length === 0 && (
              <p className="text-[#bbc9cf] text-xs font-['Manrope']">Leave empty for all ZIP codes</p>
            )}
          </div>

          {/* Max Leads & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#bbc9cf] text-sm mb-1 font-['Inter']">Max Leads/Month</label>
              <input
                type="number"
                value={form.max_leads_per_month}
                onChange={(e) => setForm({ ...form, max_leads_per_month: e.target.value })}
                placeholder="Unlimited"
                className="w-full bg-[#333539] text-[#e2e2e8] px-4 py-2.5 rounded-lg border border-[#333539] focus:border-[#a4e6ff] focus:outline-none font-['Manrope']"
              />
            </div>
            <div>
              <label className="block text-[#bbc9cf] text-sm mb-1 font-['Inter']">Price Per Lead ($)</label>
              <input
                type="number"
                value={form.price_per_lead}
                onChange={(e) => setForm({ ...form, price_per_lead: e.target.value })}
                required
                className="w-full bg-[#333539] text-[#e2e2e8] px-4 py-2.5 rounded-lg border border-[#333539] focus:border-[#a4e6ff] focus:outline-none font-['Manrope']"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[#bbc9cf] text-sm mb-1 font-['Inter']">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full bg-[#333539] text-[#e2e2e8] px-4 py-2.5 rounded-lg border border-[#333539] focus:border-[#a4e6ff] focus:outline-none font-['Manrope'] resize-none"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`w-10 h-6 rounded-full transition-colors ${form.is_active ? 'bg-[#4ADE80]' : 'bg-[#333539]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-1 ${form.is_active ? 'translate-x-4' : ''}`} />
            </button>
            <span className="text-[#e2e2e8] text-sm font-['Manrope']">
              {form.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#a4e6ff] to-[#00d1ff] text-[#111318] font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-['Space_Grotesk']"
            >
              {saving ? 'Saving...' : attorney ? 'Update Attorney' : 'Add Attorney'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-[#333539] text-[#bbc9cf] rounded-lg hover:text-[#e2e2e8] transition-colors font-['Manrope']"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
