import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, BadgeCheck, CheckCircle2, Loader2, PackageCheck, Search, Shield } from 'lucide-react'
import api from '../../api/axios'

function productInfoFromLookup(lookup) {
  return lookup?.product_information || {}
}

function indiaToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const value = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]))
  return `${value.year}-${value.month}-${value.day}`
}

export default function RegisterProduct() {
  const navigate = useNavigate()
  const [piece, setPiece] = useState('')
  const [dealerBillNumber, setDealerBillNumber] = useState('')
  const dealerBillDate = indiaToday()
  const [lookup, setLookup] = useState(null)
  const [loadingLookup, setLoadingLookup] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [termsData, setTermsData] = useState(null)
  const [loadingTerms, setLoadingTerms] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const cleanPiece = piece.trim()
  const product = productInfoFromLookup(lookup)
  const hasTerms = Boolean(termsData?.terms?.length)
  const hasDealerBill = Boolean(dealerBillNumber.trim() && dealerBillDate)
  const canRegister = lookup && lookup.warranty_eligible && !lookup.is_registered && hasDealerBill && (!hasTerms || termsAccepted)

  const handleLookup = async (event) => {
    event.preventDefault()
    if (!cleanPiece) {
      toast.error('Enter a piece number')
      return
    }
    if (!dealerBillNumber.trim()) {
      toast.error('Enter the dealer bill number')
      return
    }

    setLoadingLookup(true)
    setLookup(null)
    setTermsData(null)
    setTermsAccepted(false)
    try {
      const response = await api.get(`/pieces/lookup/${encodeURIComponent(cleanPiece)}`)
      setLookup(response.data)

      if (!response.data.is_registered && response.data.warranty_eligible) {
        setLoadingTerms(true)
        try {
          const termsResponse = await api.get(`/warranty/terms/${encodeURIComponent(cleanPiece)}`)
          setTermsData(termsResponse.data)
        } catch (termsError) {
          const detail = termsError.response?.data?.detail || 'Could not load warranty terms'
          toast.error(detail)
        } finally {
          setLoadingTerms(false)
        }
      }
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
      const response = await api.post('/warranty/register', {
        piece: cleanPiece,
        dealer_bill_number: dealerBillNumber.trim(),
        dealer_bill_date: dealerBillDate,
        terms_accepted: hasTerms ? termsAccepted : false,
      })
      toast.success(response.data.message || 'Registration request submitted for admin approval')
      navigate('/customer/my-products')
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
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-surface-800">Piece number</span>
            <input
              id="piece"
              value={piece}
              onChange={(event) => setPiece(event.target.value)}
              className="input"
              placeholder="Enter piece number"
              disabled={loadingLookup || registering}
            />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-surface-800">Dealer bill number</span>
              <input value={dealerBillNumber} onChange={(event) => setDealerBillNumber(event.target.value)} className="input" placeholder="Bill from dealer" disabled={loadingLookup || registering} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-surface-800">Dealer bill date</span>
              <input type="date" value={dealerBillDate} className="input cursor-not-allowed bg-surface-100" readOnly aria-readonly="true" />
            </label>
          </div>
          <p className="mt-3 text-xs text-surface-500">Enter the dealer invoice number. The bill date and warranty start date are fixed to today and cannot be changed.</p>
          <div className="mt-4">
            <button type="submit" disabled={loadingLookup || registering || !cleanPiece || !hasDealerBill} className="btn-primary sm:min-w-32">
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
                  lookup.is_registered || !lookup.warranty_eligible
                    ? 'border-danger-100 bg-danger-50 text-danger-700'
                    : 'border-success-100 bg-success-50 text-success-700'
                }`}
              >
                {lookup.is_registered ? 'Registered' : lookup.warranty_eligible ? 'Available' : 'Manual handling'}
              </span>
              <p className="mt-2 text-sm text-surface-600">
                {lookup.is_registered ? 'Already registered' : lookup.warranty_eligible ? 'Available for registration' : lookup.warranty_eligibility_message}
              </p>
              {!lookup.is_registered && !lookup.warranty_eligible && (
                <Link to={`/customer/enquiry?piece=${encodeURIComponent(lookup.piece)}`} className="btn-primary mt-4">
                  Raise Enquiry
                </Link>
              )}
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
              {product.category && (
                <p className="mt-1 text-sm text-surface-500">
                  Category: <span className="font-medium text-surface-700">{product.category}</span>
                  {product.product_type && <> &middot; Type: <span className="font-medium text-surface-700">{product.product_type}</span></>}
                  {product.size && <> &middot; Size: <span className="font-medium text-surface-700">{product.size}</span></>}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Item Code" value={product.i_code} />
            <Info label="Dealer Bill Number" value={dealerBillNumber} />
            <Info label="Dealer Bill Date" value={dealerBillDate ? new Date(`${dealerBillDate}T00:00:00`).toLocaleDateString('en-IN') : null} />
            <Info label="Dealer" value={lookup.dealer_information?.name} />
          </div>
        </div>
      )}

      {lookup && !lookup.is_registered && lookup.warranty_eligible && (
        <>
          {loadingTerms && (
            <div className="flex items-center justify-center rounded-lg border border-surface-200 bg-white p-8 shadow-sm">
              <Loader2 className="h-6 w-6 animate-spin text-brand-700" />
              <span className="ml-3 text-sm text-surface-600">Loading warranty terms...</span>
            </div>
          )}

          {termsData && termsData.terms && termsData.terms.length > 0 && (
            <div className="rounded-lg border border-brand-200 bg-brand-50/30 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-brand-700" />
                <div>
                  <h3 className="text-lg font-semibold text-surface-950">Warranty Terms &amp; Conditions</h3>
                  <p className="text-sm text-surface-600">
                    Category: <span className="font-medium">{termsData.category}</span> &middot;
                    Duration: <span className="font-medium">{termsData.warranty_months} months</span>
                  </p>
                </div>
              </div>

              <ol className="space-y-2 pl-1">
                {termsData.terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-3 rounded-lg bg-white p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <span className="text-sm text-surface-800">{term}</span>
                  </li>
                ))}
              </ol>

              <label className="mt-5 flex items-center gap-3 rounded-lg border border-surface-200 bg-white p-4 cursor-pointer hover:bg-surface-50 transition-colors">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-5 w-5 rounded border-surface-300 text-brand-600"
                />
                <span className="text-sm font-medium text-surface-900">
                  I have read and agree to the warranty terms and conditions
                </span>
              </label>

              <div className="mt-4">
                <button onClick={handleRegister} disabled={!canRegister || registering} className="btn-primary">
                  {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                  Submit for Approval
                </button>
              </div>
            </div>
          )}

          {termsData && (!termsData.terms || termsData.terms.length === 0) && (
            <div className="rounded-lg border border-surface-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-surface-600 mb-4">
                No specific warranty terms found for this category. You can proceed with registration.
              </p>
              <button onClick={handleRegister} disabled={!canRegister || registering} className="btn-primary">
                {registering ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                Register Warranty
              </button>
            </div>
          )}
        </>
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
