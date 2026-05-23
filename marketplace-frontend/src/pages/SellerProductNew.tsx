import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { UploadCloud } from 'lucide-react'
import { productApi, sellerApi } from '../api/productApi'

export const SellerProductNew = () => {
  const navigate = useNavigate()
  const { data: categories } = useQuery({ queryKey: ['cats'], queryFn: productApi.getCategories })

  const [form, setForm] = useState({ name: '', description: '', price: '', stockQty: '', categoryId: '' })
  const [files, setFiles] = useState<File[]>([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: acc => setFiles(prev => [...prev, ...acc].slice(0, 5))
  })

  const createMut = useMutation({
    mutationFn: async () => {
      const p = await sellerApi.create({
        ...form,
        price: Number(form.price),
        stockQty: Number(form.stockQty),
        categoryId: Number(form.categoryId)
      })
      if (files.length > 0) {
        await sellerApi.uploadImages(p.id, files)
      }
      return p
    },
    onSuccess: () => {
      toast.success('Product created successfully')
      navigate('/seller/dashboard')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Creation failed')
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId) return toast.error('Please select a category')
    createMut.mutate()
  }

  return (
    <div className="container page animate-in" style={{ maxWidth: 800 }}>
      <h1 className="section-title mb-4">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="flex-col gap-4">
        <div className="card p-4 flex-col gap-3">
          <h3 className="font-bold">Basic Details</h3>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select required value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
              <option value="">Select Category</option>
              {categories?.flatMap(c => c.children).map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea rows={4} required value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <div className="form-group flex-1">
              <label className="form-label">Price ($)</label>
              <input type="number" step="0.01" min="0" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Initial Stock</label>
              <input type="number" min="0" required value={form.stockQty} onChange={e => setForm({...form, stockQty: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-bold mb-3">Product Images (Max 5)</h3>
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <UploadCloud size={40} className="mx-auto mb-2" />
            <p>Drag & drop images here, or click to select files</p>
          </div>
          {files.length > 0 && (
            <div className="flex gap-2 mt-3">
              {files.map((f, i) => (
                <div key={i} className="w-20 h-20 bg-surface-3 rounded overflow-hidden">
                  <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={createMut.isPending}>
          {createMut.isPending ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}
