import api from './axiosInstance'
import type { CartResponse } from '../types'

export const cartApi = {
  get: () => api.get<CartResponse>('/cart').then(r => r.data),
  add: (productId: number, quantity: number) =>
    api.post<CartResponse>('/cart/items', { productId, quantity }).then(r => r.data),
  update: (productId: number, quantity: number) =>
    api.put<CartResponse>(`/cart/items/${productId}`, { productId, quantity }).then(r => r.data),
  remove: (productId: number) =>
    api.delete<CartResponse>(`/cart/items/${productId}`).then(r => r.data),
  clear: () => api.delete('/cart'),
}
