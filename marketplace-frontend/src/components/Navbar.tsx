import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Store, LogOut, Package, Search, Menu } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import { authApi } from '../api/authApi'
import { useState } from 'react'

export const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const cart = useAppSelector((state) => state.cart.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (e) {} // ignore error, clear local state anyway
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
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">ShopVerse</Link>

        <form className="navbar__search flex items-center gap-2" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-icon">
            <Search size={18} />
          </button>
        </form>

        <div className="navbar__nav">
          <Link to="/products" className={`navbar__link ${isLinkActive('/products') ? 'active' : ''}`}>Browse</Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'BUYER' && (
                <>
                  <Link to="/orders" className={`navbar__link ${isLinkActive('/orders') ? 'active' : ''}`}>
                    <Package size={18} className="inline mr-1" /> Orders
                  </Link>
                  <Link to="/cart" className="navbar__link navbar__cart-badge flex items-center">
                    <ShoppingCart size={18} />
                    {cart && cart.itemCount > 0 && <span className="navbar__badge">{cart.itemCount}</span>}
                  </Link>
                </>
              )}
              {user?.role === 'SELLER' && (
                <Link to="/seller/dashboard" className={`navbar__link ${location.pathname.startsWith('/seller') ? 'active' : ''}`}>
                  <Store size={18} className="inline mr-1" /> Dashboard
                </Link>
              )}
               {user?.role === 'ADMIN' && (
                <Link to="/admin/users" className={`navbar__link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                  <User size={18} className="inline mr-1" /> Admin
                </Link>
              )}
              <button onClick={handleLogout} className="navbar__link text-danger">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm ml-2">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
