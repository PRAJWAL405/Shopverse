import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Lock, CreditCard } from 'lucide-react'
import { orderApi } from '../api/orderApi'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { clearCartState } from '../store/slices/cartSlice'

export const Checkout = () => {
  const cart = useAppSelector(s => s.cart.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    shippingAddress: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  })

  const checkoutMut = useMutation({
    mutationFn: orderApi.checkout,
    onSuccess: (data) => {
      dispatch(clearCartState())
      toast.success('Order placed successfully!')
      navigate('/orders') // redirect to buyer orders
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Checkout failed')
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    checkoutMut.mutate(form)
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="container page animate-in">
      <h1 className="section-title mb-4">Secure Checkout <Lock size={24} className="inline text-muted" /></h1>
      
      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div className="card p-4">
            <h3 className="font-display font-bold text-lg mb-3">1. Shipping Information</h3>
            <div className="form-group">
              <label className="form-label">Full Address</label>
              <textarea 
                required rows={3} placeholder="Street, City, Zip, Country"
                value={form.shippingAddress} onChange={e => setForm({...form, shippingAddress: e.target.value})}
              />
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
              <CreditCard size={20} /> 2. Payment Method
            </h3>
            <p className="text-sm text-muted mb-3">
              Note: This is a simulated environment. The system randomly approves 80% of transactions.
            </p>
            <div className="form-group mb-2">
              <label className="form-label">Name on Card</label>
              <input type="text" required value={form.cardHolderName} onChange={e => setForm({...form, cardHolderName: e.target.value})} />
            </div>
            <div className="form-group mb-2">
              <label className="form-label">Card Number</label>
              <input type="text" required maxLength={16} pattern="\d{16}" placeholder="1234567812345678" value={form.cardNumber} onChange={e => setForm({...form, cardNumber: e.target.value})} />
            </div>
            <div className="flex gap-2">
              <div className="form-group flex-1">
                <label className="form-label">Expiry</label>
                <input type="text" required placeholder="MM/YY" pattern="\d{2}/\d{2}" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">CVV</label>
                <input type="text" required maxLength={4} pattern="\d{3,4}" placeholder="123" value={form.cvv} onChange={e => setForm({...form, cvv: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full justify-center" disabled={checkoutMut.isPending}>
            {checkoutMut.isPending ? 'Processing Payment...' : `Pay ₹${cart.total.toLocaleString('en-IN')}`}
          </button>
        </form>

        <div className="order-summary">
          <h3 className="font-display font-bold text-xl mb-3">Order Items</h3>
          <div className="flex-col gap-2 mb-3">
            {cart.items.map(item => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted">{item.quantity}x {item.productName}</span>
                <span>₹{item.subtotal.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="flex justify-between mb-2 text-xl">
            <span className="font-bold">Total</span>
            <span className="font-bold text-primary-light">₹{cart.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
