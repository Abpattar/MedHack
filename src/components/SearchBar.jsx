import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SearchBar.css'

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

function SearchBar() {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            // Navigate to Find Doctors page with the search query
            navigate(`/find-doctors?q=${encodeURIComponent(query.trim())}`)
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

export default SearchBar
