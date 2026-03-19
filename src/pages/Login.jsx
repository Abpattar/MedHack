import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { supabase } from '../supabase'

function Login({ onLogin }) {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false)
    const [isMobileLogin, setIsMobileLogin] = useState(true)
    const navigate = useNavigate()

    // 🔹 SIGN UP
    const handleSignUp = async (e) => {
        e.preventDefault()

        const form = e.target
        const name = form[0].value
        const email = form[1].value
        const password = form[2].value

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) {
            alert(error.message)
            return
        }

        // If email confirmation disabled → session exists immediately
        if (data.session) {
            onLogin()
            navigate('/')
        } else {
            alert("Account created! Please check your email to confirm.")
            setIsRightPanelActive(false)
            setIsMobileLogin(true)
        }
    }

    // 🔹 SIGN IN
    const handleSignIn = async (e) => {
        e.preventDefault()

        const form = e.target
        const email = form[0].value
        const password = form[1].value

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            alert(error.message)
        } else {
            onLogin()
            navigate('/')
        }
    }

    return (
        <div className="login-page">

            {/* DESKTOP VIEW */}
            <div className={`login-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>

                {/* SIGN UP */}
                <div className="form-container sign-up-container">
                    <form className="login-form" onSubmit={handleSignUp}>
                        <h1>Create Account</h1>
                        <input type="text" placeholder="Name" required />
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit" className="login-primary-btn">Sign Up</button>
                    </form>
                </div>

                {/* SIGN IN */}
                <div className="form-container sign-in-container">
                    <form className="login-form" onSubmit={handleSignIn}>
                        <h1>Sign In</h1>
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit" className="login-primary-btn">Sign In</button>
                    </form>
                </div>

                {/* OVERLAY */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <button
                                className="login-ghost-btn"
                                onClick={() => setIsRightPanelActive(false)}
                            >
                                Sign In
                            </button>
                        </div>

                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <button
                                className="login-ghost-btn"
                                onClick={() => setIsRightPanelActive(true)}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* MOBILE VIEW */}
            <div className="login-mobile">
                <div className="login-mobile__content">

                    {isMobileLogin ? (
                        <form className="login-mobile__form" onSubmit={handleSignIn}>
                            <h2>Sign In</h2>
                            <input type="email" placeholder="Email Address" required />
                            <input type="password" placeholder="Password" required />
                            <button type="submit" className="login-mobile-btn">
                                SIGN IN
                            </button>
                        </form>
                    ) : (
                        <form className="login-mobile__form" onSubmit={handleSignUp}>
                            <h2>Create Account</h2>
                            <input type="text" placeholder="Full Name" required />
                            <input type="email" placeholder="Email Address" required />
                            <input type="password" placeholder="Password" required />
                            <button type="submit" className="login-mobile-btn">
                                CREATE ACCOUNT
                            </button>
                        </form>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsMobileLogin(!isMobileLogin)}
                        style={{ marginTop: '10px' }}
                    >
                        {isMobileLogin ? "Create Account" : "Sign In"}
                    </button>

                    <div style={{ marginTop: '15px' }}>
                        <Link to="/">&larr; Back to Home</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Login