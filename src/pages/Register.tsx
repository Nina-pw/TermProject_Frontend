import './Login.css';
import { useState } from 'react';

function Register() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Password and Confirm Password do not match!');
      return;
    }

    alert(`Register with:
First Name: ${firstname}
Last Name: ${lastname}
Email: ${email}
Password: ${password}`);
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
            <input 
              type="text" 
              placeholder="First Name" 
              value={firstname} 
              onChange={e => setFirstname(e.target.value)} 
              required
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              value={lastname} 
              onChange={e => setLastname(e.target.value)} 
              required
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required
            />
            <button type="submit">Register</button>
            <p>Already have an account? <a href="/login">Login</a></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
