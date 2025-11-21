 import { useState } from 'react'
import { FaTruck, FaMapMarkerAlt, FaCheckCircle, FaClock, FaSearch, FaShip, FaPlane } from 'react-icons/fa'
import { motion } from 'framer-motion'

const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [tracking, setTracking] = useState(null)

  // Mock tracking data (backend should provide an endpoint /api/shipments/track/:trackingNumber)
  const mockTracking = {
    trackingNumber: 'TRACK123456789',
    orderId: '1234',
    carrier: 'Maersk Line',
    method: 'sea',
    status: 'in_transit',
    currentLocation: 'Singapore Port',
    origin: 'Mumbai, India',
    destination: 'Los Angeles, USA',
    estimatedDelivery: '2025-02-15',
    progress: 65,
    events: [
      { status: 'Order Shipped', location: 'Mumbai, India', date: '2025-01-10 14:30', completed: true, description: 'Shipment departed from origin port' },
      { status: 'In Transit', location: 'Singapore Port', date: '2025-01-18 09:15', completed: true, description: 'Container in transit via Singapore hub' },
      { status: 'Customs Clearance', location: 'Singapore', date: '2025-01-19 16:45', completed: true, description: 'Cleared customs successfully' },
      { status: 'In Transit', location: 'Pacific Ocean', date: '2025-01-20', completed: false, description: 'En route to destination' },
      { status: 'Arrival at Port', location: 'Los Angeles, USA', date: 'Expected: 2025-02-15', completed: false, description: 'Expected arrival at destination port' },
      { status: 'Out for Delivery', location: 'Los Angeles, USA', date: 'Pending', completed: false, description: 'Final delivery to warehouse' },
    ],
  }

  const handleTrack = (e) => {
    e.preventDefault()
    // ideally call backend endpoint to fetch tracking details. For now use mock data.
    setTracking(mockTracking)
  }

  const getShippingIcon = () => {
    if (tracking?.method === 'sea') return <FaShip className="text-4xl text-blue-600" />
    if (tracking?.method === 'air') return <FaPlane className="text-4xl text-blue-600" />
    return <FaTruck className="text-4xl text-blue-600" />
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Track Shipment</h1>
        <p className="text-gray-600 dark:text-gray-400">Enter your tracking number to see real-time shipment status</p>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleTrack} className="flex gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Enter tracking number or order ID..." className="input-field pl-10 w-full" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary px-8">Track</button>
        </form>
      </div>

      {tracking ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="card">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start space-x-4">
                {getShippingIcon()}
                <div>
                  <h2 className="text-2xl font-bold mb-2">Tracking: {tracking.trackingNumber}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Order #{tracking.orderId} • {tracking.carrier}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span>{tracking.origin} → {tracking.destination}</span>
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Delivery</p>
                <p className="text-2xl font-bold text-green-600">{new Date(tracking.estimatedDelivery).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500 mt-1">Current: {tracking.currentLocation}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Shipment Progress</span>
                <span className="text-sm font-bold text-primary-600">{tracking.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${tracking.progress}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="bg-gradient-to-r from-blue-500 to-green-500 h-3" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Shipment Timeline</h3>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
              <div className="space-y-6">
                {tracking.events.map((event, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="relative flex items-start space-x-6">
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${event.completed ? 'bg-green-500 border-green-200 dark:border-green-900' : 'bg-gray-300 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}>
                      {event.completed ? <FaCheckCircle className="text-white text-xl" /> : <FaClock className="text-gray-500 text-xl" />}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-lg">{event.status}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.completed ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                            {event.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{event.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                          <div className="flex items-center space-x-1"><FaMapMarkerAlt /><span>{event.location}</span></div>
                          <div className="flex items-center space-x-1"><FaClock /><span>{event.date}</span></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Shipment Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Tracking Number:</span><span className="font-medium">{tracking.trackingNumber}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Order ID:</span><span className="font-medium">#{tracking.orderId}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Carrier:</span><span className="font-medium">{tracking.carrier}</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Shipping Method:</span><span className="font-medium capitalize">{tracking.method} Freight</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Status:</span><span className="font-medium text-blue-600 capitalize">{tracking.status.replace('_', ' ')}</span></div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Route Information</h3>
              <div className="space-y-3 text-sm">
                <div><p className="text-gray-600 dark:text-gray-400 mb-1">Origin</p><p className="font-medium flex items-center space-x-2"><FaMapMarkerAlt className="text-green-600" /><span>{tracking.origin}</span></p></div>
                <div><p className="text-gray-600 dark:text-gray-400 mb-1">Current Location</p><p className="font-medium flex items-center space-x-2"><FaTruck className="text-blue-600" /><span>{tracking.currentLocation}</span></p></div>
                <div><p className="text-gray-600 dark:text-gray-400 mb-1">Destination</p><p className="font-medium flex items-center space-x-2"><FaMapMarkerAlt className="text-red-600" /><span>{tracking.destination}</span></p></div>
                <div><p className="text-gray-600 dark:text-gray-400 mb-1">Est. Delivery</p><p className="font-medium text-green-600">{new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn-primary flex-1">Download Shipping Documents</button>
              <button className="btn-secondary flex-1">Contact Carrier</button>
              <button className="btn-secondary flex-1">Report Issue</button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="card text-center py-12">
          <FaTruck className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Track Your Shipment</h3>
          <p className="text-gray-500 mb-6">Enter your tracking number above to see real-time updates</p>
          <div className="max-w-md mx-auto text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong>Where to find tracking number:</strong></p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>Shipping confirmation email</li>
              <li>Order details page</li>
              <li>Shipping documents</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackShipment
