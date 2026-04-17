import { useState } from 'react'
import BackButton from '../components/common/BackButton'
import { toast } from 'react-toastify'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
]

export default function PaymentPage({ selectedTemplate, templatesMeta, onBack, onSuccess }) {
  const [method, setMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [cardNo, setCardNo] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [bank, setBank] = useState('')
  const [paying, setPaying] = useState(false)

  const fee = templatesMeta?.fee ?? 500
  const gst = Math.round(fee * 0.18)
  const total = fee + gst + 50 // 50 platform fee

  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  const handlePay = () => {
    if (method === 'upi' && !upiId.includes('@')) { toast.error('Enter a valid UPI ID'); return }
    if (method === 'card' && (cardNo.replace(/\s/g, '').length < 16 || !expiry || cvv.length < 3 || !cardName)) {
      toast.error('Fill all card details'); return
    }
    if (method === 'netbanking' && !bank) { toast.error('Select a bank'); return }

    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      toast.success('Payment successful! Generating notarized document...')
      onSuccess()
    }, 2200)
  }

  return (
    <div className="w-full max-w-2xl space-y-5">
      <BackButton onClick={onBack} label="Back to Preview" />

      {/* Order summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#351159] to-purple-700 px-5 py-4">
          <p className="text-white font-bold text-sm">Order Summary</p>
          <p className="text-purple-200 text-xs mt-0.5">{selectedTemplate?.title}</p>
        </div>
        <div className="p-5 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Notarization Fee</span>
            <span>₹{fee}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Platform Fee</span>
            <span>₹50</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span className="text-indigo-600">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Payment method selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="font-semibold text-gray-800 text-sm mb-4">Select Payment Method</p>

        <div className="flex gap-3 mb-5">
          {PAYMENT_METHODS.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${method === m.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              <span className="text-xl">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* UPI */}
        {method === 'upi' && (
          <div className="space-y-3">
            <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">📱</div>
              <div>
                <p className="text-xs font-semibold text-indigo-700">Pay via UPI</p>
                <p className="text-xs text-indigo-500">Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">UPI ID</label>
              <input value={upiId} onChange={e => setUpiId(e.target.value)}
                placeholder="yourname@upi" className="input-field" />
            </div>
          </div>
        )}

        {/* Card */}
        {method === 'card' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
              <input value={cardNo} onChange={e => setCardNo(formatCard(e.target.value))}
                placeholder="1234 5678 9012 3456" maxLength={19} className="input-field font-mono tracking-widest" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name on Card</label>
              <input value={cardName} onChange={e => setCardName(e.target.value)}
                placeholder="Full name" className="input-field" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry</label>
                <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY" maxLength={5} className="input-field" />
              </div>
              <div className="w-28">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="•••" maxLength={3} type="password" className="input-field" />
              </div>
            </div>
            {/* Card preview */}
            {cardNo && (
              <div className="rounded-xl p-4 text-white text-xs font-mono"
                style={{ background: 'linear-gradient(135deg, #351159 0%, #6d28d9 100%)' }}>
                <p className="text-purple-300 text-xs mb-3">DEBIT / CREDIT CARD</p>
                <p className="text-base tracking-[0.2em] mb-3">{cardNo || '•••• •••• •••• ••••'}</p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-purple-300 text-xs">CARD HOLDER</p>
                    <p>{cardName || 'YOUR NAME'}</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-xs">EXPIRES</p>
                    <p>{expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Net Banking */}
        {method === 'netbanking' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">Select your bank</p>
            <div className="grid grid-cols-2 gap-2">
              {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'PNB'].map(b => (
                <button key={b} onClick={() => setBank(b)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all text-left ${bank === b ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  🏦 {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Security note */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          256-bit SSL encrypted · Your payment info is never stored
        </div>

        {/* Pay button */}
        <button onClick={handlePay} disabled={paying}
          className="btn-primary mt-5 py-3 text-sm flex items-center justify-center gap-2">
          {paying ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Processing Payment...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Pay ₹{total} & Notarize
            </>
          )}
        </button>
      </div>
    </div>
  )
}
