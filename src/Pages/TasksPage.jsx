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
const handleDeleteTask = async (id) => {
  const token = localStorage.getItem('token')

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })

  if (res.ok) {
    const remaining = tasks.filter(t => t.id !== id)
    setTasks(remaining)
    if (remaining.length === 0) {
      navigate('/dashboard')
    }
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
      .then(data => setTasks(data))
  }, [projectId])

  const handleCreate = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, description })
    })

    if (res.ok) {
      const newTask = await res.json()
      setTasks([...tasks, newTask])
      setTitle('')
      setDescription('')
    }
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
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Add one below.</div>
          ) : (
            <div className="task-list">
              {tasks.map(t => (
                <div key={t.id} className="task-item">
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
                      <button className="btn-secondary" onClick={() => { setEditingId(t.id); setEditTitle(t.title); setEditDescription(t.description) }}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDeleteTask(t.id)}>Delete</button>
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
              />
              <input
                className="form-input"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
              />
              <button className="btn-primary" type="submit" style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
