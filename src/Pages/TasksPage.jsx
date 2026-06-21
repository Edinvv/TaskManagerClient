import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import '../App.css'

export default function TasksPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const handleDeleteTask = async (id) => {
    const remaining = tasks.filter(t => t.id !== id)
    setTasks(remaining)
    if (remaining.length === 0) navigate('/dashboard')

    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(r => r.json()).then(data => setTasks(data))
    }
  }

  const handleUpdate = async (id) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title: editTitle, description: editDescription })
    })
    if (res.ok) {
      const updated = await res.json()
      setTasks(tasks.map(t => t.id === id ? updated : t))
      setEditingId(null)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTasks(data)
        setLoading(false)
      })
  }, [projectId])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const tempId = Date.now()
    const tempTask = { id: tempId, title, description, _optimistic: true }
    setTasks(prev => [...prev, tempTask])
    setTitle('')
    setDescription('')
    setSubmitting(true)

    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title: tempTask.title, description: tempTask.description })
    })

    if (res.ok) {
      const newTask = await res.json()
      setTasks(prev => prev.map(t => t.id === tempId ? newTask : t))
    } else {
      setTasks(prev => prev.filter(t => t.id !== tempId))
    }
    setSubmitting(false)
  }

  return (
    <div className="page">
      <nav className="navbar">
        <span className="navbar-brand">Task Manager</span>
        <Link className="back-link" to="/dashboard">← Back to Projects</Link>
      </nav>

      <div className="content">
        <div>
          <h2 className="section-title">Tasks</h2>
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Add one below.</div>
          ) : (
            <div className="task-list">
              {tasks.map(t => (
                <div key={t.id} className={`task-item${t._optimistic ? ' optimistic' : ''}`}>
                  {editingId === t.id ? (
                    <>
                      <input className="form-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                      <input className="form-input" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                      <button className="btn-primary" onClick={() => handleUpdate(t.id)}>Save</button>
                      <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <div className="task-info">
                        <span className="task-title">{t.title}</span>
                        {t.description && <span className="task-desc">{t.description}</span>}
                      </div>
                      {!t._optimistic && (
                        <>
                          <button className="btn-secondary" onClick={() => { setEditingId(t.id); setEditTitle(t.title); setEditDescription(t.description) }}>Edit</button>
                          <button className="btn-danger" onClick={() => handleDeleteTask(t.id)}>Delete</button>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="create-form">
          <h2>New Task</h2>
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <input
                className="form-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Task title"
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
                {submitting ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
