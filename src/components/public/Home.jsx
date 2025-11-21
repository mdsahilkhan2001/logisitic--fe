 import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaShippingFast,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

import Footer from "../common/Footer";

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* ⭐ PUBLIC HOME PAGE ⭐ */}
      <main className="flex-1">

        {/* ⭐ HERO SECTION */}
        <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* LEFT: TEXT */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Premium Wholesale Garment Exports
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                  Your trusted partner for apparel manufacturing & global distribution
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/products"
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg 
                    font-bold hover:bg-gray-100 transition text-center"
                  >
                    Browse Products
                  </Link>

                  <Link
                    to="/contact"
                    className="border-2 border-white px-8 py-4 rounded-lg 
                    font-bold hover:bg-white/10 transition text-center"
                  >
                    Get Quote
                  </Link>
                </div>
              </motion.div>

              {/* RIGHT: IMAGE */}
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

        {/* ⭐ FEATURES SECTION */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
              Why Choose Us
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: FaShoppingBag, title: "Quality Products", desc: "Premium garments" },
                { icon: FaShippingFast, title: "Fast Delivery", desc: "Global shipping" },
                { icon: FaCheckCircle, title: "Quality Assurance", desc: "Rigorous QC" },
                { icon: FaUsers, title: "Expert Team", desc: "Experienced professionals" },
              ].map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900 
                    shadow border border-gray-200 dark:border-gray-800"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 
                    dark:bg-primary-900/20 flex items-center justify-center mb-4">
                      <Icon className="text-3xl text-primary-600" />
                    </div>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
