import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

/* ── Icons ── */
const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
)

const LinkedinIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
)

const TwitterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
)

function Login({ onLogin }) {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false)
    const [isMobileLogin, setIsMobileLogin] = useState(true)
    const navigate = useNavigate()

    const handleAuthSubmit = (e) => {
        e.preventDefault()
        onLogin()
        navigate('/')
    }

    return (
        <div className="login-page">
            {/* ── DESKTOP VIEW ── */}
            <div className={`login-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>

                {/* Sign Up Container */}
                <div className="form-container sign-up-container">
                    <form className="login-form" onSubmit={handleAuthSubmit}>
                        <h1>Create Account</h1>
                        <div className="social-container">
                            <a href="#" className="social-btn"><FacebookIcon /></a>
                            <a href="#" className="social-btn"><LinkedinIcon /></a>
                            <a href="#" className="social-btn"><TwitterIcon /></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input type="text" placeholder="Name" required />
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit" className="login-primary-btn">Sign Up</button>
                    </form>
                </div>

                {/* Sign In Container */}
                <div className="form-container sign-in-container">
                    <form className="login-form" onSubmit={handleAuthSubmit}>
                        <h1>Sign in</h1>
                        <div className="social-container">
                            <a href="#" className="social-btn"><FacebookIcon /></a>
                            <a href="#" className="social-btn"><LinkedinIcon /></a>
                            <a href="#" className="social-btn"><TwitterIcon /></a>
                        </div>
                        <span>or use your account</span>
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <a href="#" className="forgot-password">Forgot your password?</a>
                        <button type="submit" className="login-primary-btn">Sign In</button>
                    </form>
                </div>

                {/* Overlay Container (The Sliding Panels) */}
                <div className="overlay-container">
                    <div className="overlay">
                        {/* Left Overlay Panel */}
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="login-ghost-btn" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
                        </div>
                        {/* Right Overlay Panel */}
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button className="login-ghost-btn" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>

            </div>

            {/* ── MOBILE VIEW ── */}
            <div className="login-mobile">
                <div className="login-mobile__bg">
                    <div className="login-mobile__blob login-mobile__blob--1"></div>
                    <div className="login-mobile__blob login-mobile__blob--2"></div>
                </div>

                <div className="login-mobile__content">
                    <div className="login-mobile__header">
                        <h1>Medrox</h1>
                        <p>Healthcare made simple.</p>
                    </div>

                    <div className="login-mobile__card">
                        {isMobileLogin ? (
                            <div className="login-mobile__fade-in">
                                <form className="login-mobile__form" onSubmit={handleAuthSubmit}>
                                    <h2>Welcome Back</h2>
                                    <p className="subtitle">Sign in to continue</p>
                                    <input type="email" placeholder="Email Address" required />
                                    <input type="password" placeholder="Password" required />
                                    <a href="#" className="forgot-link">Forgot Password?</a>
                                    <button type="submit" className="login-mobile-btn">SIGN IN</button>
                                </form>
                            </div>
                        ) : (
                            <div className="login-mobile__fade-in">
                                <form className="login-mobile__form" onSubmit={handleAuthSubmit}>
                                    <h2>Get Started</h2>
                                    <p className="subtitle">Create your free account</p>
                                    <input type="text" placeholder="Full Name" required />
                                    <input type="email" placeholder="Email Address" required />
                                    <input type="password" placeholder="Password" required />
                                    <button type="submit" className="login-mobile-btn">CREATE ACCOUNT</button>
                                </form>
                            </div>
                        )}

                        <div className="login-mobile__toggle">
                            <p>{isMobileLogin ? "Don't have an account?" : "Already have an account?"}</p>
                            <button
                                type="button"
                                className="login-mobile-toggle-btn"
                                onClick={() => setIsMobileLogin(!isMobileLogin)}
                            >
                                {isMobileLogin ? "Create Account" : "Sign In"}
                            </button>
                        </div>
                    </div>

                    <div className="login-mobile__back">
                        <Link to="/">&larr; Back to Home</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login
