import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

/* ── Inline SVG icons ── */
const MedicalCrossIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20" />
    </svg>
)

const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

function Navbar() {
    const location = useLocation()

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find Doctors', path: '/find-doctors' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Community', path: '/community' },
    ]

    return (
        <nav className="navbar" id="navbar">
            {/* Logo */}
            <Link to="/" className="navbar__logo">
                <span className="navbar__logo-icon">
                    <MedicalCrossIcon />
                </span>
                <span className="navbar__logo-text">Medrox</span>
            </Link>

            {/* Center Links */}
            <ul className="navbar__links">
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <Link
                            to={link.path}
                            className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                            id={`nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                            {link.name}
                        </Link>
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

export default Navbar
