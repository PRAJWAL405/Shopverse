import api from './axiosInstance'
import type { OrderResponse, PageResponse } from '../types'

export const orderApi = {
  checkout: (data: {
    shippingAddress: string
    cardNumber: string; expiryDate: string; cvv: string; cardHolderName: string
  }) => api.post<OrderResponse>('/orders/checkout', data).then(r => r.data),

  myOrders: (page = 0, size = 10) =>
    api.get<PageResponse<OrderResponse>>('/orders', { params: { page, size } }).then(r => r.data),

  getOne: (id: number) => api.get<OrderResponse>(`/orders/${id}`).then(r => r.data),

  cancel: (id: number) => api.post<OrderResponse>(`/orders/${id}/cancel`).then(r => r.data),
}
