import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import './FindDoctors.css'

/* ── Icons ── */
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
)

const DoctorIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
)

const SpinnerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="spinner-icon">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
)

function FindDoctors() {
    const [searchParams] = useSearchParams()
    const [symptom, setSymptom] = useState('')
    const [results, setResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [expandedId, setExpandedId] = useState(null)

    // Pick up query from URL (from the global search bar)
    useEffect(() => {
        const q = searchParams.get('q')
        if (q) {
            setSymptom(q)
            performSearch(q)
        }
    }, [searchParams])

    // ─── Setup Supabase Connection ───
    const SUPABASE_URL = "https://axzrjouxhlargxdyiuuh.supabase.co"
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4enJqb3V4aGxhcmd4ZHlpdXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODExNDMsImV4cCI6MjA4Nzc1NzE0M30.yKILImV90BXZ38oTh8cZTpRb3gwc6d4LEntXhTGRVuE"

    const detectSpecialist = (text) => {
        text = text.toLowerCase().trim()
        const mapping = [
            { specialist: "Orthopedic", keywords: ["knee", "joint", "bone", "fracture", "back"] },
            { specialist: "Cardiologist", keywords: ["chest", "heart", "breath", "pressure"] },
            { specialist: "Dermatologist", keywords: ["skin", "rash", "itch", "acne"] },
            { specialist: "Dentist", keywords: ["tooth", "gum", "jaw"] },
            { specialist: "Neurologist", keywords: ["headache", "migraine", "dizziness"] }
        ]

        let bestMatch = "General Physician"
        let maxScore = 0

        mapping.forEach(group => {
            let score = 0
            group.keywords.forEach(keyword => {
                if (text.includes(keyword)) score++
            })

            if (score > maxScore) {
                maxScore = score
                bestMatch = group.specialist
            }
        })
        return bestMatch
    }

    const performSearch = async (query) => {
        setIsSearching(true)
        setHasSearched(true)
        setResults([])

        const specialist = detectSpecialist(query)
        console.log("Detected Specialist:", specialist)

        try {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/doctors?specialist=ilike.*${encodeURIComponent(specialist)}*`,
                {
                    headers: {
                        apikey: SUPABASE_KEY,
                        Authorization: `Bearer ${SUPABASE_KEY}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()
            console.log("Doctors returned:", data)

            if (data && data.length > 0) {
                // Default sort by distance (lowest first)
                data.sort((a, b) => a.distance - b.distance)

                // Map database columns to our component's expected format
                const mappedResults = data.map(doc => ({
                    id: doc.id,
                    name: doc.name,
                    specialty: doc.specialist, // API uses 'specialist'
                    clinic_name: doc.clinic_name, // extra DB field
                    address: doc.address, // extra DB field
                    price: doc.price, // extra DB field
                    distance: doc.distance, // extra DB field
                    rating: 4.8, // Mocked rating since DB lacks it
                    reviews: Math.floor(Math.random() * 200) + 50, // Mocked reviews
                    available: true, // Mocked availability
                    experience: '10+ years', // Mocked experience
                }))

                setResults(mappedResults)
            } else {
                setResults([])
            }
        } catch (error) {
            console.error("Database connection error:", error)
            setResults([])
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <div className="find-doctors" id="find-doctors-page">
            {/* ── Header ── */}
            <div className="find-doctors__header">
                <div className="find-doctors__title-badge">
                    <span className="find-doctors__shield-icon">🛡️</span>
                    Medrox
                </div>
                <h1 className="find-doctors__title">Find the Right Doctor</h1>
                <p className="find-doctors__subtitle">
                    Describe your symptoms and let our AI match you with the best specialists
                </p>
            </div>            {/* ── Results Section ── */}
            <div className="find-doctors__results" id="results">
                {isSearching && (
                    <div className="find-doctors__loading">
                        <div className="find-doctors__loading-pulse"></div>
                        <p>Analyzing symptoms and finding the best doctors for you...</p>
                    </div>
                )}

                {!isSearching && hasSearched && results.length === 0 && (
                    <div className="find-doctors__empty">
                        <p>No doctors found matching your symptoms. Try a different description.</p>
                    </div>
                )}

                {!isSearching && results.length > 0 && (
                    <>
                        <h2 className="find-doctors__results-title">
                            Found <span>{results.length}</span> doctors for "{symptom}"
                        </h2>
                        <div className="find-doctors__results-grid">
                            {results.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    className={`doctor-card ${expandedId === doctor.id ? 'doctor-card--expanded' : ''}`}
                                    id={`doctor-${doctor.id}`}
                                    onClick={() => setExpandedId(expandedId === doctor.id ? null : doctor.id)}
                                >
                                    <div className="doctor-card__header-content">
                                        <div className="doctor-card__avatar">
                                            <DoctorIcon />
                                        </div>
                                        <div className="doctor-card__info">
                                            <h3 className="doctor-card__name">{doctor.name}</h3>
                                            <p className="doctor-card__specialty">{doctor.specialty}</p>
                                            <p className="doctor-card__clinic" style={{ fontSize: '13px', color: '#555', margin: '4px 0 2px' }}>
                                                🏥 {doctor.clinic_name}
                                            </p>
                                            <p className="doctor-card__address" style={{ fontSize: '13px', color: '#777', margin: '0 0 4px' }}>
                                                📍 {doctor.address} ({doctor.distance} km away)
                                            </p>
                                            <p className="doctor-card__price" style={{ fontSize: '14px', fontWeight: '600', color: '#0B7C91', margin: '4px 0 8px' }}>
                                                💰 ₹{doctor.price}
                                            </p>
                                            <div className="doctor-card__rating">
                                                <StarIcon />
                                                <span className="doctor-card__rating-value">{doctor.rating}</span>
                                                <span className="doctor-card__reviews">({doctor.reviews} reviews)</span>
                                            </div>
                                        </div>
                                        <div className="doctor-card__actions">
                                            <span className={`doctor-card__status ${doctor.available ? 'doctor-card__status--available' : 'doctor-card__status--unavailable'}`}>
                                                {doctor.available ? 'Available' : 'Unavailable'}
                                            </span>
                                            <button className="doctor-card__book-btn" disabled={!doctor.available} onClick={(e) => e.stopPropagation()}>
                                                {doctor.available ? 'Book Appointment' : 'Join Waitlist'}
                                            </button>
                                        </div>
                                    </div>

                                    {expandedId === doctor.id && (
                                        <div className="doctor-card__details">
                                            <h4>About {doctor.name}</h4>
                                            <p>Experienced {doctor.specialty} with over {doctor.experience} of clinical practice. Dedicated to providing personalized and comprehensive care.</p>
                                            <div className="doctor-card__schedule">
                                                <strong>Consultation Hours:</strong> Mon-Fri, 9:00 AM - 5:00 PM
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!hasSearched && (
                    <div className="find-doctors__placeholder">
                        <div className="find-doctors__placeholder-icon">🩺</div>
                        <h3>Start by describing your symptoms</h3>
                        <p>Our AI will analyze your symptoms and recommend the best doctors in your area</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FindDoctors
