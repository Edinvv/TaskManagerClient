import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../App.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const handleDeleteProject = async (id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const token2 = localStorage.getItem('token')
      fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token2}` }
      }).then(r => r.json()).then(data => setProjects(data))
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
      .then(data => {
        setProjects(data)
        setLoading(false)
      })
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const tempId = Date.now()
    const tempProject = { id: tempId, name, description, _optimistic: true }
    setProjects(prev => [...prev, tempProject])
    setName('')
    setDescription('')
    setSubmitting(true)

    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: tempProject.name, description: tempProject.description })
    })

    if (res.ok) {
      const newProject = await res.json()
      setProjects(prev => prev.map(p => p.id === tempId ? newProject : p))
    } else {
      setProjects(prev => prev.filter(p => p.id !== tempId))
    }
    setSubmitting(false)
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
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" />
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">No projects yet. Create one below.</div>
          ) : (
            <div className="project-grid">
              {projects.map(p => (
                <Link
                  key={p.id}
                  className={`project-card${p._optimistic ? ' optimistic' : ''}`}
                  to={p._optimistic ? '#' : `/projects/${p.id}/tasks`}
                  onClick={e => p._optimistic && e.preventDefault()}
                >
                  <span className="project-card-name">{p.name}</span>
                  <span className="project-card-desc">{p.description}</span>
                  {!p._optimistic && (
                    <button
                      className="btn-danger"
                      onClick={e => { e.preventDefault(); handleDeleteProject(p.id) }}
                    >
                      Delete
                    </button>
                  )}
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
                disabled={submitting}
              />
              <input
                className="form-input"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                disabled={submitting}
              />
              <button className="btn-primary" type="submit" disabled={submitting} style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                {submitting ? 'Adding...' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
