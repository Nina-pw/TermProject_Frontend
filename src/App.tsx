// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import type { Location } from "react-router-dom";
import type { JSX } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import UserHome from "./pages/UserHome";
import Footer from "./components/Footer";

// Admin
import AdminHome from "./pages/Admin/AdminHome"; // layout ของ admin (มี topbar/side bar + <Outlet/>)
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminOrders from "./pages/Admin/Orders";
import AdminProducts from "./pages/Admin/Products";

import { useAuth } from "./context/AuthContext";

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

  if (!isReady) return null; // รออ่าน session ให้เสร็จ

  if (!currentUser) {
    // ⬇️ ถ้าไม่ได้ล็อกอิน ให้กลับหน้า Home (ไม่ใช่ /login)
    return <Navigate to="/home" replace state={{ from: location }} />;
  }
  if (role && currentUser.role !== role) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

function AppRoutes() {
  const location = useLocation();

  // เพื่อเปิด login เป็น sheet เมื่อมากดไอคอนใน Navbar เท่านั้น
  const state = location.state as
    | { background?: Location; fromNavIcon?: boolean }
    | undefined;
  const showSheet = Boolean(
    state?.fromNavIcon && state?.background && location.pathname === "/login"
  );
  const { isReady } = useAuth();
  if (!isReady) return null;

  // ไม่ต้องแสดง Navbar บนหน้า /admin
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Navbar />}

      <Routes location={showSheet ? state!.background! : location}>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* user */}
        <Route
          path="/userHome"
          element={
            <RequireAuth role="user">
              <UserHome />
            </RequireAuth>
          }
        />

        {/* admin: ใช้ layout + nested routes */}
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

          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          {/* เพิ่มเส้นทางอื่น ๆ ได้ที่นี่ เช่น customers, categories */}
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
