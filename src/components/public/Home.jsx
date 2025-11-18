import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaShoppingBag, FaShippingFast, FaCheckCircle, FaUsers, FaArrowRight } from 'react-icons/fa'

const Home = () => {
  const features = [
    {
      icon: FaShoppingBag,
      title: 'Quality Products',
      description: 'Premium garments manufactured with finest materials',
      color: 'bg-blue-500'
    },
    {
      icon: FaShippingFast,
      title: 'Fast Delivery',
      description: 'Global shipping with reliable logistics partners',
      color: 'bg-green-500'
    },
    {
      icon: FaCheckCircle,
      title: 'Quality Assurance',
      description: 'Rigorous quality control at every production stage',
      color: 'bg-purple-500'
    },
    {
      icon: FaUsers,
      title: 'Expert Team',
      description: 'Experienced designers and manufacturing professionals',
      color: 'bg-orange-500'
    },
  ]

  const stats = [
    { number: '500+', label: 'Happy Clients' },
    { number: '50K+', label: 'Orders Completed' },
    { number: '15+', label: 'Countries Served' },
    { number: '98%', label: 'Satisfaction Rate' },
  ]

  const testimonials = [
    {
      name: 'John Smith',
      company: 'Fashion Retail Inc.',
      text: 'Outstanding quality and timely delivery. Been working with them for 3 years!',
      rating: 5
    },
    {
      name: 'Maria Garcia',
      company: 'Style Boutique',
      text: 'Professional team, excellent communication, and top-notch products.',
      rating: 5
    },
    {
      name: 'David Chen',
      company: 'Global Apparel',
      text: 'Best wholesale garment supplier we have found. Highly recommended!',
      rating: 5
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.png')] bg-repeat"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Premium Wholesale Garment Exports
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Your trusted partner for quality apparel manufacturing and global distribution
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition text-center">
                  Browse Products
                </Link>
                <Link to="/contact" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition text-center">
                  Get Quote
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80" 
                alt="Garments" 
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide end-to-end garment manufacturing and export solutions with unmatched quality and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center hover:shadow-xl transition-shadow"
                >
                  <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-primary-600 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Products</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Wide range of high-quality garments for every need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', items: '50+ Designs' },
              { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', items: '40+ Styles' },
              { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80', items: '60+ Collections' },
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{product.items}</p>
                  <Link to="/products" className="text-primary-600 font-medium flex items-center space-x-2 hover:space-x-3 transition-all">
                    <span>View All</span>
                    <FaArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/products" className="btn-primary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-gray-600 dark:text-gray-400">
              What our clients say about us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join hundreds of satisfied clients worldwide. Contact us today for a custom quote!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition">
              Contact Us
            </Link>
            <Link to="/login" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition">
              Client Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
