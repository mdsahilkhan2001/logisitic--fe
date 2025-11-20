import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../../features/catalog/catalogApiSlice'

const emptyForm = { name: '', description: '', price: '' }

const ManageProducts = () => {
  const { data: products, isLoading } = useGetProductsQuery()
  const [createProduct, { isLoading: creating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const reset = () => { setForm(emptyForm); setEditingId(null) }

  const submit = async e => {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price || 0) }
    try {
      if (editingId) {
        await updateProduct({ id: editingId, ...payload }).unwrap()
        toast.success('Product updated')
      } else {
        await createProduct(payload).unwrap()
        toast.success('Product created')
      }
      reset()
    } catch (err) {
      const message = err?.data?.detail || 'Unable to save product'
      toast.error(message)
    }
  }

  const startEdit = p => {
    setEditingId(p.id)
    setForm({ name: p.name, description: p.description, price: String(p.price) })
  }

  const remove = async id => {
    if (!window.confirm('Delete product?')) return
    try {
      await deleteProduct(id).unwrap()
      toast.success('Product deleted')
    } catch (err) {
      const message = err?.data?.detail || 'Unable to delete product'
      toast.error(message)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Manage Products</h1>
      <form onSubmit={submit} className="space-y-3 mb-8 max-w-md">
        <input name="name" value={form.name} onChange={onChange} placeholder="Name" className="w-full border rounded px-2 py-1" required />
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border rounded px-2 py-1" rows={3} />
        <input name="price" value={form.price} onChange={onChange} placeholder="Price" type="number" step="0.01" className="w-full border rounded px-2 py-1" required />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60" disabled={creating || updating}>
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && <button type="button" onClick={reset} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>}
        </div>
      </form>

      <h2 className="text-xl font-medium mb-2">Existing Products</h2>
      {isLoading && <p>Loading...</p>}
      <div className="space-y-3">
        {products?.map(p => (
          <div key={p.id} className="border rounded p-3 flex justify-between items-start bg-white">
            <div>
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="mt-1 font-medium">${p.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => remove(p.id)} className="bg-red-600 text-white px-2 py-1 rounded disabled:opacity-60" disabled={deleting}>Delete</button>
            </div>
          </div>
        ))}
        {!isLoading && products?.length === 0 && <p className="text-gray-500">No products yet.</p>}
      </div>
    </div>
  )
}

export default ManageProducts
