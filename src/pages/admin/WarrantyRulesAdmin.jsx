import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ChevronDown, Edit2, Loader2, Plus, RotateCcw, ShieldCheck, Trash2, X } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'

const MAX_TERMS = 15

function emptyForm() {
  return {
    category: '',
    warranty_months: '',
    is_active: true,
    terms: [''],
  }
}

function normalizeRuleForForm(rule) {
  const terms = rule.terms && rule.terms.length > 0 ? [...rule.terms] : ['']
  return {
    category: rule.category || '',
    warranty_months: rule.warranty_months ? String(rule.warranty_months) : '',
    is_active: rule.is_active !== false,
    terms,
  }
}

export default function WarrantyRulesAdmin() {
  const [rules, setRules] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const activeCount = useMemo(() => rules.filter((rule) => rule.is_active !== false).length, [rules])

  useEffect(() => {
    fetchRules()
    fetchCategories()
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

  async function fetchCategories() {
    try {
      const response = await api.get('/rules/categories')
      setCategories(response.data.categories || [])
    } catch {
      // non-critical
    }
  }

  const usedCategories = useMemo(() => new Set(rules.map((r) => r.category?.toUpperCase())), [rules])
  const availableCategories = useMemo(
    () => categories.filter((c) => !usedCategories.has(c.toUpperCase()) || (editingId && form.category.toUpperCase() === c.toUpperCase())),
    [categories, usedCategories, editingId, form.category],
  )

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

  function updateTerm(index, value) {
    setForm((current) => {
      const terms = [...current.terms]
      terms[index] = value
      return { ...current, terms }
    })
  }

  function addTerm() {
    setForm((current) => {
      if (current.terms.length >= MAX_TERMS) return current
      return { ...current, terms: [...current.terms, ''] }
    })
  }

  function removeTerm(index) {
    setForm((current) => {
      const terms = current.terms.filter((_, i) => i !== index)
      return { ...current, terms: terms.length > 0 ? terms : [''] }
    })
  }

  function validateForm() {
    if (!form.category.trim()) return 'Category is required'
    if (!form.warranty_months || Number(form.warranty_months) < 1) {
      return 'Warranty months must be at least 1'
    }
    const hasAtLeastOneTerm = form.terms.some((t) => t.trim())
    if (!hasAtLeastOneTerm) return 'At least one warranty term is required'
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
      terms: form.terms.filter((t) => t.trim()),
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
              {availableCategories.length > 0 && !editingId ? (
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={updateFormField}
                  className="input"
                >
                  <option value="">Select a category</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={updateFormField}
                  className="input"
                  placeholder="Category name"
                  readOnly={!!editingId}
                />
              )}
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

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-surface-800">
                Warranty Terms ({form.terms.length}/{MAX_TERMS})
              </label>
              {form.terms.length < MAX_TERMS && (
                <button type="button" onClick={addTerm} className="btn-secondary text-xs">
                  <Plus className="h-3 w-3" />
                  Add Term
                </button>
              )}
            </div>
            <div className="space-y-2">
              {form.terms.map((term, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-2.5 text-xs font-medium text-surface-400 min-w-6 text-right">{index + 1}.</span>
                  <textarea
                    rows="2"
                    value={term}
                    onChange={(event) => updateTerm(index, event.target.value)}
                    className="input min-h-16 resize-y flex-1"
                    placeholder={`Warranty term ${index + 1}`}
                  />
                  {form.terms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTerm(index)}
                      className="mt-2 rounded p-1 text-danger-500 hover:bg-danger-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
          <details key={rule.id} className="group overflow-hidden rounded-lg border border-surface-200 bg-white shadow-sm">
            <summary className="grid cursor-pointer list-none items-center gap-3 px-4 py-3 transition hover:bg-surface-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 [&::-webkit-details-marker]:hidden sm:grid-cols-[minmax(180px,1fr)_170px_110px_120px_28px]">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-surface-950">{rule.category}</p>
                <p className="mt-0.5 text-xs text-surface-500 sm:hidden">Product category</p>
              </div>
              <p className="text-sm font-medium text-surface-700">{rule.warranty_months} months warranty</p>
              <StatusBadge status={rule.is_active === false ? 'inactive' : 'active'} size="sm" />
              <p className="text-xs font-medium text-surface-500">
                {rule.terms?.length || 0} {rule.terms?.length === 1 ? 'term' : 'terms'}
              </p>
              <ChevronDown className="h-5 w-5 text-surface-400 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
            </summary>

            <div className="border-t border-surface-200 bg-surface-50/50 px-4 pb-5 pt-4">
              {rule.terms && rule.terms.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">Warranty Terms</p>
                  <ol className="list-decimal space-y-2 pl-5">
                    {rule.terms.map((term, index) => (
                      <li key={index} className="text-sm leading-6 text-surface-800">{term}</li>
                    ))}
                  </ol>
                </div>
              ) : (
                <p className="text-sm text-surface-500">No warranty terms are configured for this category.</p>
              )}

              <div className="mt-5 flex flex-wrap gap-2 border-t border-surface-200 pt-4">
                <button onClick={() => startEdit(rule)} className="btn-secondary">
                  <Edit2 className="h-4 w-4" />
                  Edit Rule
                </button>
                {rule.is_active === false ? (
                  <button onClick={() => reactivateRule(rule)} className="inline-flex items-center gap-2 rounded-lg border border-success-100 bg-success-50 px-4 py-2 text-sm font-medium text-success-700 hover:bg-success-100">
                    <RotateCcw className="h-4 w-4" />
                    Reactivate
                  </button>
                ) : (
                  <button onClick={() => deactivateRule(rule)} className="inline-flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-2 text-sm font-medium text-danger-700 hover:bg-danger-100">
                    <Trash2 className="h-4 w-4" />
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          </details>
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
