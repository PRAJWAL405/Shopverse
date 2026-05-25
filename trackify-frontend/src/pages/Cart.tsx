import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { cartApi } from '../api/cartApi'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setCart } from '../store/slices/cartSlice'

export const Cart = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const cart = useAppSelector(s => s.cart.cart)

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
  })

  useEffect(() => {
    if (data) dispatch(setCart(data))
  }, [data, dispatch])

  const updateMut = useMutation({
    mutationFn: ({ id, qty }: { id: number, qty: number }) => cartApi.update(id, qty),
    onSuccess: (d) => dispatch(setCart(d))
  })

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container page empty-state">
        <ShoppingBag size={64} className="mx-auto mb-2 text-surface-3" />
        <h2 className="section-title">Your cart is empty</h2>
        <p className="mt-2 mb-3">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container page animate-in">
      <h1 className="section-title mb-4">Shopping Cart</h1>
      
      <div className="checkout-grid">
        <div className="flex-col gap-2">
          {cart.items.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.imageUrl || ''} alt={item.productName} className="cart-item__img" />
              <div>
                <Link to={`/products/${item.productId}`} className="font-bold hover:text-primary">{item.productName}</Link>
                <div className="text-primary-light font-bold mt-1">₹{item.unitPrice.toLocaleString('en-IN')}</div>
                {item.quantity > item.availableStock && (
                  <div className="text-danger text-sm mt-1">Only {item.availableStock} left in stock!</div>
                )}
              </div>
              <div className="flex-col items-end gap-2">
                <div className="cart-qty">
                  <button className="cart-qty__btn" onClick={() => updateMut.mutate({ id: item.productId, qty: item.quantity - 1 })}>-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button className="cart-qty__btn" onClick={() => updateMut.mutate({ id: item.productId, qty: item.quantity + 1 })} disabled={item.quantity >= item.availableStock}>+</button>
                </div>
                <button 
                  className="btn btn-ghost btn-sm text-danger flex items-center gap-1"
                  onClick={() => updateMut.mutate({ id: item.productId, qty: 0 })}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h3 className="font-display font-bold text-xl mb-3">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span className="text-muted">Subtotal ({cart.itemCount} items)</span>
            <span className="font-bold">₹{cart.total.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-muted">Shipping</span>
            <span className="text-success font-bold">Free</span>
          </div>
          <div className="divider" />
          <div className="flex justify-between mb-4 text-xl">
            <span className="font-bold">Total</span>
            <span className="font-bold text-primary-light">₹{cart.total.toLocaleString('en-IN')}</span>
          </div>
          
          <button 
            className="btn btn-primary w-full justify-center btn-lg"
            onClick={() => navigate('/checkout')}
            disabled={cart.items.some(i => i.quantity > i.availableStock)}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
          {cart.items.some(i => i.quantity > i.availableStock) && (
            <p className="text-danger text-sm text-center mt-2">Please adjust quantities to match available stock before checking out.</p>
          )}
        </div>
      </div>
    </div>
  )
}
