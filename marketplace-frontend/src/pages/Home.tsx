import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, TrendingUp, ShieldCheck } from 'lucide-react'
import { productApi } from '../api/productApi'
import { ProductCard } from '../components/ProductCard'

export const Home = () => {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: productApi.featured,
  })

  return (
    <div>
      <section className="hero">
        <div className="container text-center flex-col items-center">
          <h1 className="hero__title animate-in">
            Discover <span>Extraordinary</span> Products
          </h1>
          <p className="hero__subtitle animate-in" style={{ animationDelay: '0.1s' }}>
            ShopVerse is the ultimate marketplace for unique, high-quality items from independent sellers worldwide.
          </p>
          <div className="flex gap-3 justify-center mt-4 animate-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">Become a Seller</Link>
          </div>
        </div>
      </section>

      <section className="page container">
        <div className="stats-grid mb-4">
          <div className="dash-stat text-center items-center">
            <div className="dash-stat__icon bg-primary/20 text-primary"><ShoppingBag /></div>
            <h3>10k+ Products</h3>
            <p className="text-muted text-sm">Curated items added daily</p>
          </div>
          <div className="dash-stat text-center items-center">
            <div className="dash-stat__icon bg-success/20 text-success"><ShieldCheck /></div>
            <h3>Secure Checkout</h3>
            <p className="text-muted text-sm">100% protected payments</p>
          </div>
          <div className="dash-stat text-center items-center">
            <div className="dash-stat__icon bg-accent/20 text-accent"><TrendingUp /></div>
            <h3>Top Sellers</h3>
            <p className="text-muted text-sm">Verified independent shops</p>
          </div>
        </div>

        <div className="section-header mt-4">
          <h2 className="section-title">Featured <span>Products</span></h2>
          <Link to="/products" className="text-primary hover:underline">View all</Link>
        </div>

        {isLoading ? (
          <div className="products-grid-lg">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320 }} />)}
          </div>
        ) : (
          <div className="products-grid-lg">
            {featured?.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
