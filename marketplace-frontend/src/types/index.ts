// Shared TypeScript types mirroring backend DTOs

export interface AuthResponse {
  id: number
  name: string
  email: string
  role: 'BUYER' | 'SELLER' | 'ADMIN'
  token: string
  shopName?: string
}

export interface ProductResponse {
  id: number
  name: string
  description: string
  price: number
  stockQty: number
  status: string
  categoryId: number
  categoryName: string
  sellerId: number
  sellerName: string
  shopName?: string
  imageUrls: string[]
  averageRating?: number
  reviewCount: number
  createdAt: string
}

export interface CartItemResponse {
  productId: number
  productName: string
  imageUrl?: string
  unitPrice: number
  quantity: number
  subtotal: number
  availableStock: number
}

export interface CartResponse {
  items: CartItemResponse[]
  total: number
  itemCount: number
}

export interface OrderItemResponse {
  productId: number
  productName: string
  imageUrl?: string
  quantity: number
  unitPrice: number
  subtotal: number
  sellerName: string
  shopName?: string
}

export interface OrderResponse {
  id: number
  status: 'PLACED' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURN_APPROVED' | 'EXCHANGE_REQUESTED'
  paymentStatus: string
  paymentMethod?: string
  totalAmount: number
  shippingAddress: string
  customerPhone?: string
  customerEmail?: string
  cancelReason?: string
  returnStatus?: string
  cardLastFour?: string
  createdAt: string
  updatedAt: string
  items: OrderItemResponse[]
}

export interface ReviewResponse {
  id: number
  buyerId: number
  buyerName: string
  rating: number
  comment?: string
  createdAt: string
}

export interface CategoryResponse {
  id: number
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentId?: number
  children: CategoryResponse[]
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface DashboardResponse {
  totalRevenue: number
  revenueThisMonth: number
  totalOrders: number
  pendingOrders: number
  activeProducts: number
  topProducts: TopProduct[]
}

export interface TopProduct {
  productId: number
  productName: string
  totalQtySold: number
  revenue: number
}
