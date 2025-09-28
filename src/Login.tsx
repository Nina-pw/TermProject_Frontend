import "./Auth.css";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Login with:\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* ฝั่งซ้าย - โลโก้ */}
        <div className="auth-left">
          <img
            src="\src\assets\pics\pic1.png"
            alt="Logo"
            className="auth-logo"
          />
        </div>

        {/* ฝั่งขวา - ฟอร์ม */}
        <div className="auth-right">
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
