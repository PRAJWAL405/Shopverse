import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '../api/authApi'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'BUYER', shopName: '', shopDescription: ''
  })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const regMut = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      dispatch(setCredentials(data))
      toast.success('Account created!')
      if (data.role === 'SELLER') navigate('/seller/dashboard')
      else navigate('/')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    regMut.mutate(formData)
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <div className="auth-logo">
          <h2 className="hero__title" style={{ fontSize: '2rem' }}>Join <span>ShopVerse</span></h2>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-col gap-3">
          <div className="form-group">
            <label className="form-label">I want to...</label>
            <select 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="BUYER">Buy products</option>
              <option value="SELLER">Sell products</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required minLength={6} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          {formData.role === 'SELLER' && (
            <>
              <div className="divider" />
              <div className="form-group">
                <label className="form-label">Shop Name</label>
                <input type="text" required value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Shop Description</label>
                <textarea rows={2} value={formData.shopDescription} onChange={e => setFormData({...formData, shopDescription: e.target.value})} />
              </div>
            </>
          )}
          
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={regMut.isPending}>
            {regMut.isPending ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center mt-3 text-sm text-muted">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
