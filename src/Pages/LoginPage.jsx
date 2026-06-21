import { useState } from 'react'

import '../App.css'
import { useNavigate, Link } from 'react-router-dom'
export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Task Manager</h1>
        <p className="subtitle">Sign in to your account</p>
        <form className="form-group" onSubmit={handleSubmit}>
          <input
            className="form-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
          <input
            className="form-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <button className="btn-primary" type="submit">Sign In</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
  Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register</Link>
</p>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  )
}
