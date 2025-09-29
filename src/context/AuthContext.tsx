import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  avatar?: string | null;
}

interface AuthContextType {
  currentUser: User | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAdmin: boolean; 
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  // ✅ อ่าน token + avatar หลัง login หรือ oauth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const avatarFromQuery = params.get("avatar");

    if (token) {
      localStorage.setItem("accessToken", token);

      try {
        const decoded: any = jwtDecode(token);
        const user: User = {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          avatar: avatarFromQuery || decoded.avatar || null, // 👈 ใช้ avatar
        };
        setCurrentUser(user);
      } catch (e) {
        console.error("Failed to decode token", e);
      }

      // ลบ query ออกจาก URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // กรณี refresh → โหลด token จาก localStorage
      const savedToken = localStorage.getItem("accessToken");
      if (savedToken) {
        try {
          const decoded: any = jwtDecode(savedToken);
          const user: User = {
            id: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            avatar: decoded.avatar || null,
          };
          setCurrentUser(user);
        } catch (e) {
          console.error("Invalid saved token", e);
        }
      }
    }

    setIsReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();

    const token = data.accessToken;
    localStorage.setItem("accessToken", token);

    const decoded: any = jwtDecode(token);
    const user: User = {
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      avatar: decoded.avatar || null,
    };
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isReady, login, logout, isAdmin: currentUser?.role === "ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
