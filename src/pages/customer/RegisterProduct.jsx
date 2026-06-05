import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, BadgeCheck, Loader2, PackageCheck, Search } from 'lucide-react'
import api from '../../api/axios'

function productInfoFromLookup(lookup) {
  return lookup?.product_information || {}
}

export default function RegisterProduct() {
  const navigate = useNavigate()
  const [piece, setPiece] = useState('')
  const [lookup, setLookup] = useState(null)
  const [loadingLookup, setLoadingLookup] = useState(false)
  const [registering, setRegistering] = useState(false)

  const cleanPiece = piece.trim()
  const product = productInfoFromLookup(lookup)
  const canRegister = lookup && !lookup.is_registered

  const handleLookup = async (event) => {
    event.preventDefault()
    if (!cleanPiece) {
      toast.error('Enter a piece number')
      return
    }

    setLoadingLookup(true)
    setLookup(null)
    try {
      const response = await api.get(`/pieces/lookup/${encodeURIComponent(cleanPiece)}`)
      setLookup(response.data)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Piece not found')
    } finally {
      setLoadingLookup(false)
    }
  }

  const handleRegister = async () => {
    if (!canRegister) return

    setRegistering(true)
    try {
      const response = await api.post('/warranty/register', { piece: cleanPiece })
      const registeredPiece = response.data.registration?.piece || cleanPiece
      toast.success('Warranty registered')
      navigate(`/customer/product/${encodeURIComponent(registeredPiece)}`)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-surface-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Customer</p>
          <h1 className="mt-2 text-3xl font-bold text-surface-950">Register Product</h1>
        </div>
        <Link to="/customer/my-products" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          My Products
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleLookup} className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <label htmlFor="piece" className="mb-2 block text-sm font-medium text-surface-800">
            Piece number
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="piece"
              value={piece}
              onChange={(event) => setPiece(event.target.value)}
              className="input"
              placeholder="Enter piece number"
              disabled={loadingLookup || registering}
            />
            <button type="submit" disabled={loadingLookup || registering} className="btn-primary sm:min-w-32">
              {loadingLookup ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </button>
          </div>
        </form>

        <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <PackageCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-surface-900">Registration Status</p>
              <p className="text-sm text-surface-500">{lookup ? lookup.piece : 'No piece selected'}</p>
            </div>
          </div>
          {lookup && (
            <div className="mt-4">
              <span
                className={`inline-block rounded-full border px-3 py-1 text-sm font-medium ${
                  lookup.is_registered
                    ? 'border-danger-100 bg-danger-50 text-danger-700'
                    : 'border-success-100 bg-success-50 text-success-700'
                }`}
              >
                {lookup.is_registered ? 'Registered' : 'Available'}
              </span>
              <p className="mt-2 text-sm text-surface-600">
                {lookup.is_registered ? 'Already registered' : 'Available for registration'}
              </p>
            </div>
          )}
        </div>
      </div>

      {lookup && (
        <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-surface-950">{product.item_name || 'Product'}</h2>
              <p className="mt-1 text-sm text-surface-500">Piece: {lookup.piece}</p>
            </div>
            <button onClick={handleRegister} disabled={!canRegister || registering} className="btn-primary">
              {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
              Register Warranty
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Item Code" value={product.i_code} />
            <Info label="Bill" value={product.bill} />
            <Info label="Dealer" value={lookup.dealer_information?.name} />
            <Info label="Distributor" value={lookup.distributor_information?.name} />
          </div>
        </div>
      )}
    </section>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-surface-200 bg-surface-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-surface-900">{value || 'N/A'}</p>
    </div>
  )
}
