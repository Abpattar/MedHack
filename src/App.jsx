import { useState } from 'react'
import './App.css'

/* ── Inline SVG icons (no external deps) ── */

const MedicalCrossIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20" />
  </svg>
)

const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

/* ── Navbar Component ── */
function Navbar() {
  const [activeLink, setActiveLink] = useState('Home')

  const navLinks = ['Home', 'Dashboard', 'Community']

  return (
    <nav className="navbar" id="navbar">
      {/* Logo */}
      <a href="/" className="navbar__logo">
        <span className="navbar__logo-icon">
          <MedicalCrossIcon />
        </span>
        <span className="navbar__logo-text">Medrox</span>
      </a>

      {/* Center Links */}
      <ul className="navbar__links">
        {navLinks.map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className={`navbar__link ${activeLink === link ? 'navbar__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                setActiveLink(link)
              }}
              id={`nav-${link.toLowerCase()}`}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* Right Actions */}
      <div className="navbar__actions">
        <button className="navbar__settings-btn" aria-label="Settings" id="settings-btn">
          <SettingsIcon />
        </button>
        <button className="navbar__login-btn" id="login-btn">
          Login
        </button>
      </div>
    </nav>
  )
}

/* ── Search Bar Component ── */
function SearchBar() {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      console.log('Search:', query)
    }
  }

  return (
    <div className="search-bar" id="search-bar">
      <form className="search-bar__inner" onSubmit={handleSubmit}>
        <span className="search-bar__icon">
          <CameraIcon />
        </span>
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search symptoms, doctors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="search-input"
        />
        <button type="submit" className="search-bar__send-btn" aria-label="Search" id="search-submit-btn">
          <SendIcon />
        </button>
      </form>
    </div>
  )
}

/* ── App ── */
function App() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <div className="main-content__hero">
          <h1>
            Welcome to <span>Medrox</span>
          </h1>
          <p>
            Your trusted companion for healthcare management. Find doctors,
            track symptoms, and take control of your health — all in one place.
          </p>
        </div>
      </main>

      <SearchBar />
    </>
  )
}

export default App
