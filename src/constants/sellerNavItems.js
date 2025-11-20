import {
  FaColumns,
  FaUserCircle,
  FaUsers,
  FaClipboardList,
  FaBoxOpen,
  FaFileInvoiceDollar,
  FaChartLine,
  FaAddressBook,
} from 'react-icons/fa'

const sellerNavItems = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Sales summary and key metrics',
    icon: FaColumns,
    overlayTo: { pathname: '/seller' },
    sidebarTo: { pathname: '/seller' },
  },
  {
    id: 'profile',
    label: 'Profile & Settings',
    description: 'Manage your account information',
    icon: FaUserCircle,
    overlayTo: '/profile',
    sidebarTo: '/profile',
  },
  {
    id: 'leads',
    label: 'Leads',
    description: 'Track incoming buyer enquiries',
    icon: FaUsers,
    overlayTo: { pathname: '/seller/leads' },
    sidebarTo: { pathname: '/seller/leads' },
  },
  {
    id: 'buyers',
    label: 'Buyer Accounts',
    description: 'See relationship history for key buyers',
    icon: FaAddressBook,
    overlayTo: { pathname: '/seller/buyers' },
    sidebarTo: { pathname: '/seller/buyers' },
  },
  {
    id: 'orders',
    label: 'Orders',
    description: 'Monitor fulfillment progress',
    icon: FaClipboardList,
    overlayTo: { pathname: '/seller/orders' },
    sidebarTo: { pathname: '/seller/orders' },
  },
  {
    id: 'products',
    label: 'Products',
    description: 'Manage your product catalogue',
    icon: FaBoxOpen,
    overlayTo: { pathname: '/seller/products' },
    sidebarTo: { pathname: '/seller/products' },
  },
  {
    id: 'documents',
    label: 'Documents',
    description: 'Invoices and compliance files',
    icon: FaFileInvoiceDollar,
    overlayTo: { pathname: '/seller/documents' },
    sidebarTo: { pathname: '/seller/documents' },
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Revenue breakdown and performance',
    icon: FaChartLine,
    overlayTo: { pathname: '/seller/analytics' },
    sidebarTo: { pathname: '/seller/analytics' },
  },
]

export default sellerNavItems
