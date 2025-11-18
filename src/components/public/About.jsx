import { motion } from 'framer-motion'
import { FaAward, FaGlobe, FaUsers, FaIndustry } from 'react-icons/fa'

const About = () => {
  const milestones = [
    { year: '2010', event: 'Company Founded' },
    { year: '2013', event: 'Expanded to 5 Countries' },
    { year: '2017', event: 'ISO 9001 Certified' },
    { year: '2020', event: 'Reached 500+ Clients' },
    { year: '2023', event: 'Global Recognition Award' },
  ]

  const values = [
    {
      icon: FaAward,
      title: 'Quality First',
      description: 'We never compromise on quality. Every product goes through rigorous quality checks.'
    },
    {
      icon: FaGlobe,
      title: 'Global Reach',
      description: 'Serving clients in 15+ countries with reliable international shipping.'
    },
    {
      icon: FaUsers,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. Dedicated support team available 24/7.'
    },
    {
      icon: FaIndustry,
      title: 'Modern Facility',
      description: 'State-of-the-art manufacturing unit with latest technology and equipment.'
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
            About Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Leading the garment export industry with quality, innovation, and trust since 2010
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Founded in 2010, GarmentExport started with a simple vision: to provide world-class garment manufacturing and export services to businesses worldwide.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                What began as a small operation has grown into a leading wholesale garment exporter, serving over 500 satisfied clients across 15+ countries.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our commitment to quality, timely delivery, and customer satisfaction has made us a trusted partner in the global apparel industry.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Today, we continue to innovate and expand, bringing the latest in garment technology and sustainable practices to our operations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1556484687-30636164638b?w=600&q=80" 
                alt="Our Team" 
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center"
                >
                  <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-3xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Key milestones in our growth story
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center mb-8"
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'order-2 pl-8'}`}>
                  <h3 className="text-2xl font-bold text-primary-600">{milestone.year}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{milestone.event}</p>
                </div>
                <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
                <div className={`flex-1 ${index % 2 === 0 ? 'order-2' : ''}`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-dark-bg">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Expert professionals dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Kumar', role: 'CEO & Founder', image: 'https://i.pravatar.cc/300?img=12' },
              { name: 'Priya Sharma', role: 'Head of Design', image: 'https://i.pravatar.cc/300?img=9' },
              { name: 'Amit Patel', role: 'Operations Manager', image: 'https://i.pravatar.cc/300?img=13' },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Certifications & Awards</h2>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {['ISO 9001:2015', 'CE Certified', 'Export Excellence Award', 'Green Manufacturing'].map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaAward className="text-4xl text-primary-600" />
                </div>
                <p className="font-medium">{cert}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
