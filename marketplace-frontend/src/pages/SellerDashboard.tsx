import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { IndianRupee, Package, TrendingUp, AlertCircle } from 'lucide-react'
import { sellerApi } from '../api/productApi'

export const SellerDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['sellerDashboard'],
    queryFn: sellerApi.dashboard
  })

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="container page animate-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="section-title">Seller Dashboard</h1>
        <Link to="/seller/products/new" className="btn btn-primary">Add New Product</Link>
      </div>

      <div className="stats-grid mb-4">
        <div className="dash-stat">
          <div className="dash-stat__label">Total Revenue</div>
          <div className="dash-stat__value text-primary-light">
          ₹{stats?.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="dash-stat__icon bg-primary/20 text-primary-light absolute top-4 right-4"><IndianRupee /></div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">Pending Orders</div>
          <div className="dash-stat__value text-warning">{stats?.pendingOrders}</div>
          <div className="dash-stat__icon bg-warning/20 text-warning absolute top-4 right-4"><AlertCircle /></div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label">Active Products</div>
          <div className="dash-stat__value text-success">{stats?.activeProducts}</div>
          <div className="dash-stat__icon bg-success/20 text-success absolute top-4 right-4"><Package /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center gap-2">
          <TrendingUp size={20} className="text-primary-light" />
          <h3 className="font-bold">Top Performing Products</h3>
        </div>
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topProducts.length === 0 && (
                <tr><td colSpan={3} className="text-center text-muted">No sales data yet.</td></tr>
              )}
              {stats?.topProducts.map(tp => (
                <tr key={tp.productId}>
                  <td className="font-bold">{tp.productName}</td>
                  <td>{tp.totalQtySold}</td>
                  <td className="text-success">₹{tp.revenue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
