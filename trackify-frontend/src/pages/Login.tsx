import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '../api/authApi'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const loginMut = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(setCredentials(data))
      toast.success('Welcome back!')
      if (data.role === 'SELLER') navigate('/seller/dashboard')
      else if (data.role === 'ADMIN') navigate('/admin/users')
      else navigate('/')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMut.mutate({ email, password })
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <div className="auth-logo">
          <h2 className="hero__title" style={{ fontSize: '2rem' }}><span>ShopVerse</span></h2>
          <p className="text-muted mt-1">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-col gap-3">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loginMut.isPending}>
            {loginMut.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center mt-3 text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
