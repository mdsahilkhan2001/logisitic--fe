 import { Link } from 'react-router-dom'
import { 
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram, 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingBag 
} from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/products', label: 'Products' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ]

  const services = [
    'Custom Manufacturing',
    'Quality Control',
    'Global Shipping',
    'Design Services',
  ]

  const socialLinks = [
    { icon: FaFacebook, url: '#', color: 'hover:text-blue-600' },
    { icon: FaTwitter, url: '#', color: 'hover:text-blue-400' },
    { icon: FaLinkedin, url: '#', color: 'hover:text-blue-700' },
    { icon: FaInstagram, url: '#', color: 'hover:text-pink-600' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaShoppingBag className="text-2xl text-primary-400" />
              <h3 className="text-white text-xl font-bold">GarmentExport</h3>
            </div>
            <p className="text-sm mb-4 text-gray-400">
              Leading wholesale garment exporter specializing in quality apparel for global markets. Trusted by 500+ clients worldwide.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.url}
                    className={`w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full ${social.color} transition`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="text-lg" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-primary-400 transition text-sm"
                >
                  Client Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-gray-400 text-sm hover:text-primary-400 transition cursor-pointer">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  123 Export Street<br />
                  Mumbai, Maharashtra 400001<br />
                  India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary-400 flex-shrink-0" />
                <a href="tel:+911234567890" className="text-sm text-gray-400 hover:text-primary-400 transition">
                  +91 1234567890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400 flex-shrink-0" />
                <a href="mailto:info@garmentexport.com" className="text-sm text-gray-400 hover:text-primary-400 transition">
                  info@garmentexport.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left">
              &copy; {currentYear} GarmentExport. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition">
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link to="/sitemap" className="text-gray-400 hover:text-primary-400 transition">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
