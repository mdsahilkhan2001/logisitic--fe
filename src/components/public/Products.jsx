import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaShoppingCart } from 'react-icons/fa'

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'tshirts', name: 'T-Shirts' },
    { id: 'shirts', name: 'Shirts' },
    { id: 'dresses', name: 'Dresses' },
    { id: 'jeans', name: 'Jeans' },
    { id: 'jackets', name: 'Jackets' },
  ]

  const products = [
    {
      id: 1,
      name: 'Classic Cotton T-Shirt',
      category: 'tshirts',
      price: '$5.99',
      moq: '500 pieces',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
      colors: 5,
      sizes: 'S-XXL'
    },
    {
      id: 2,
      name: 'Formal Business Shirt',
      category: 'shirts',
      price: '$12.99',
      moq: '300 pieces',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80',
      colors: 4,
      sizes: 'S-XL'
    },
    {
      id: 3,
      name: 'Summer Dress Collection',
      category: 'dresses',
      price: '$18.99',
      moq: '200 pieces',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80',
      colors: 6,
      sizes: 'XS-L'
    },
    {
      id: 4,
      name: 'Slim Fit Jeans',
      category: 'jeans',
      price: '$15.99',
      moq: '400 pieces',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
      colors: 3,
      sizes: '28-38'
    },
    {
      id: 5,
      name: 'Leather Jacket',
      category: 'jackets',
      price: '$45.99',
      moq: '100 pieces',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
      colors: 4,
      sizes: 'S-XXL'
    },
    {
      id: 6,
      name: 'V-Neck T-Shirt',
      category: 'tshirts',
      price: '$6.99',
      moq: '500 pieces',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80',
      colors: 7,
      sizes: 'S-XXL'
    },
    {
      id: 7,
      name: 'Casual Linen Shirt',
      category: 'shirts',
      price: '$14.99',
      moq: '250 pieces',
      image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80',
      colors: 5,
      sizes: 'S-XL'
    },
    {
      id: 8,
      name: 'Evening Gown',
      category: 'dresses',
      price: '$35.99',
      moq: '150 pieces',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80',
      colors: 4,
      sizes: 'XS-L'
    },
    {
      id: 9,
      name: 'Denim Jacket',
      category: 'jackets',
      price: '$28.99',
      moq: '200 pieces',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80',
      colors: 2,
      sizes: 'S-XXL'
    },
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Our Products</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Browse our extensive collection of premium wholesale garments
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 px-4 bg-white dark:bg-dark-card shadow sticky top-16 z-40">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="input-field pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-dark-bg hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="card overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-dark-card px-3 py-1 rounded-full text-sm font-bold text-primary-600">
                      {product.price}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{product.name}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex justify-between">
                        <span>MOQ:</span>
                        <span className="font-medium">{product.moq}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Colors:</span>
                        <span className="font-medium">{product.colors} options</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sizes:</span>
                        <span className="font-medium">{product.sizes}</span>
                      </div>
                    </div>

                    <button className="w-full btn-primary flex items-center justify-center space-x-2">
                      <FaShoppingCart />
                      <span>Request Quote</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500 mb-4">No products found</p>
              <p className="text-gray-400">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 text-blue-100">
            We offer custom manufacturing services. Contact us with your requirements!
          </p>
          <a href="/contact" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-block">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}

export default Products
