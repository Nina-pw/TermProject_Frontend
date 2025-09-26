import './Auth.css';
import { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if(password !== confirm){
      alert("Passwords do not match!");
      return;
    }
    alert(`Register with:\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>
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
          value={confirm} 
          onChange={e => setConfirm(e.target.value)} 
          required
        />
        <button type="submit">Register</button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
}

export default Register;
