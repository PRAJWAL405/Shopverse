import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Package, CheckCircle2, Truck, MapPin, RotateCcw,
  ArrowLeftRight, XCircle, ChevronDown, ChevronUp, ShoppingBag
} from 'lucide-react'
import { orderApi } from '../api/orderApi'

type ModalType = 'cancel' | 'return' | 'exchange' | null

const CANCEL_REASONS = [
  'Changed my mind',
  'Ordered by mistake / Duplicate order',
  'Wrong delivery address',
  'Found a better price elsewhere',
  'Product no longer needed',
  'Delay in delivery',
  'Other',
]
const RETURN_REASONS = [
  'Received wrong product',
  'Product is damaged / defective',
  'Product does not match description',
  'Missing accessories or parts',
  'Poor quality',
  'Other',
]
const EXCHANGE_REASONS = [
  'Wrong size / color received',
  'Product is defective',
  'Want a different variant',
  'Received wrong product',
  'Other',
]

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

const statusColor: Record<string, string> = {
  PLACED: 'status-PLACED',
  CONFIRMED: 'status-CONFIRMED',
  SHIPPED: 'status-SHIPPED',
  DELIVERED: 'status-DELIVERED',
  CANCELLED: 'status-CANCELLED',
  RETURN_REQUESTED: 'status-CANCELLED',
  RETURN_APPROVED: 'status-CONFIRMED',
  EXCHANGE_REQUESTED: 'status-SHIPPED',
}

const statusLabel: Record<string, string> = {
  PLACED: 'Order Placed',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURN_REQUESTED: 'Return Requested',
  RETURN_APPROVED: 'Return Approved',
  EXCHANGE_REQUESTED: 'Exchange Requested',
}

const paymentLabel: Record<string, string> = {
  UPI: '📱 UPI',
  NET_BANKING: '🏦 Net Banking',
  COD: '💵 Cash on Delivery',
}

