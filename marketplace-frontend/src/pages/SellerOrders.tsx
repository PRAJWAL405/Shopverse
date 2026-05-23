import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { sellerApi } from '../api/productApi'

export const SellerOrders = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['sellerOrders'],
    queryFn: () => sellerApi.myOrders()
  })

  const updateMut = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => sellerApi.updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success('Order status updated')
      queryClient.invalidateQueries({ queryKey: ['sellerOrders'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Update failed')
  })

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="container page animate-in">
      <h1 className="section-title mb-4">Manage Orders</h1>
      
      <div className="flex-col gap-4">
        {data?.content.length === 0 && <div className="text-muted text-center py-4">No orders received yet.</div>}
        {data?.content.map(order => (
          <div key={order.id} className="card p-0">
            <div className="card-header bg-surface-2 flex justify-between items-center">
              <div>
                <span className="text-muted mr-2">Order #{order.id}</span>
                <span className={`badge status-${order.status}`}>{order.status}</span>
              </div>
              <div>
                <select 
                  value={order.status} 
                  onChange={e => updateMut.mutate({ id: order.id, status: e.target.value })}
                  className="bg-surface border-border py-1 text-sm w-auto"
                  disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                >
                  <option value="PLACED">Placed</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-muted mb-2">Shipping Address: {order.shippingAddress}</div>
              <table className="table">
                <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
