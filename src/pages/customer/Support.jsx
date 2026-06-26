import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Headset, Mail, Phone, UserRound } from 'lucide-react'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function Support() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function fetchContacts() {
      try {
        const response = await api.get('/support/contacts')
        if (active) setContacts(response.data.contacts || [])
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to load support contacts')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchContacts()
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <LoadingSpinner text="Loading support" />
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-surface-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Customer</p>
        <h1 className="mt-2 text-3xl font-bold text-surface-950">Support</h1>
        <p className="mt-1 text-sm text-surface-500">Reach out to our support team for help with your products and warranty.</p>
      </div>

      {contacts.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <UserRound className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-surface-950">{contact.name}</p>
                  {contact.title && <p className="text-xs text-surface-500">{contact.title}</p>}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-surface-700 hover:text-brand-700">
                    <Phone className="h-4 w-4 text-surface-400" />{contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-surface-700 hover:text-brand-700">
                    <Mail className="h-4 w-4 text-surface-400" />{contact.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-surface-300 bg-white p-10 text-center shadow-sm">
          <Headset className="mx-auto h-10 w-10 text-surface-400" />
          <p className="mt-4 text-sm font-medium text-surface-900">Support contacts are not available yet.</p>
          <p className="mt-1 text-sm text-surface-500">Please check back later.</p>
        </div>
      )}
    </section>
  )
}
