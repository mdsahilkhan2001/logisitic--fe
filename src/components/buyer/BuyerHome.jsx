import Navbar from "../../components/common/Navbar";
import Sidebar from "./Sidebar";
import BuyerDashboard from "./BuyerDashboard";

export default function BuyerHome() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* FIXED NAVBAR */}
      <Navbar />

      <div className="flex pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">

        {/* FIXED SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 p-6 sm:p-8 ml-64">
          <div className="max-w-7xl mx-auto w-full">
            <BuyerDashboard />
          </div>
        </div>

      </div>
    </div>
  );
}
