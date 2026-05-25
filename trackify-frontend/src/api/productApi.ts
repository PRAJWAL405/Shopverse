import api from './axiosInstance'
import type { ProductResponse, PageResponse, ReviewResponse, CategoryResponse } from '../types'

export const productApi = {
  browse: (params: {
    categoryId?: number; keyword?: string
    minPrice?: number; maxPrice?: number
    page?: number; size?: number; sort?: string
  }) => api.get<PageResponse<ProductResponse>>('/products', { params }).then(r => r.data),

  featured: () => api.get<ProductResponse[]>('/products/featured').then(r => r.data),

  getOne: (id: number) => api.get<ProductResponse>(`/products/${id}`).then(r => r.data),

  getReviews: (id: number, page = 0, size = 10) =>
    api.get<PageResponse<ReviewResponse>>(`/products/${id}/reviews`, { params: { page, size } }).then(r => r.data),

  addReview: (id: number, data: { rating: number; comment?: string }) =>
    api.post<ReviewResponse>(`/products/${id}/reviews`, data).then(r => r.data),

  getCategories: () => api.get<CategoryResponse[]>('/categories').then(r => r.data),
}

export const sellerApi = {
  dashboard: () => api.get('/seller/dashboard').then(r => r.data),

  myProducts: (page = 0, size = 12) =>
    api.get<PageResponse<ProductResponse>>('/seller/products', { params: { page, size } }).then(r => r.data),

  create: (data: {
    name: string; description?: string; price: number
    stockQty: number; categoryId: number; status?: string
  }) => api.post<ProductResponse>('/seller/products', data).then(r => r.data),

  update: (id: number, data: object) =>
    api.put<ProductResponse>(`/seller/products/${id}`, data).then(r => r.data),

  delete: (id: number) => api.delete(`/seller/products/${id}`),

  uploadImages: (id: number, files: File[]) => {
    const fd = new FormData()
    files.forEach(f => fd.append('files', f))
    return api.post<ProductResponse>(`/seller/products/${id}/images`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data)
  },

  myOrders: (page = 0, size = 10) =>
    api.get('/seller/orders', { params: { page, size } }).then(r => r.data),

  updateOrderStatus: (id: number, status: string) =>
    api.patch(`/seller/orders/${id}/status`, null, { params: { status } }).then(r => r.data),
}
