import { Link } from 'react-router-dom'
import { Star, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ProductResponse } from '../types'

interface Props {
  product: ProductResponse
  index?: number
}

const calcEmi = (price: number, months: number, ratePerMonth = 1.5) => {
  const r = ratePerMonth / 100
  return Math.round((price * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1))
}

export const ProductCard = ({ product, index = 0 }: Props) => {
  const showEmi = product.price >= 5000
  const emiAmt = showEmi ? calcEmi(product.price, 12) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/products/${product.id}`} className="product-card">
        <div className="product-card__image">
          {product.imageUrls?.length > 0 ? (
            <img src={product.imageUrls[0]} alt={product.name} loading="lazy" />
          ) : (
            <div className="text-muted text-xs uppercase">No Image</div>
          )}

          <div
            style={{
              position: 'absolute', top: 12, left: 12, zIndex: 2,
              padding: '0.3rem 0.65rem',
              background: 'rgba(12,12,12,0.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(245,241,234,0.12)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--clr-text)', fontWeight: 500,
            }}
          >
            {product.categoryName}
          </div>

          <div
            className="quick-cta"
            style={{
              position: 'absolute', bottom: 12, right: 12, zIndex: 2,
              width: 38, height: 38, borderRadius: '999px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--clr-ivory, #f5f1ea)', color: '#0c0c0c',
              opacity: 0, transform: 'translateY(8px)',
              transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="product-card__price">₹{product.price.toLocaleString('en-IN')}</div>
            {showEmi && (
              <div className="product-card__emi">
                <span className="emi-badge">EMI</span>
                <span>₹{emiAmt.toLocaleString('en-IN')}/mo</span>
              </div>
            )}
          </div>

          <div className="product-card__meta">
            <div className="product-card__rating">
              <Star size={13} fill="currentColor" />
              <span>{product.averageRating ? product.averageRating.toFixed(1) : 'New'}</span>
              <span className="text-muted">({product.reviewCount})</span>
            </div>
            <div className="product-card__shop">{product.shopName}</div>
          </div>
        </div>
      </Link>

      <style>{`
        .product-card:hover .quick-cta { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </motion.div>
  )
}
