import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Edit2, Loader2, Plus, RotateCcw, ShieldCheck, Trash2, X } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'

const MESSAGE_FIELDS = [
  ['manufacturing_defect', 'Manufacturing defect'],
  ['hardness_issue', 'Hardness issue'],
  ['damage', 'Damage'],
  ['exchange', 'Exchange'],
  ['other', 'Other'],
]

function emptyMessages() {
  return MESSAGE_FIELDS.reduce((messages, [key]) => ({ ...messages, [key]: '' }), {})
}

function emptyForm() {
  return {
    category: '',
    warranty_months: '',
    is_active: true,
    messages: emptyMessages(),
  }
}

function normalizeRuleForForm(rule) {
  return {
    category: rule.category || '',
    warranty_months: rule.warranty_months ? String(rule.warranty_months) : '',
    is_active: rule.is_active !== false,
    messages: { ...emptyMessages(), ...(rule.messages || {}) },
  }
}

export default function WarrantyRulesAdmin() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const activeCount = useMemo(() => rules.filter((rule) => rule.is_active !== false).length, [rules])

  useEffect(() => {
    fetchRules()
  }, [])

  async function fetchRules() {
    try {
      const response = await api.get('/rules/', { params: { include_inactive: true } })
      setRules(response.data.rules || [])
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to load rules')
    } finally {
      setLoading(false)
    }
  }

  function startCreate() {
    setForm(emptyForm())
    setEditingId(null)
    setFormOpen(true)
  }

  function startEdit(rule) {
    setForm(normalizeRuleForForm(rule))
    setEditingId(rule.id)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm())
  }

  function updateFormField(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function updateMessage(key, value) {
    setForm((current) => ({
      ...current,
      messages: { ...current.messages, [key]: value },
    }))
  }

  function validateForm() {
    if (!form.category.trim()) return 'Category is required'
    if (!form.warranty_months || Number(form.warranty_months) < 1) {
      return 'Warranty months must be at least 1'
    }
    const missingMessage = MESSAGE_FIELDS.find(([key]) => !form.messages[key]?.trim())
    if (missingMessage) return `${missingMessage[1]} message is required`
    return null
  }

  async function submitForm(event) {
    event.preventDefault()
    const error = validateForm()
    if (error) {
      toast.error(error)
      return
    }

    const payload = {
      category: form.category.trim(),
      warranty_months: Number(form.warranty_months),
      is_active: form.is_active,
      messages: MESSAGE_FIELDS.reduce(
        (messages, [key]) => ({ ...messages, [key]: form.messages[key].trim() }),
        {},
      ),
    }

    setSaving(true)
    try {
      if (editingId) {
        await api.put(`/rules/${editingId}`, payload)
        toast.success('Rule updated')
      } else {
        await api.post('/rules/', payload)
        toast.success('Rule created')
      }
      closeForm()
      fetchRules()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save rule')
    } finally {
      setSaving(false)
    }
  }

  async function deactivateRule(rule) {
    if (!window.confirm(`Deactivate ${rule.category}?`)) return

    try {
      await api.delete(`/rules/${rule.id}`)
      toast.success('Rule deactivated')
      fetchRules()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to deactivate rule')
    }
  }

  async function reactivateRule(rule) {
    try {
      await api.put(`/rules/${rule.id}`, { is_active: true })
      toast.success('Rule reactivated')
      fetchRules()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to reactivate rule')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Warranty Rules</h1>
          <p className="mt-1 text-sm text-surface-500">
            {activeCount} active of {rules.length} total
          </p>
        </div>
        <button onClick={startCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Rule
        </button>
      </div>

      {formOpen && (
        <form onSubmit={submitForm} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-surface-950">
              {editingId ? 'Update Rule' : 'Create Rule'}
            </h2>
            <button type="button" onClick={closeForm} className="rounded-lg p-2 text-surface-500 hover:bg-surface-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-surface-800">
                Category
              </label>
              <input
                id="category"
                name="category"
                value={form.category}
                onChange={updateFormField}
                className="input"
                placeholder="Category name"
              />
            </div>

            <div>
              <label htmlFor="warranty_months" className="mb-2 block text-sm font-medium text-surface-800">
                Warranty months
              </label>
              <input
                id="warranty_months"
                name="warranty_months"
                type="number"
                min="1"
                value={form.warranty_months}
                onChange={updateFormField}
                className="input"
                placeholder="Enter duration"
              />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-surface-800">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={updateFormField}
              className="h-4 w-4 rounded border-surface-300"
            />
            Active
          </label>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {MESSAGE_FIELDS.map(([key, label]) => (
              <div key={key}>
                <label htmlFor={key} className="mb-2 block text-sm font-medium text-surface-800">
                  {label}
                </label>
                <textarea
                  id={key}
                  rows="2"
                  value={form.messages[key]}
                  onChange={(event) => updateMessage(key, event.target.value)}
                  className="input min-h-20 resize-y"
                  placeholder={`${label} response`}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Save Rule
            </button>
            <button type="button" onClick={closeForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-surface-950">{rule.category}</h2>
                  <StatusBadge status={rule.is_active === false ? 'inactive' : 'active'} size="sm" />
                </div>
                <p className="mt-1 text-sm text-surface-600">{rule.warranty_months} months warranty</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(rule)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50" title="Edit">
                  <Edit2 className="h-4 w-4" />
                </button>
                {rule.is_active === false ? (
                  <button onClick={() => reactivateRule(rule)} className="rounded-lg p-2 text-success-700 hover:bg-success-50" title="Reactivate">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={() => deactivateRule(rule)} className="rounded-lg p-2 text-danger-700 hover:bg-danger-50" title="Deactivate">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {MESSAGE_FIELDS.map(([key, label]) => (
                <div key={key} className="rounded-lg border border-surface-200 bg-surface-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">{label}</p>
                  <p className="mt-1 text-sm text-surface-800">{rule.messages?.[key] || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {!rules.length && (
          <div className="rounded-lg border border-surface-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-surface-600">No warranty rules have been created.</p>
          </div>
        )}
      </div>
    </section>
  )
}
