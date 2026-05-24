import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Lock, CreditCard, Smartphone, Building2, Package, CheckCircle2 } from 'lucide-react'
import { orderApi } from '../api/orderApi'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { clearCartState } from '../store/slices/cartSlice'

type PaymentMethod = 'UPI' | 'NET_BANKING' | 'COD' | 'EMI'

const calcEmi = (price: number, months: number) => {
  const r = 1.5 / 100
  return Math.round((price * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1))
}

export const Checkout = () => {
  const cart = useAppSelector(s => s.cart.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD' as PaymentMethod,
    upiId: '',
    bankName: '',
    emiMonths: 12,
  })

  const checkoutMut = useMutation({
    mutationFn: () => orderApi.checkout({
      ...form,
      paymentMethod: form.paymentMethod,
    }),
    onSuccess: () => {
      dispatch(clearCartState())
      toast.success('🎉 Order placed successfully!')
      navigate('/orders')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Checkout failed')
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.paymentMethod === 'UPI' && !form.upiId.trim()) {
      return toast.error('Please enter your UPI ID')
    }
    if (form.paymentMethod === 'EMI' && !form.bankName) {
      return toast.error('Please select a bank for EMI')
    }
    checkoutMut.mutate()
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart')
    return null
  }

  const showEmi = cart.total >= 5000

  const paymentIcon = {
    UPI: <Smartphone size={18} className="text-primary" />,
    NET_BANKING: <Building2 size={18} className="text-primary" />,
    COD: <Package size={18} className="text-success" />,
    EMI: <CreditCard size={18} className="text-warning" />,
  }

  return (
    <div className="container page animate-in">
      <h1 className="section-title mb-4">Secure Checkout <Lock size={24} className="inline text-muted" /></h1>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="flex-col gap-4">

          {/* Section 1: Customer Info */}
          <div className="card p-4">
            <h3 className="font-display font-bold text-lg mb-3">1. Customer Information</h3>
            <div className="form-group mb-2">
              <label className="form-label">Full Name</label>
              <input required value={form.fullName} placeholder="Prajwal Kumar"
                onChange={e => setForm({...form, fullName: e.target.value})} />
            </div>
            <div className="flex gap-3">
              <div className="form-group flex-1 mb-2">
                <label className="form-label">Email</label>
                <input type="email" required value={form.email} placeholder="you@email.com"
                  onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group flex-1 mb-2">
                <label className="form-label">Phone Number</label>
                <input type="tel" required pattern="\d{10}" value={form.phone} placeholder="9876543210"
                  onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="card p-4">
            <h3 className="font-display font-bold text-lg mb-3">2. Delivery Address</h3>
            <div className="form-group mb-2">
              <label className="form-label">Street / House No.</label>
              <input required value={form.street} placeholder="123, MG Road, Apartment 4B"
                onChange={e => setForm({...form, street: e.target.value})} />
            </div>
            <div className="flex gap-3">
              <div className="form-group flex-1 mb-2">
                <label className="form-label">City</label>
                <input required value={form.city} placeholder="Bangalore"
                  onChange={e => setForm({...form, city: e.target.value})} />
              </div>
              <div className="form-group flex-1 mb-2">
                <label className="form-label">State</label>
                <input required value={form.state} placeholder="Karnataka"
                  onChange={e => setForm({...form, state: e.target.value})} />
              </div>
              <div className="form-group" style={{ width: '120px' }}>
                <label className="form-label">Pincode</label>
                <input required pattern="\d{6}" value={form.pincode} placeholder="560001"
                  onChange={e => setForm({...form, pincode: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Section 3: Payment */}
          <div className="card p-4">
            <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
              <CreditCard size={20} /> 3. Payment Method
            </h3>
            <div className="flex gap-3 mb-4 flex-wrap">
              {(['UPI', 'NET_BANKING', 'COD', ...(showEmi ? ['EMI'] : [])] as PaymentMethod[]).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm({...form, paymentMethod: method})}
                  className={`flex-1 p-3 rounded-lg border-2 flex flex-col items-center gap-2 text-sm font-bold transition-all ${
                    form.paymentMethod === method
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted hover:border-primary/40'
                  }`}
                  style={{ minWidth: '80px' }}
                >
                  {paymentIcon[method]}
                  {method === 'NET_BANKING' ? 'Net Banking' : method}
                  {method === 'EMI' && <span className="emi-badge" style={{ fontSize: '0.6rem' }}>No Cost*</span>}
                </button>
              ))}
            </div>

            {form.paymentMethod === 'UPI' && (
              <div className="form-group">
                <label className="form-label">UPI ID</label>
                <input value={form.upiId} placeholder="yourname@upi"
                  onChange={e => setForm({...form, upiId: e.target.value})} />
                <p className="text-xs text-muted mt-1">e.g., 9876543210@paytm or name@gpay</p>
              </div>
            )}
            {form.paymentMethod === 'NET_BANKING' && (
              <div className="form-group">
                <label className="form-label">Select Bank</label>
                <select value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})}>
                  <option value="">-- Choose your bank --</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                  <option>Punjab National Bank</option>
                  <option>Bank of Baroda</option>
                  <option>Yes Bank</option>
                </select>
              </div>
            )}
            {form.paymentMethod === 'COD' && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm flex items-center gap-2">
                <CheckCircle2 size={18} /> Cash on Delivery — Pay when your order arrives. No extra charges.
              </div>
            )}
            {form.paymentMethod === 'EMI' && (
              <div className="flex-col gap-3">
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm">
                  <div className="font-bold text-warning mb-1">📅 EMI Payment</div>
                  <p className="text-muted text-xs">EMI will be processed via your selected bank's credit/debit card. Interest charges may apply.</p>
                </div>
                <div className="flex gap-3">
                  <div className="form-group flex-1">
                    <label className="form-label">Select Bank</label>
                    <select value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})}>
                      <option value="">-- Choose bank --</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>SBI Card</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Yes Bank</option>
                      <option>Punjab National Bank</option>
                      <option>Bank of Baroda</option>
                    </select>
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">EMI Duration</label>
                    <select value={form.emiMonths} onChange={e => setForm({...form, emiMonths: Number(e.target.value)})}>
                      <option value={3}>3 Months — ₹{calcEmi(cart.total, 3).toLocaleString('en-IN')}/mo</option>
                      <option value={6}>6 Months — ₹{calcEmi(cart.total, 6).toLocaleString('en-IN')}/mo</option>
                      <option value={9}>9 Months — ₹{calcEmi(cart.total, 9).toLocaleString('en-IN')}/mo</option>
                      <option value={12}>12 Months — ₹{calcEmi(cart.total, 12).toLocaleString('en-IN')}/mo</option>
                    </select>
                  </div>
                </div>
                <div className="p-3 bg-surface-3 rounded-lg text-sm flex justify-between items-center">
                  <span className="text-muted">Monthly EMI</span>
                  <span className="font-bold text-warning text-lg">₹{calcEmi(cart.total, form.emiMonths).toLocaleString('en-IN')}/mo × {form.emiMonths}</span>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full justify-center" disabled={checkoutMut.isPending}>
            {checkoutMut.isPending ? 'Placing Order...' :
              form.paymentMethod === 'EMI'
                ? `Start EMI — ₹${calcEmi(cart.total, form.emiMonths).toLocaleString('en-IN')}/mo × ${form.emiMonths}`
                : `Place Order — ₹${cart.total.toLocaleString('en-IN')}`
            }
          </button>
        </form>

        {/* Order Summary */}
        <div className="order-summary">
          <h3 className="font-display font-bold text-xl mb-3">Order Summary</h3>
          <div className="flex-col gap-3 mb-3">
            {cart.items.map(item => (
              <div key={item.productId} className="flex gap-3 items-center">
                <img src={item.imageUrl || ''} alt={item.productName}
                  className="w-14 h-14 rounded-lg object-cover bg-surface-3" />
                <div className="flex-1">
                  <div className="font-bold text-sm">{item.productName}</div>
                  <div className="text-xs text-muted">Qty: {item.quantity}</div>
                </div>
                <div className="font-bold text-sm">₹{item.subtotal.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-muted">Subtotal ({cart.itemCount} items)</span>
            <span>₹{cart.total.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-muted">Delivery</span>
            <span className="text-success font-bold">FREE</span>
          </div>
          <div className="divider" />
          <div className="flex justify-between text-xl mt-3">
            <span className="font-bold">Total</span>
            <span className="font-bold text-primary-light">₹{cart.total.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-xs text-muted mt-3 text-center">
            🔒 100% secure checkout. Your data is encrypted.
          </p>
        </div>
      </div>
    </div>
  )
}
