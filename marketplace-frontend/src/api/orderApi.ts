import api from './axiosInstance'
import type { OrderResponse, PageResponse } from '../types'

export const orderApi = {
  checkout: (data: {
    fullName: string; email: string; phone: string
    street: string; city: string; state: string; pincode: string
    paymentMethod: 'UPI' | 'NET_BANKING' | 'COD'
    upiId?: string; bankName?: string
  }) => api.post<OrderResponse>('/orders/checkout', data).then(r => r.data),

  myOrders: (page = 0, size = 10) =>
    api.get<PageResponse<OrderResponse>>('/orders', { params: { page, size } }).then(r => r.data),

  getOne: (id: number) => api.get<OrderResponse>(`/orders/${id}`).then(r => r.data),

  cancel: (id: number, reason: string) =>
    api.post<OrderResponse>(`/orders/${id}/cancel`, { reason }).then(r => r.data),

  requestReturn: (id: number, reason: string) =>
    api.post<OrderResponse>(`/orders/${id}/return`, { reason }).then(r => r.data),

  requestExchange: (id: number, reason: string) =>
    api.post<OrderResponse>(`/orders/${id}/exchange`, { reason }).then(r => r.data),
}