export const BuyerOrders = () => {
  const queryClient = useQueryClient()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [modal, setModal] = useState<{ type: ModalType; orderId: number } | null>(null)
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => orderApi.myOrders()
  })

  const cancelMut = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => orderApi.cancel(id, reason),
    onSuccess: () => {
      toast.success('Order cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['myOrders'] })
      setModal(null)
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Cancel failed')
  })

  const returnMut = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => orderApi.requestReturn(id, reason),
    onSuccess: () => {
      toast.success('Return/Refund request submitted!')
      queryClient.invalidateQueries({ queryKey: ['myOrders'] })
      setModal(null)
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Request failed')
  })

  const exchangeMut = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => orderApi.requestExchange(id, reason),
    onSuccess: () => {
      toast.success('Exchange request submitted!')
      queryClient.invalidateQueries({ queryKey: ['myOrders'] })
      setModal(null)
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Request failed')
  })

  const handleAction = () => {
    if (!modal) return
    const reason = selectedReason === 'Other' ? customReason.trim() : selectedReason
    if (!reason) return toast.error('Please select a reason')
    if (modal.type === 'cancel') cancelMut.mutate({ id: modal.orderId, reason })
    if (modal.type === 'return') returnMut.mutate({ id: modal.orderId, reason })
    if (modal.type === 'exchange') exchangeMut.mutate({ id: modal.orderId, reason })
  }

  const openModal = (type: ModalType, orderId: number) => {
    setSelectedReason('')
    setCustomReason('')
    setModal({ type, orderId })
  }

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  const orders = data?.content || []

  return (
    <div className="container page animate-in">
      <h1 className="section-title mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={64} className="mx-auto mb-3 text-surface-3" />
          <h3>No orders yet</h3>
          <p className="mt-2 mb-3">Looks like you haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex-col gap-4">
          {orders.map(order => {
            const isExpanded = expandedId === order.id
            const stepIdx = STATUS_STEPS.indexOf(order.status)
            const isCancelled = ['CANCELLED', 'RETURN_REQUESTED', 'RETURN_APPROVED', 'EXCHANGE_REQUESTED'].includes(order.status)

            return (
              <div key={order.id} className="card p-0">
                {/* Order Header */}
                <div className="card-header bg-surface-2 flex justify-between items-center flex-wrap gap-2 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <div className="text-xs text-muted">Order #{order.id}</div>
                      <div className="font-bold">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">Total</div>
                      <div className="font-bold text-primary-light">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">Payment</div>
                      <div className="text-sm">{paymentLabel[order.paymentMethod || ''] || order.paymentMethod}</div>
                    </div>
                    <span className={`badge ${statusColor[order.status] || ''}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </div>
                  <div className="text-muted">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 flex-col gap-4">
                    {/* Progress Stepper */}
                    {!isCancelled && (
                      <div className="flex items-center gap-0 mb-2">
                        {STATUS_STEPS.map((step, idx) => (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex-col items-center text-center" style={{ minWidth: 70 }}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto ${
                                idx <= stepIdx ? 'bg-primary text-white' : 'bg-surface-3 text-muted'
                              }`}>
                                {idx < stepIdx ? <CheckCircle2 size={16} /> : idx + 1}
                              </div>
                              <div className={`text-xs mt-1 ${idx <= stepIdx ? 'text-primary font-bold' : 'text-muted'}`}>
                                {statusLabel[step]}
                              </div>
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 ${idx < stepIdx ? 'bg-primary' : 'bg-surface-3'}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Items */}
                    <div className="flex-col gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center p-3 bg-surface-2 rounded-lg">
                          <img src={item.imageUrl || ''} className="w-16 h-16 rounded-lg object-cover bg-surface-3" />
                          <div className="flex-1">
                            <Link to={`/products/${item.productId}`} className="font-bold hover:text-primary">{item.productName}</Link>
                            <div className="text-sm text-muted">Sold by: {item.shopName || item.sellerName}</div>
                            <div className="text-sm">Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}</div>
                          </div>
                          <div className="font-bold text-primary-light">₹{item.subtotal.toLocaleString('en-IN')}</div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-start gap-2 text-sm text-muted p-3 bg-surface-2 rounded-lg">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="font-bold text-white mb-1">Delivery Address</div>
                        <div style={{ whiteSpace: 'pre-line' }}>{order.shippingAddress}</div>
                        {order.customerPhone && <div className="mt-1">📞 {order.customerPhone}</div>}
                      </div>
                    </div>

                    {/* Cancel reason if cancelled */}
                    {order.status === 'CANCELLED' && order.cancelReason && (
                      <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm">
                        <span className="text-danger font-bold">Cancellation Reason: </span>{order.cancelReason}
                      </div>
                    )}
                    {order.returnStatus && (
                      <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm">
                        <span className="text-warning font-bold">Return/Exchange: </span>{order.returnStatus}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {(order.status === 'PLACED' || order.status === 'CONFIRMED') && (
                        <button className="btn btn-sm btn-ghost text-danger flex items-center gap-1"
                          onClick={() => openModal('cancel', order.id)}>
                          <XCircle size={14} /> Cancel Order
                        </button>
                      )}
                      {order.status === 'DELIVERED' && (
                        <>
                          <button className="btn btn-sm btn-ghost text-warning flex items-center gap-1"
                            onClick={() => openModal('return', order.id)}>
                            <RotateCcw size={14} /> Return / Refund
                          </button>
                          <button className="btn btn-sm btn-ghost text-primary flex items-center gap-1"
                            onClick={() => openModal('exchange', order.id)}>
                            <ArrowLeftRight size={14} /> Exchange
                          </button>
                        </>
                      )}
                      {order.status === 'SHIPPED' && (
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <Truck size={16} className="text-primary" />
                          Your order is on the way! Expected delivery in 2–3 days.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Action Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-1">
              {modal.type === 'cancel' && '❌ Cancel Order'}
              {modal.type === 'return' && '↩️ Request Return / Refund'}
              {modal.type === 'exchange' && '🔄 Request Exchange'}
            </h3>
            <p className="text-sm text-muted mb-4">
              {modal.type === 'cancel' && 'Please tell us why you want to cancel this order.'}
              {modal.type === 'return' && 'Please select a reason. Refunds are processed within 5–7 business days.'}
              {modal.type === 'exchange' && 'Please select a reason. Our team will contact you within 48 hours.'}
            </p>

            <div className="form-group mb-3">
              <label className="form-label">Reason</label>
              <select value={selectedReason} onChange={e => setSelectedReason(e.target.value)}>
                <option value="">-- Select a reason --</option>
                {(modal.type === 'cancel' ? CANCEL_REASONS :
                  modal.type === 'return' ? RETURN_REASONS : EXCHANGE_REASONS
                ).map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {selectedReason === 'Other' && (
              <div className="form-group mb-3">
                <label className="form-label">Please describe</label>
                <textarea rows={3} value={customReason} onChange={e => setCustomReason(e.target.value)}
                  placeholder="Tell us more..." />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Go Back</button>
              <button
                className={`btn ${modal.type === 'cancel' ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleAction}
                disabled={cancelMut.isPending || returnMut.isPending || exchangeMut.isPending}
              >
                {cancelMut.isPending || returnMut.isPending || exchangeMut.isPending ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
