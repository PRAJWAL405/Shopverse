import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, User, Store, LogOut, Package, Search } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import { authApi } from '../api/authApi'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const cart = useAppSelector((state) => state.cart.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try { await authApi.logout() } catch (e) {}
    dispatch(logout())
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const isLinkActive = (path: string) => location.pathname === path

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="navbar"
      style={{
        background: scrolled ? 'rgba(12,12,12,0.82)' : 'rgba(12,12,12,0.55)',
        borderBottomColor: scrolled ? 'rgba(245,241,234,0.12)' : 'rgba(245,241,234,0.05)',
      }}
    >
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">ShopVerse</Link>

        <form className="navbar__search flex items-center gap-2" onSubmit={handleSearch}>
          <div className="flex items-center gap-2 w-full" style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 14, color: 'var(--clr-text-muted)' }} />
            <input
              type="text"
              placeholder="Search the collection"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
        </form>

        <div className="navbar__nav">
          <Link to="/products" className={`navbar__link ${isLinkActive('/products') ? 'active' : ''}`}>Shop</Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'BUYER' && (
                <>
                  <Link to="/orders" className={`navbar__link ${isLinkActive('/orders') ? 'active' : ''}`}>
                    <Package size={16} className="inline mr-1" /> Orders
                  </Link>
                  <Link to="/cart" className="navbar__link navbar__cart-badge flex items-center">
                    <ShoppingBag size={18} />
                    {cart && cart.itemCount > 0 && <span className="navbar__badge">{cart.itemCount}</span>}
                  </Link>
                </>
              )}
              {user?.role === 'SELLER' && (
                <Link to="/seller/dashboard" className={`navbar__link ${location.pathname.startsWith('/seller') ? 'active' : ''}`}>
                  <Store size={16} className="inline mr-1" /> Studio
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to="/admin/users" className={`navbar__link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                  <User size={16} className="inline mr-1" /> Admin
                </Link>
              )}
              <button onClick={handleLogout} className="navbar__link" aria-label="Logout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm ml-2">Join</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
