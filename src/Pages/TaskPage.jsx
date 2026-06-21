import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function TasksPage() {
  const { projectId } = useParams()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`http://localhost:5018/api/projects/${projectId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [projectId])

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title} — {t.description}</li>
        ))}
      </ul>
    </div>
  )
}