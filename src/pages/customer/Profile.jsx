import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2, Mail, Save, User } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner'

const emptyProfile = {
  name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
}

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState(emptyProfile)
  const [email, setEmail] = useState(user?.email || '')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true

    async function fetchProfile() {
      try {
        const response = await api.get('/customer/profile')
        if (!active) return
        setEmail(response.data.email || user?.email || '')
        setForm({
          name: response.data.name || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          city: response.data.city || '',
          state: response.data.state || '',
        })
      } catch (error) {
        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.detail || 'Failed to load profile')
        }
        if (active) setEmail(user?.email || '')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchProfile()
    return () => {
      active = false
    }
  }, [user?.email])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await api.post('/customer/profile', form)
      setEmail(response.data.email || email)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <LoadingSpinner text="Loading profile" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-surface-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Customer</p>
        <h1 className="mt-2 text-3xl font-bold text-surface-950">Profile</h1>
        <p className="mt-1 text-sm text-surface-500">Keep your contact details current for warranty support.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <User className="h-5 w-5 text-brand-700" />
            <h2 className="text-base font-semibold text-surface-950">Profile Details</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(value) => updateField('name', value)} required />
            <Field label="Phone" value={form.phone} onChange={(value) => updateField('phone', value)} />
            <Field label="City" value={form.city} onChange={(value) => updateField('city', value)} required />
            <Field label="State" value={form.state} onChange={(value) => updateField('state', value)} />
            <div className="sm:col-span-2">
              <Field label="Address" value={form.address} onChange={(value) => updateField('address', value)} required />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary mt-6">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Profile
          </button>
        </div>

        <aside className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-surface-950">Login Email</h2>
          <p className="mt-2 break-words text-sm font-medium text-surface-700">{email || 'N/A'}</p>
          <p className="mt-3 text-sm text-surface-500">Email comes from OTP login and is kept read-only for account safety.</p>
        </aside>
      </form>
    </section>
  )
}

function Field({ label, value, onChange, required = false }) {
  const id = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-medium text-surface-800">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="input"
      />
    </label>
  )
}
