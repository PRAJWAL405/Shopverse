import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Browse } from './pages/Browse'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { BuyerOrders } from './pages/BuyerOrders'
import { SellerDashboard } from './pages/SellerDashboard'
import { SellerOrders } from './pages/SellerOrders'
import { SellerProductNew } from './pages/SellerProductNew'
import { InfoPage } from './pages/InfoPage'

const AdminUsers = () => <div className="container page"><h1 className="section-title">Admin: User Management</h1><p>Not fully implemented in this demo.</p></div>

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info/*" element={<InfoPage />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/products" element={<Browse />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['BUYER']} />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<BuyerOrders />} />
        </Route>

        {/* Seller Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SELLER']} />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/products/new" element={<SellerProductNew />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
