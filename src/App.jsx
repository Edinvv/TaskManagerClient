import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import DashboardPage from './Pages/DashboardPage'
import ProtectedRoute from './Components/ProtectedRoute'
import TasksPage from './Pages/TasksPage'
import RegisterPage from './Pages/RegisterPage'
const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/dashboard', element:  (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ) },
  { path: '/projects/:projectId/tasks', element: (
  <ProtectedRoute>
    <TasksPage />
  </ProtectedRoute>
)},
{ path: '/register', element: <RegisterPage /> }

])

function App() {
  return <RouterProvider router={router} />
}

export default App