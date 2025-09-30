// src/pages/Login.tsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { login, isReady, currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isReady && currentUser) {
    const target = currentUser.role === "ADMIN" ? "/admin" : "/shop";
    return <Navigate to={target} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") navigate("/admin");
      else navigate("/home"); // 👈 user ไปหน้า UserHome
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* LEFT: โลโก้/พรีวิว */}
        <div className="auth-left">
          <img src="/assets/pic1.png" alt="IRIS" className="auth-logo" />
        </div>

        {/* RIGHT: ฟอร์ม */}
        <div className="auth-right">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="auth-title">Login</h2>

            {error && <p className="auth-error">{error}</p>}

            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="auth-btn auth-btn--primary" type="submit">
              Login
            </button>

            <div className="auth-divider">or</div>

            {/* ปุ่ม Social Login */}
            <div className="ft__social">
              <a
                href={`${import.meta.env.VITE_API_URL}/auth/google`}
                className="google"
                aria-label="Sign in with Google"
              >
                <FcGoogle />
              </a>

              <a
                href={`${import.meta.env.VITE_API_URL}/auth/facebook`}
                className="facebook"
                aria-label="Sign in with Facebook"
              >
                <FaFacebookF />
              </a>

            </div>

            {/* Apple จะทำทีหลัง ถ้ายังไม่ใช้คอมเมนต์ไว้ */}
            {/* <button type="button" className="auth-btn auth-btn--apple">
              <FaApple /> Sign in with Apple
            </button> */}

            <p className="auth-note">
              Don’t have an account? <a href="/register">Register</a>
            </p>

            <div className="auth-meta">
              <a href="/forgot-password" className="auth-link">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
