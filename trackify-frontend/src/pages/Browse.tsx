import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productApi } from '../api/productApi'
import { ProductCard } from '../components/ProductCard'
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react'

export const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const categoryId = searchParams.get('category')
  const sort = searchParams.get('sort') || 'newest'
  
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const { data: categories } = useQuery({ queryKey: ['cats'], queryFn: productApi.getCategories })
  
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['products', keyword, categoryId, minPrice, maxPrice, sort],
    queryFn: () => productApi.browse({ 
      keyword, 
      categoryId: categoryId ? Number(categoryId) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort
    })
  })

  const updateParam = (key: string, value: string) => {
    if (value) searchParams.set(key, value)
    else searchParams.delete(key)
    setSearchParams(searchParams)
  }

  return (
    <div className="container page">
      <div className="browse-layout">
        {/* Filters Sidebar */}
        <aside className="filter-panel flex-col gap-3">
          <div className="flex items-center gap-2 font-bold mb-1">
            <SlidersHorizontal size={18} /> Filters
          </div>

          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select value={sort} onChange={e => updateParam('sort', e.target.value)}>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="divider" />

          <div className="form-group">
            <label className="form-label">Categories</label>
            <ul className="flex-col gap-1 mt-1">
              <li>
                <button 
                  className={`text-left w-full text-sm ${!categoryId ? 'text-primary font-bold' : 'text-muted hover:text-white'}`}
                  onClick={() => updateParam('category', '')}
                >
                  All Categories
                </button>
              </li>
              {categories?.map(c => (
                <li key={c.id}>
                  <button 
                    className={`text-left w-full text-sm flex items-center justify-between ${categoryId === String(c.id) ? 'text-primary font-bold' : 'text-muted hover:text-white'}`}
                    onClick={() => updateParam('category', String(c.id))}
                  >
                    {c.name} {c.children.length > 0 && <ChevronRight size={14} />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="divider" />

          <div className="form-group">
            <label className="form-label">Price Range</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
          </div>
        </aside>

        {/* Results */}
        <main>
          <div className="section-header mb-3">
            <h1 className="section-title">
              {keyword ? `Results for "${keyword}"` : 'Browse Products'}
            </h1>
            <span className="text-muted">{pageData?.totalElements || 0} items found</span>
          </div>

          {isLoading ? (
            <div className="products-grid">
              {[...Array(12)].map((_, i) => <div key={i} className="skeleton" style={{ height: 300 }} />)}
            </div>
          ) : pageData?.content.length === 0 ? (
            <div className="empty-state">
              <Search size={48} className="mx-auto mb-2 text-surface-3" />
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="products-grid animate-in">
              {pageData?.content.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
