import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  FaHome,
  FaBox,
  FaHeart,
  FaTruck,
  FaFileInvoiceDollar,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const BuyerSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentView = searchParams.get("view") || "dashboard";

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FaHome,
      view: "dashboard",
    },
    {
      id: "orders",
      label: "Orders",
      icon: FaBox,
      view: "orders",
    },
    {
      id: "documents",
      label: "Documents",
      icon: FaFileInvoiceDollar,
      view: "documents",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: FaHeart,
      view: "wishlist",
    },
    {
      id: "trackorder",
      label: "Track Shipment",
      icon: FaTruck,
      view: "trackorder",
    },
    {
      id: "profile",
      label: "Profile",
      icon: FaUserCircle,
      view: "profile",
    },
  ];

  const handleNavigation = (view) => {
    navigate(`/buyer?view=${view}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {user?.username || "Buyer"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Buyer</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="text-lg flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default BuyerSidebar;
