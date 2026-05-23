import { useQuery } from '@tanstack/react-query'
import { Package } from 'lucide-react'
import { orderApi } from '../api/orderApi'

export const BuyerOrders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => orderApi.myOrders()
  })

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="container page animate-in">
      <h1 className="section-title mb-4">My Orders</h1>
      
      {data?.content.length === 0 ? (
        <div className="empty-state">
          <Package size={48} className="mx-auto mb-2 text-surface-3" />
          <h3>No orders yet</h3>
        </div>
      ) : (
        <div className="flex-col gap-4">
          {data?.content.map(order => (
            <div key={order.id} className="card p-0">
              <div className="card-header bg-surface-2 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <div className="text-sm text-muted">Order Placed</div>
                  <div className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Total</div>
                  <div className="font-bold">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted">Order ID</div>
                  <div className="font-mono">#{order.id}</div>
                </div>
                <div>
                  <span className={`badge status-${order.status}`}>{order.status}</span>
                </div>
              </div>
              <div className="p-4 flex-col gap-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <img src={item.imageUrl || ''} className="w-16 h-16 rounded object-cover bg-surface-3" />
                    <div className="flex-1">
                      <div className="font-bold">{item.productName}</div>
                      <div className="text-sm text-muted">Sold by: {item.shopName}</div>
                      <div className="text-sm">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold">₹{item.subtotal.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
