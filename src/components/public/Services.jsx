import { motion } from 'framer-motion'
import { 
  FaCut, FaPalette, FaShippingFast, FaCheckCircle, 
  FaIndustry, FaLeaf, FaHeadset, FaChartLine 
} from 'react-icons/fa'

const Services = () => {
  const services = [
    {
      icon: FaIndustry,
      title: 'Custom Manufacturing',
      description: 'End-to-end garment manufacturing tailored to your specifications',
      features: ['Custom designs', 'Flexible MOQ', 'Quality fabrics', 'Expert craftsmen']
    },
    {
      icon: FaPalette,
      title: 'Design Services',
      description: 'Professional design team to bring your vision to life',
      features: ['Tech pack creation', 'Sample development', 'Color consultation', 'Trend analysis']
    },
    {
      icon: FaCut,
      title: 'Pattern Making',
      description: 'Precise pattern development for perfect fit and consistency',
      features: ['Size grading', 'Fit testing', 'Pattern digitization', 'Modifications']
    },
    {
      icon: FaCheckCircle,
      title: 'Quality Control',
      description: 'Rigorous inspection at every stage of production',
      features: ['Fabric inspection', 'In-line checking', 'Final inspection', 'AQL standards']
    },
    {
      icon: FaLeaf,
      title: 'Sustainable Production',
      description: 'Eco-friendly manufacturing practices and materials',
      features: ['Organic fabrics', 'Water conservation', 'Waste reduction', 'Green certification']
    },
    {
      icon: FaShippingFast,
      title: 'Global Shipping',
      description: 'Reliable logistics and timely delivery worldwide',
      features: ['Air freight', 'Sea freight', 'Door delivery', 'Tracking system']
    },
    {
      icon: FaHeadset,
      title: 'Customer Support',
      description: '24/7 dedicated support for all your queries',
      features: ['Live chat', 'Email support', 'Phone support', 'Account manager']
    },
    {
      icon: FaChartLine,
      title: 'Business Analytics',
      description: 'Insights and reports to help grow your business',
      features: ['Sales reports', 'Trend analysis', 'Inventory tracking', 'Performance metrics']
    },
  ]

  const process = [
    { step: 1, title: 'Initial Consultation', description: 'Discuss your requirements and vision' },
    { step: 2, title: 'Design & Sampling', description: 'Create designs and approve samples' },
    { step: 3, title: 'Production', description: 'Manufacture with quality checks' },
    { step: 4, title: 'Quality Assurance', description: 'Final inspection and approval' },
    { step: 5, title: 'Packaging & Shipping', description: 'Secure packaging and delivery' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            Our Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Comprehensive garment manufacturing and export solutions for your business
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Complete end-to-end solutions for all your garment needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-xl transition-shadow"
                >
                  <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Icon className="text-3xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Simple and transparent workflow from concept to delivery
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {process.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="card text-center">
                    <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-300 -ml-3"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Why Choose Our Services?</h2>
              <div className="space-y-4">
                {[
                  'Industry experience of 15+ years',
                  'State-of-the-art manufacturing facility',
                  'Skilled workforce of 500+ professionals',
                  'ISO 9001:2015 certified operations',
                  'Competitive pricing with no hidden costs',
                  'On-time delivery guarantee',
                  'Flexible minimum order quantities',
                  '24/7 customer support'
                ].map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                    <span className="text-lg">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80" 
                alt="Manufacturing" 
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let's discuss how we can help bring your garment manufacturing vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition">
              Get Started
            </a>
            <a href="/products" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition">
              View Products
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services
import { motion } from 'framer-motion'
import { 
  FaCut, FaPalette, FaShippingFast, FaCheckCircle, 
  FaIndustry, FaLeaf, FaHeadset, FaChartLine 
} from 'react-icons/fa'

const Services = () => {
  const services = [
    {
      icon: FaIndustry,
      title: 'Custom Manufacturing',
      description: 'End-to-end garment manufacturing tailored to your specifications',
      features: ['Custom designs', 'Flexible MOQ', 'Quality fabrics', 'Expert craftsmen']
    },
    {
      icon: FaPalette,
      title: 'Design Services',
      description: 'Professional design team to bring your vision to life',
      features: ['Tech pack creation', 'Sample development', 'Color consultation', 'Trend analysis']
    },
    {
      icon: FaCut,
      title: 'Pattern Making',
      description: 'Precise pattern development for perfect fit and consistency',
      features: ['Size grading', 'Fit testing', 'Pattern digitization', 'Modifications']
    },
    {
      icon: FaCheckCircle,
      title: 'Quality Control',
      description: 'Rigorous inspection at every stage of production',
      features: ['Fabric inspection', 'In-line checking', 'Final inspection', 'AQL standards']
    },
    {
      icon: FaLeaf,
      title: 'Sustainable Production',
      description: 'Eco-friendly manufacturing practices and materials',
      features: ['Organic fabrics', 'Water conservation', 'Waste reduction', 'Green certification']
    },
    {
      icon: FaShippingFast,
      title: 'Global Shipping',
      description: 'Reliable logistics and timely delivery worldwide',
      features: ['Air freight', 'Sea freight', 'Door delivery', 'Tracking system']
    },
    {
      icon: FaHeadset,
      title: 'Customer Support',
      description: '24/7 dedicated support for all your queries',
      features: ['Live chat', 'Email support', 'Phone support', 'Account manager']
    },
    {
      icon: FaChartLine,
      title: 'Business Analytics',
      description: 'Insights and reports to help grow your business',
      features: ['Sales reports', 'Trend analysis', 'Inventory tracking', 'Performance metrics']
    },
  ]

  const process = [
    { step: 1, title: 'Initial Consultation', description: 'Discuss your requirements and vision' },
    { step: 2, title: 'Design & Sampling', description: 'Create designs and approve samples' },
    { step: 3, title: 'Production', description: 'Manufacture with quality checks' },
    { step: 4, title: 'Quality Assurance', description: 'Final inspection and approval' },
    { step: 5, title: 'Packaging & Shipping', description: 'Secure packaging and delivery' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            Our Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Comprehensive garment manufacturing and export solutions for your business
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Complete end-to-end solutions for all your garment needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-xl transition-shadow"
                >
                  <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Icon className="text-3xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Process</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Simple and transparent workflow from concept to delivery
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {process.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="card text-center">
                    <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-300 -ml-3"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Why Choose Our Services?</h2>
              <div className="space-y-4">
                {[
                  'Industry experience of 15+ years',
                  'State-of-the-art manufacturing facility',
                  'Skilled workforce of 500+ professionals',
                  'ISO 9001:2015 certified operations',
                  'Competitive pricing with no hidden costs',
                  'On-time delivery guarantee',
                  'Flexible minimum order quantities',
                  '24/7 customer support'
                ].map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                    <span className="text-lg">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80" 
                alt="Manufacturing" 
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let's discuss how we can help bring your garment manufacturing vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition">
              Get Started
            </a>
            <a href="/products" className="border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition">
              View Products
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services
