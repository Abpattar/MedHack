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

    // Pick up query from URL (from the global search bar)
    useEffect(() => {
        const q = searchParams.get('q')
        if (q) {
            setSymptom(q)
            performSearch(q)
        }
    }, [searchParams])

    const performSearch = async (query) => {
        setIsSearching(true)
        setHasSearched(true)
        setResults([])

        // ─── Placeholder: replace with actual API / database call ───
        // Simulating a search delay
        await new Promise((resolve) => setTimeout(resolve, 1200))

        // Demo results — will be replaced with real data from your database
        const demoResults = [
            {
                id: 1,
                name: 'Dr. Sarah Mitchell',
                specialty: 'General Physician',
                rating: 4.8,
                reviews: 124,
                available: true,
                experience: '12 years',
            },
            {
                id: 2,
                name: 'Dr. Rajesh Kumar',
                specialty: 'Cardiologist',
                rating: 4.9,
                reviews: 89,
                available: true,
                experience: '18 years',
            },
            {
                id: 3,
                name: 'Dr. Emily Chen',
                specialty: 'Dermatologist',
                rating: 4.7,
                reviews: 156,
                available: false,
                experience: '8 years',
            },
            {
                id: 4,
                name: 'Dr. Ahmed Hassan',
                specialty: 'Neurologist',
                rating: 4.6,
                reviews: 67,
                available: true,
                experience: '15 years',
            },
        ]

        setResults(demoResults)
        setIsSearching(false)
    }

    const searchDoctors = (e) => {
        e.preventDefault()
        if (symptom.trim()) {
            performSearch(symptom.trim())
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
            </div>

            {/* ── Search Section ── */}
            <form className="find-doctors__search" onSubmit={searchDoctors}>
                <div className="find-doctors__search-box">
                    <span className="find-doctors__search-icon">
                        <SearchIcon />
                    </span>
                    <input
                        id="symptom-input"
                        type="text"
                        className="find-doctors__search-input"
                        placeholder="Describe your symptoms... (e.g., headache, chest pain, skin rash)"
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                    />
                </div>
                <button type="submit" className="find-doctors__search-btn" id="search-doctors-btn" disabled={isSearching}>
                    {isSearching ? (
                        <>
                            <SpinnerIcon /> Searching...
                        </>
                    ) : (
                        <>
                            <SearchIcon /> Search Doctors
                        </>
                    )}
                </button>
            </form>

            {/* ── Results Section ── */}
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
                                <div key={doctor.id} className="doctor-card" id={`doctor-${doctor.id}`}>
                                    <div className="doctor-card__avatar">
                                        <DoctorIcon />
                                    </div>
                                    <div className="doctor-card__info">
                                        <h3 className="doctor-card__name">{doctor.name}</h3>
                                        <p className="doctor-card__specialty">{doctor.specialty}</p>
                                        <p className="doctor-card__experience">{doctor.experience} experience</p>
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
                                        <button className="doctor-card__book-btn" disabled={!doctor.available}>
                                            {doctor.available ? 'Book Appointment' : 'Join Waitlist'}
                                        </button>
                                    </div>
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
