import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../App.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
const handleDeleteProject =async(id)=>{
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
    
  })
   if (res.ok) {
    setProjects(projects.filter(p => p.id !== id))
  }

}
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjects(data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, description })
    })

    if (res.ok) {
      const newProject = await res.json()
      setProjects([...projects, newProject])
      setName('')
      setDescription('')
    }
  }

  return (
    <div className="page">
      <nav className="navbar">
        <span className="navbar-brand">Task Manager</span>
        <button className="btn-secondary" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="content">
        <div>
          <h2 className="section-title">My Projects</h2>
          {projects.length === 0 ? (
            <div className="empty-state">No projects yet. Create one below.</div>
          ) : (
            <div className="project-grid">
              {projects.map(p => (
                <Link key={p.id} className="project-card" to={`/projects/${p.id}/tasks`}>
  <span className="project-card-name">{p.name}</span>
  <span className="project-card-desc">{p.description}</span>
  <button
    className="btn-danger"
    onClick={e => { e.preventDefault(); handleDeleteProject(p.id) }}
  >
    Delete
  </button>
</Link>
              ))}
            </div>
          )}
        </div>

        <div className="create-form">
          <h2>New Project</h2>
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <input
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Project name"
              />
              <input
                className="form-input"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
              />
              <button className="btn-primary" type="submit" style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
