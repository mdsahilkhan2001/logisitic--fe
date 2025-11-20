import React from 'react'
import { Link } from 'react-router-dom'
import { useGetProductsQuery } from '../../features/catalog/catalogApiSlice'
import ProtectedActionButton from '../common/ProtectedActionButton'

const SellerDashboard = () => {
  const { data: products, isLoading } = useGetProductsQuery()
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Seller Dashboard</h1>
      <div className="flex items-center gap-4 mb-6">
        <Link to="products" className="btn btn-primary bg-blue-600 text-white px-3 py-2 rounded">Manage Products</Link>
        <ProtectedActionButton className="btn bg-green-600 text-white px-3 py-2 rounded" onClick={() => { /* future discount flow */ }}>
          Create Offer (Coming Soon)
        </ProtectedActionButton>
      </div>
      <h2 className="text-xl font-medium mb-2">Your Products</h2>
      {isLoading && <p>Loading...</p>}
      <div className="grid md:grid-cols-3 gap-4">
        {products?.map(p => (
          <div key={p.id} className="border rounded p-3 shadow bg-white">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
            <p className="mt-2 font-medium">${p.price}</p>
          </div>
        ))}
        {!isLoading && products?.length === 0 && (
          <p className="text-gray-500">No products yet. Add your first one.</p>
        )}
      </div>
    </div>
  )
}

export default SellerDashboard
