// src/components/RequireAuth.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

const RETURN_KEY = "return_to_path";
const NEED_ROLE_KEY = "return_needs_role";

export default function RequireAuth({
  children,
  role,
}: { children: JSX.Element; role?: "admin" | "user" }) {
  const { currentUser, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) return null;

  // ยังไม่ล็อกอิน → จำปลายทางไว้ก่อน แล้วพาไปหน้า Home
  if (!currentUser) {
    const target = location.pathname + location.search + location.hash;
    sessionStorage.setItem(RETURN_KEY, target);
    if (role) sessionStorage.setItem(NEED_ROLE_KEY, role);
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  // role ไม่ตรง → กลับหน้า Home
  if (role && currentUser.role !== role) {
    return <Navigate to="/home" replace />;
  }

  // ผ่านแล้ว เคลียร์ค่าที่จำไว้
  sessionStorage.removeItem(RETURN_KEY);
  sessionStorage.removeItem(NEED_ROLE_KEY);

  return children;
}
