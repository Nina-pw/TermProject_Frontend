// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import type { JSX } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Shop from "./pages/Shop";
import Footer from "./components/Footer";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import PaymentPage from "./pages/Payment";



// Admin
import AdminHome from "./pages/Admin/AdminHome";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminOrders from "./pages/Admin/Orders";
import AdminProducts from "./pages/Admin/Products";

import { useAuth } from "./context/AuthContext";
import ProductDetails from "./pages/Detail";

// ---------- Protected route ----------
function RequireAuth({
  children,
  role,
}: {
  children: JSX.Element;
  role?: "admin" | "user";
}) {
  const { currentUser, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) return null;

  if (!currentUser) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }
  // Map frontend role to backend role for comparison
  const roleMap: Record<"admin" | "user", "ADMIN" | "CUSTOMER"> = {
    admin: "ADMIN",
    user: "CUSTOMER",
  };

  if (role && currentUser.role !== roleMap[role]) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

function AppRoutes() {
  const location = useLocation();
  const { isReady } = useAuth();
  if (!isReady) return null;

  // ไม่แสดง Navbar/Footer บนเส้นทาง admin
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Navbar />}

      {/* ใช้ location ปกติ ไม่มี background/Sheet แล้ว */}
      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/detail" element={<ProductDetails />} />
        {/* user */}
        <Route
          path="/shop"
          element={
            <RequireAuth role="user">
              <Shop />
            </RequireAuth>
          }
        />

        {/* admin + nested */}
        <Route
          path="/admin"
          element={
            <RequireAuth role="admin">
              <AdminHome />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          
        </Route>
      </Routes>

      {!isAdminPath && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
