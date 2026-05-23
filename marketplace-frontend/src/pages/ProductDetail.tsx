import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ShoppingCart, Star, ShieldCheck, Truck, Clock } from 'lucide-react'
import { productApi } from '../api/productApi'
import { cartApi } from '../api/cartApi'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setCart } from '../store/slices/cartSlice'

export const ProductDetail = () => {
  const { id } = useParams()
  const { isAuthenticated, user } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [qty, setQty] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getOne(Number(id)),
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => productApi.getReviews(Number(id)),
  })

  const cartMut = useMutation({
    mutationFn: () => cartApi.add(Number(id), qty),
    onSuccess: (data) => {
      dispatch(setCart(data))
      toast.success('Added to cart!')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add')
  })

  const reviewMut = useMutation({
    mutationFn: () => productApi.addReview(Number(id), { rating, comment: reviewText }),
    onSuccess: () => {
      toast.success('Review added!')
      setReviewText('')
      queryClient.invalidateQueries({ queryKey: ['reviews', id] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add review')
  })

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>
  if (!product) return <div className="empty-state">Product not found</div>

  return (
    <div className="container page">
      <div className="flex gap-4 items-start flex-wrap lg:flex-nowrap">
        {/* Images */}
        <div className="w-full lg:w-1/2">
          <div className="bg-surface-3 rounded-xl overflow-hidden aspect-square border border-border flex items-center justify-center">
            {product.imageUrls.length > 0 ? (
              <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-muted">No Image</span>
            )}
          </div>
          {/* Thumbnail gallery would go here */}
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 flex-col gap-3 animate-in">
          <div>
            <div className="badge badge-primary mb-2">{product.categoryName}</div>
            <h1 className="hero__title" style={{ fontSize: '2.5rem' }}>{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-warning">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill={i <= (product.averageRating || 0) ? 'currentColor' : 'none'} className={i > (product.averageRating || 0) ? 'star-empty' : ''} />)}
              </div>
              <span className="font-bold">{product.averageRating?.toFixed(1) || 'New'}</span>
              <span className="text-muted">({product.reviewCount} reviews)</span>
              <span className="text-muted">|</span>
              <span className="text-muted">Sold by <span className="text-primary font-bold">{product.shopName}</span></span>
            </div>
          </div>

          <div className="text-3xl font-display font-bold text-primary-light">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-muted leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>

          <div className="divider" />

          {product.stockQty > 0 ? (
            <div className="flex-col gap-3 p-4 bg-surface-2 border border-border rounded-lg">
              <div className="flex items-center gap-2 font-bold text-success">
                <ShieldCheck size={20} /> In Stock ({product.stockQty} available)
              </div>
              <div className="flex gap-2">
                <select value={qty} onChange={e => setQty(Number(e.target.value))} className="w-24">
                  {[...Array(Math.min(10, product.stockQty))].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
                <button 
                  className="btn btn-primary flex-1 justify-center"
                  onClick={() => isAuthenticated ? cartMut.mutate() : navigate('/login')}
                  disabled={cartMut.isPending}
                >
                  <ShoppingCart size={18} /> {cartMut.isPending ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger font-bold text-center">
              Currently Out of Stock
            </div>
          )}

          <div className="flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted"><Truck size={16} /> Free shipping on orders over $50</div>
            <div className="flex items-center gap-2 text-sm text-muted"><Clock size={16} /> 30-day return policy</div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-4 pt-4 border-t border-border">
        <h2 className="section-title mb-3">Customer Reviews</h2>
        
        {isAuthenticated && user?.role === 'BUYER' && (
          <div className="card mb-4 p-4">
            <h4 className="font-bold mb-2">Write a review</h4>
            <div className="form-group mb-2">
              <div className="flex gap-1 text-warning cursor-pointer">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={24} fill={i <= rating ? 'currentColor' : 'none'} onClick={() => setRating(i)} />
                ))}
              </div>
            </div>
            <textarea 
              rows={3} placeholder="Share your thoughts about this product..."
              value={reviewText} onChange={e => setReviewText(e.target.value)}
              className="mb-2"
            />
            <button className="btn btn-primary" onClick={() => reviewMut.mutate()} disabled={reviewMut.isPending}>
              {reviewMut.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}

        <div className="flex-col gap-3">
          {reviews?.content.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews?.content.map(r => (
              <div key={r.id} className="p-4 bg-surface-2 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold">{r.buyerName}</div>
                  <div className="text-sm text-muted">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex text-warning mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= r.rating ? 'currentColor' : 'none'} className={i > r.rating ? 'star-empty' : ''} />)}
                </div>
                <p className="text-muted">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
