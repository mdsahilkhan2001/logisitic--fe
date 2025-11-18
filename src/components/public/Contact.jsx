import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaWhatsapp, FaLinkedin, FaFacebook } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      })
      setLoading(false)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Address',
      details: ['123 Export Street', 'Mumbai, Maharashtra 400001', 'India']
    },
    {
      icon: FaPhone,
      title: 'Phone',
      details: ['+91 1234567890', '+91 9876543210']
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['info@garmentexport.com', 'sales@garmentexport.com']
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 1:00 PM', 'Sunday: Closed']
    },
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
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Get in touch with us for all your garment export needs
          </motion.p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <select
                    className="input-field"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="quote">Request Quote</option>
                    <option value="sample">Sample Request</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    className="input-field"
                    rows="6"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="card">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-lg">
                          <Icon className="text-2xl text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-bold mb-2">{info.title}</h3>
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-gray-600 dark:text-gray-400 text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Social Media */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                    <FaFacebook className="text-xl" />
                  </a>
                  <a href="#" className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a href="#" className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="card p-0 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.082522318252567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is your minimum order quantity (MOQ)?',
                a: 'Our MOQ varies by product type. Generally, it ranges from 100 to 500 pieces. Contact us for specific product MOQs.'
              },
              {
                q: 'How long does production take?',
                a: 'Production time typically ranges from 4-8 weeks depending on order size and complexity. Rush orders can be accommodated.'
              },
              {
                q: 'Do you offer samples?',
                a: 'Yes, we provide samples for approval before bulk production. Sample costs are refundable on confirmed orders.'
              },
              {
                q: 'What payment terms do you accept?',
                a: 'We accept various payment terms including LC, T/T, and PayPal. Flexible payment options available for long-term partners.'
              },
              {
                q: 'Do you ship internationally?',
                a: 'Yes, we ship to over 15 countries worldwide with reliable logistics partners.'
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
