import {
  FaHome,
  FaColumns,
  FaBox,
  FaHeart,
  FaTruck,
  FaFileInvoiceDollar,
  FaUserCircle,
} from 'react-icons/fa'

// Shared navigation model for buyer quick actions and dashboard sidebar
export const buyerNavItems = [
  {
    id: 'home',
    label: 'Home',
    description: 'Public storefront',
    icon: FaHome,
    overlayTo: '/buyer',
    sidebarTo: '/buyer',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Buyer overview & stats',
    icon: FaColumns,
    overlayTo: { pathname: '/buyer', search: '?view=dashboard' },
    sidebarTo: { pathname: '/buyer', search: '?view=dashboard' },
    view: 'dashboard',
  },
  {
    id: 'orders',
    label: 'Orders',
    description: 'Track your purchases',
    icon: FaBox,
    overlayTo: { pathname: '/buyer', search: '?view=orders' },
    sidebarTo: { pathname: '/buyer', search: '?view=orders' },
    view: 'orders',
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    description: 'Saved looks & styles',
    icon: FaHeart,
    overlayTo: { pathname: '/buyer', search: '?view=wishlist' },
    sidebarTo: { pathname: '/buyer', search: '?view=wishlist' },
    view: 'wishlist',
  },
  {
    id: 'tracking',
    label: 'Track Items',
    description: 'Follow deliveries in transit',
    icon: FaTruck,
    overlayTo: { pathname: '/buyer', search: '?view=trackorder' },
    sidebarTo: { pathname: '/buyer', search: '?view=trackorder' },
    view: 'trackorder',
  },
  {
    id: 'documents',
    label: 'Documents',
    description: 'Download invoices and POs',
    icon: FaFileInvoiceDollar,
    overlayTo: { pathname: '/buyer', search: '?view=documents' },
    sidebarTo: { pathname: '/buyer', search: '?view=documents' },
    view: 'documents',
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Account preferences & details',
    icon: FaUserCircle,
    overlayTo: { pathname: '/buyer', search: '?view=profile' },
    sidebarTo: { pathname: '/buyer', search: '?view=profile' },
    view: 'profile',
  },
]

export default buyerNavItems
