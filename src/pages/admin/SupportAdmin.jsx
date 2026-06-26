import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Edit2, Loader2, Mail, Phone, Plus, Save, Trash2, UserRound, X } from 'lucide-react'
import api from '../../api/axios'
import StatusBadge from '../../components/StatusBadge'

function emptyForm() {
  return { name: '', title: '', phone: '', email: '', is_active: true }
}

export default function SupportAdmin() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    try {
      const response = await api.get('/support/contacts')
      setContacts(response.data.contacts || [])
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to load support contacts')
    } finally {
      setLoading(false)
    }
  }

  function startCreate() {
    setForm(emptyForm())
    setEditingId(null)
    setFormOpen(true)
  }

  function startEdit(contact) {
    setForm({
      name: contact.name || '',
      title: contact.title || '',
      phone: contact.phone || '',
      email: contact.email || '',
      is_active: contact.is_active !== false,
    })
    setEditingId(contact.id)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm())
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function submitForm(event) {
    event.preventDefault()
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!form.phone.trim() && !form.email.trim()) {
      toast.error('Provide at least a phone number or an email')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        await api.put(`/support/contacts/${editingId}`, form)
        toast.success('Contact updated')
      } else {
        await api.post('/support/contacts', form)
        toast.success('Contact added')
      }
      closeForm()
      fetchContacts()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save contact')
    } finally {
      setSaving(false)
    }
  }

  async function removeContact(contact) {
    if (!window.confirm(`Remove ${contact.name} from support contacts?`)) return
    try {
      await api.delete(`/support/contacts/${contact.id}`)
      toast.success('Contact removed')
      fetchContacts()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to remove contact')
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
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Support Team</h1>
          <p className="mt-1 text-sm text-surface-500">
            These contacts appear in the customer&apos;s Support section.
          </p>
        </div>
        <button onClick={startCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {formOpen && (
        <form onSubmit={submitForm} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-950">{editingId ? 'Edit Member' : 'Add Member'}</h2>
            <button type="button" onClick={closeForm} className="rounded-lg p-2 text-surface-500 hover:bg-surface-100">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-800">Name</label>
              <input name="name" value={form.name} onChange={updateField} className="input" placeholder="Full name" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-800">Title / Role</label>
              <input name="title" value={form.title} onChange={updateField} className="input" placeholder="e.g. Support Executive" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-800">Phone</label>
              <input name="phone" value={form.phone} onChange={updateField} className="input" placeholder="Phone number" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-surface-800">Email</label>
              <input name="email" value={form.email} onChange={updateField} className="input" placeholder="Email address" />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-surface-800">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={updateField} className="h-4 w-4 rounded border-surface-300" />
            Active (visible to customers)
          </label>

          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
            <button type="button" onClick={closeForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <div key={contact.id} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <UserRound className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-surface-950">{contact.name}</p>
                  {contact.title && <p className="text-xs text-surface-500">{contact.title}</p>}
                </div>
              </div>
              <StatusBadge status={contact.is_active === false ? 'inactive' : 'active'} size="sm" />
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {contact.phone && (
                <p className="flex items-center gap-2 text-surface-700"><Phone className="h-4 w-4 text-surface-400" />{contact.phone}</p>
              )}
              {contact.email && (
                <p className="flex items-center gap-2 text-surface-700"><Mail className="h-4 w-4 text-surface-400" />{contact.email}</p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => startEdit(contact)} className="rounded-lg p-2 text-brand-700 hover:bg-brand-50" title="Edit">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => removeContact(contact)} className="rounded-lg p-2 text-danger-700 hover:bg-danger-50" title="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {!contacts.length && (
          <div className="col-span-full rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-surface-600">No support contacts yet. Add your first team member.</p>
          </div>
        )}
      </div>
    </section>
  )
}
