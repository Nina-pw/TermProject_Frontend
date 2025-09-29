import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  avatar?: string;
}

interface AuthContextProps {
  currentUser: User | null;
  isReady: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  const isAdmin = currentUser?.role === "ADMIN";

  /* ------------------- login ------------------- */
  const login = async (email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // 👈 รับ cookie refreshToken
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("accessToken", data.accessToken);
    setCurrentUser(data.user);

    return data.user;
  };

  /* ------------------- register ------------------- */
  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    // สมัครเสร็จ user ยังไม่ verify → return object ชั่วคราว
    return {
      id: data.user.userID,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };
  };

  const fetchMe = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    setIsReady(true);
    return;
  }
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (res.ok) {
      const user = await res.json();
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  } catch {
    setCurrentUser(null);
  } finally {
    setIsReady(true);
  }
};

useEffect(() => {
  fetchMe();
}, []);

  /* ------------------- logout ------------------- */
  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
  };

  /* ------------------- refresh ------------------- */
  const refresh = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Refresh failed");
      }

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);

      // 👉 backend refresh route คืนแค่ accessToken ไม่ได้คืน user
      // คุณอาจทำ /auth/me ที่คืนข้อมูล user จาก accessToken ได้
      // แต่ตอนนี้ให้ mock user เดิมไว้ถ้า currentUser ยังมี
    } catch (err) {
      console.warn("Refresh token expired");
      setCurrentUser(null);
    } finally {
      setIsReady(true);
    }
  };

  /* ------------------- init ------------------- */
  useEffect(() => {
    // ตอน mount ลอง refresh session
    refresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isReady,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
