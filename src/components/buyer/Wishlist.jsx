import { motion } from 'framer-motion'
import { FaHeart, FaShoppingCart, FaTrashAlt, FaStore } from 'react-icons/fa'
import { useGetWishlistQuery, useRemoveWishlistItemMutation } from '@/features/catalog/catalogApiSlice'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Wishlist = () => {
  const { data: wishlist, isLoading, isFetching } = useGetWishlistQuery()
  const [removeWishlistItem, { isLoading: removing }] = useRemoveWishlistItemMutation()

  const items = wishlist || []

  const handleRemove = async (productId) => {
    try {
      await removeWishlistItem(productId).unwrap()
      toast.success('Removed from wishlist')
    } catch (error) {
      const message = error?.data?.detail || 'Unable to remove product'
      toast.error(message)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Save the items you love and move them to your cart whenever you are ready.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
        >
          <FaStore />
          <span>Browse Products</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-pink-50 dark:bg-pink-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
          <p className="text-3xl font-bold text-pink-600">{items.length}</p>
        </div>
        <div className="card bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">Ready to Order</p>
          <p className="text-3xl font-bold text-blue-600">{items.filter((i) => i.product?.stock).length}</p>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">In Stock</p>
          <p className="text-3xl font-bold text-purple-600">{items.filter((i) => (i.product?.stock || 0) > 0).length}</p>
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="card py-16 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-3 text-gray-500">Loading your wishlist...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card py-16 text-center">
          <FaHeart className="text-5xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No favourites yet</h2>
          <p className="text-gray-500 mb-4">
            Add styles from the catalogue to keep them handy for quick ordering.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
          >
            <FaStore />
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((entry, index) => (
            <motion.div
              key={entry.product?.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="w-full md:w-40 h-40 bg-gray-100 dark:bg-dark-bg rounded-lg overflow-hidden flex items-center justify-center">
                {entry.product?.image ? (
                  <img
                    src={entry.product.image}
                    alt={entry.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaHeart className="text-4xl text-pink-500" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{entry.product?.name || 'Unnamed product'}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.product?.description || 'No description available.'}
                    </p>
                  </div>
                  <span className="text-sm font-medium bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                    Saved
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span><strong>Price:</strong> {entry.product?.price ? `${entry.product.price} ${entry.product.currency}` : 'N/A'}</span>
                  <span><strong>Stock:</strong> {(entry.product?.stock ?? 0) > 0 ? `${entry.product.stock} pcs` : 'Out of stock'}</span>
                  <span><strong>Added:</strong> {entry.added_at ? new Date(entry.added_at).toLocaleDateString() : 'Recently'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-40">
                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-primary-100 text-primary-600 hover:bg-primary-200 transition"
                >
                  <FaShoppingCart />
                  <span>Add to Cart</span>
                </Link>
                <button
                  onClick={() => handleRemove(entry.product?.id)}
                  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-60"
                  disabled={removing}
                >
                  <FaTrashAlt />
                  <span>Remove</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
