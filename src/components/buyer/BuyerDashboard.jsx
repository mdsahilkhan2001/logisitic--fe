import React from "react";
import { useSearchParams } from "react-router-dom";

import MyOrders from "./MyOrders";
import DocumentsView from "./DocumentsView";
import Wishlist from "./Wishlist";
import TrackShipment from "./TrackShipment";
import ProfilePage from "../../pages/ProfilePage";

export default function BuyerDashboard() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "dashboard";

  const renderContent = () => {
    switch (view) {
      case "orders":
        return <MyOrders />;
      case "documents":
        return <DocumentsView />;
      case "wishlist":
        return <Wishlist />;
      case "trackorder":
        return <TrackShipment />;
      case "profile":
        return <ProfilePage />;
      default:
        return (
          <div className="space-y-8">

            <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-10 rounded-2xl shadow-lg">
              <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
              <p className="text-blue-100 mt-3 text-lg">
                Manage orders, documents, wishlist & shipments — all in one smart dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Orders", value: "24", color: "text-blue-600" },
                { label: "Documents", value: "18", color: "text-indigo-600" },
                { label: "Wishlist Items", value: "6", color: "text-pink-500" },
                { label: "Active Shipments", value: "3", color: "text-green-600" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition"
                >
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    {item.label}
                  </p>
                  <h2 className={`text-3xl font-bold ${item.color}`}>
                    {item.value}
                  </h2>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                How can we help?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use the sidebar to explore your dashboard options.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {renderContent()}
      </div>
    </div>
  );
}
