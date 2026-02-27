import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import FindDoctors from './pages/FindDoctors'
import Login from './pages/Login'
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
        {/* Public routes outside standard layout */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />

        {/* Routes under shared Navbar/SearchBar */}
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
          {/* Add more protected routes here in the future like /dashboard, /community */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
