import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleRoute from "../components/auth/RoleRoute";

import BuyerHome from "../components/buyer/BuyerHome";
import BuyerDashboard from "../components/buyer/BuyerDashboard";

export default function BuyerRoutes() {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={["buyer"]}>
        <Routes>
          <Route element={<BuyerHome />}>
            <Route index element={<BuyerDashboard />} />
          </Route>
        </Routes>
      </RoleRoute>
    </ProtectedRoute>
  );
}
