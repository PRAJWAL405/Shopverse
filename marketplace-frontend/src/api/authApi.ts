import api from './axiosInstance'
import type { AuthResponse } from '../types'

export const authApi = {
  register: (data: {
    name: string; email: string; password: string
    role: string; shopName?: string; shopDescription?: string
  }) => api.post<AuthResponse>('/auth/register', data).then(r => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then(r => r.data),

  logout: () => api.post('/auth/logout'),
}
