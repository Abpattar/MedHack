import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import FindDoctors from './pages/FindDoctors'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Community from './pages/Community'
import './App.css'

function ProtectedRoute({ children, isLoggedIn }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  )

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn)
  }, [isLoggedIn])

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)

  return (
    <BrowserRouter>
      <Routes>

        {/* Login route */}
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/" replace />
              : <Login onLogin={handleLogin} />
          }
        />

        {/* Main layout routes */}
        <Route element={<Layout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}>

          <Route path="/" element={<Home />} />

          <Route
            path="/find-doctors"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <FindDoctors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/community"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Community />
              </ProtectedRoute>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App