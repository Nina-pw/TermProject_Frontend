import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";
import { useState } from "react";

function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match!");
      setMessage('❌ Password and Confirm Password do not match!');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstname} ${lastname}`,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Registration successful! Please check your email to verify your account.');
        setFirstname('');
        setLastname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage(`❌ ${data.error || 'Registration failed'}`);
      }
    } catch (err) {
      setMessage('⚠️ Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* ฝั่งซ้าย - โลโก้ */}
        <div className="auth-left">
          <img src="/assets/pic1.png" alt="Logo" className="auth-logo" />
        </div>

        {/* ฝั่งขวา - ฟอร์ม */}
        <div className="auth-right">
          <form className="auth-form" onSubmit={handleRegister}>
            <h2>Register</h2>

            {message && <p style={{ marginBottom: '1rem' }}>{message}</p>}

            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              onChange={e => setFirstname(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              onChange={e => setLastname(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
            <div className="ft__social">
              <a href="#" className="google" aria-label="Google">
                <FcGoogle />
              </a>
              <a href="#" className="facebook" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="apple" aria-label="Apple">
                <FaApple />
              </a>
            </div>
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
