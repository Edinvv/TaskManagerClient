import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

export default function RegisterPage(){
const navigate= useNavigate()
const [username,setUsername]= useState('')
const[email,setEmail]=useState('')
const [password,setPassword]=useState('')
const[error,setError]=useState('')
const handleSubmit = async (e)=>{
    e.preventDefault()
    setError('')

    const res=await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username, email, password })
    })

    if(res.ok){
        navigate('/login')
    }else{
        const msg=await res.text()
        setError(msg)
    }
}

return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Create Account</h1>
        <p className="subtitle">Sign up to get started</p>
        <form className="form-group" onSubmit={handleSubmit}>
          <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
          <input className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
          <button className="btn-primary" type="submit">Register</button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )

}