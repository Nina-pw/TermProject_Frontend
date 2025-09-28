// src/context/AuthContext.tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type User } from "../types";
import { MOCK_USERS } from "../mocks/users";

type AuthUser = Omit<User, "password">;

type AuthContextType = {
  currentUser: AuthUser | null;
  isAdmin: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const KEY = "auth_user";
// ✅ keys ที่ใช้โดย RequireAuth/หน้า Login สำหรับจำหน้าปลายทาง
const RETURN_KEY = "return_to_path";
const NEED_ROLE_KEY = "return_needs_role";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  // rehydrate จาก localStorage ครั้งแรก
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        setCurrentUser(parsed);
      }
    } catch {
      // ignore parse error
      localStorage.removeItem(KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  // sync ข้ามแท็บ
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      setCurrentUser(e.newValue ? (JSON.parse(e.newValue) as AuthUser) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === normalized && u.password === password
    );
    if (!found) throw new Error("Invalid email or password");

    const { password: _omit, ...safe } = found; // อย่าเก็บ password
    setCurrentUser(safe);
    localStorage.setItem(KEY, JSON.stringify(safe));
    return safe;
  }, []);

  const logout = useCallback(() => {
    // ✅ ลบ session + ล้าง return keys กันเด้งกลับ /login
    setCurrentUser(null);
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(RETURN_KEY);
    sessionStorage.removeItem(NEED_ROLE_KEY);
  }, []);

  const isAdmin = useMemo(() => currentUser?.role === "admin", [currentUser]);

  const value = useMemo<AuthContextType>(
    () => ({ currentUser, isAdmin, isReady, login, logout }),
    [currentUser, isAdmin, isReady, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
