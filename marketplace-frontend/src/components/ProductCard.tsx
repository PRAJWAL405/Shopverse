import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { ProductResponse } from '../types'

interface Props {
  product: ProductResponse
}

export const ProductCard = ({ product }: Props) => {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__image">
        {product.imageUrls?.length > 0 ? (
          <img src={product.imageUrls[0]} alt={product.name} loading="lazy" />
        ) : (
          <div className="text-muted">No Image</div>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__category">{product.categoryName}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price">₹{product.price.toLocaleString('en-IN')}</div>
        
        <div className="product-card__meta">
          <div className="product-card__rating">
            <Star size={14} fill="currentColor" />
            <span>{product.averageRating ? product.averageRating.toFixed(1) : 'New'}</span>
            <span className="text-muted">({product.reviewCount})</span>
          </div>
          <div className="product-card__shop">{product.shopName}</div>
        </div>
      </div>
    </Link>
  )
}
