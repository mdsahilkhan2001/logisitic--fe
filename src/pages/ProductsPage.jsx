import { useGetProductsQuery, useAddWishlistItemMutation, useRemoveWishlistItemMutation, useGetWishlistQuery } from '@/features/catalog/catalogApiSlice';
import ProtectedActionButton from '@/components/common/ProtectedActionButton';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/common/Loader';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const { data: products, isLoading: loadingProducts } = useGetProductsQuery();
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !useAuth().isAuthenticated });
  const [addWishlist] = useAddWishlistItemMutation();
  const [removeWishlist] = useRemoveWishlistItemMutation();
  const { isAuthenticated, user } = useAuth();
  const [pending, setPending] = useState(null);

  const wishlistIds = new Set((wishlist || []).map(w => w.product.id));

  const toggleWishlist = async (productId) => {
    setPending(productId);
    try {
      if (wishlistIds.has(productId)) {
        await removeWishlist(productId).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await addWishlist(productId).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (e) {
      toast.error(e?.data?.detail || 'Wishlist action failed');
    } finally {
      setPending(null);
    }
  };

  if (loadingProducts) return <Loader />;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(products || []).map(p => (
          <div key={p.id} className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 flex flex-col">
            {p.image && (
              <img src={p.image} alt={p.name} className="h-40 object-cover rounded mb-3" />
            )}
            <h2 className="text-lg font-semibold mb-1">{p.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">{p.description || 'No description'}</p>
            <div className="mt-3 font-medium">{p.price} {p.currency}</div>
            <div className="mt-4 flex flex-col space-y-2">
              <ProtectedActionButton
                onAction={() => toast.success('Added to cart (demo)')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
              >
                Add to Cart
              </ProtectedActionButton>
              <ProtectedActionButton
                onAction={() => toggleWishlist(p.id)}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded text-sm font-medium"
              >
                {pending === p.id ? 'Please wait...' : wishlistIds.has(p.id) ? 'Remove Wishlist' : 'Add Wishlist'}
              </ProtectedActionButton>
              {user?.role === 'buyer' && (
                <ProtectedActionButton
                  onAction={() => toast.success('Order placed (demo)')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium"
                >
                  Buy Now
                </ProtectedActionButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
