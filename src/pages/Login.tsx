// src/pages/Login.tsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, isReady, currentUser } = useAuth(); 
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isReady && currentUser) {
    const target = currentUser.role === "admin" ? "/admin" : "/userHome";
    return <Navigate to={target} replace />;
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      if (user.role === "admin") navigate("/admin");
      else navigate("/userHome"); // 👈 user ไปหน้า UserHome
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
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

          <p className="auth-note">
            Don’t have an account?{" "}
            <a href="/register">Register</a>
          </p>

          <div className="auth-meta">
            <a href="#" className="auth-link">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
);

}
