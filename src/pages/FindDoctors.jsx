import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import './FindDoctors.css';

export default function FindDoctors() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showBooking, setShowBooking] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!query || query.trim() === "") {
                setResults([]);
                return;
            }

            setLoading(true);

            const words = query
                .toLowerCase()
                .trim()
                .split(/\s+/);

            // AND matching logic
            let queryBuilder = supabase
                .from("doctors")
                .select("*");

            words.forEach(word => {
                queryBuilder = queryBuilder.ilike("symptoms", `%${word}%`);
            });

            const { data, error } = await queryBuilder;

            if (error) {
                console.error("Supabase error:", error);
            } else {
                setResults(data);
            }

            setLoading(false);
        };

        fetchDoctors();
    }, [query]);

    return (
        <div className="find-doctors-container">
            <div className="find-doctors-header-row find-doctors-header-center">
                <span className="find-doctors-title-badge">Doctors for:</span>
                <h2 className="find-doctors-title-main">{query ? query : "Search for a symptom using the bar below"}</h2>
            </div>

            {loading && <p>Loading...</p>}

            {!loading && results.length === 0 && query && (
                <p>No doctors found.</p>
            )}

            {!loading && results.length > 0 && (
                <div className="find-doctors-row">
                    {results.map((doc) => (
                        <div
                            key={doc.id}
                            className="doctor-card doctor-card-glow"
                            onClick={() => { setExpandedId(doc.id); setShowBooking(false); }}
                        >
                            <div className="doctor-card-photo-placeholder">
                                <img src="/default-doctor.svg" alt="" />
                            </div>
                            <div className="doctor-card-content">
                                <h3>{doc.name}</h3>
                                <p><b>Specialization:</b> {doc.specialization}</p>
                                <p><b>Location:</b> {doc.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Expanded doctor modal */}
            {expandedId && (() => {
                const doc = results.find(d => d.id === expandedId);
                if (!doc) return null;
                return (
                    <div className="doctor-card-expanded-modal-bg" onClick={() => { setExpandedId(null); setShowBooking(false); }}>
                        <div className="doctor-card-expanded-modal" onClick={e => e.stopPropagation()}>
                            <button className="doctor-card-expanded-close" onClick={() => { setExpandedId(null); setShowBooking(false); }}>×</button>
                            <div className="doctor-card-expanded-img">
                                <img src="/default-doctor.svg" alt="" />
                            </div>
                            <div className="doctor-card-expanded-main-content">
                                <h2>{doc.name}</h2>
                                <div className="doctor-card-expanded-specialization">{doc.specialization}</div>
                                <div className="doctor-card-expanded-location">{doc.location}</div>
                                <div className="doctor-card-expanded-details">
                                    <div><b>Experience:</b> {doc.experience_years} years</div>
                                    <div><b>Consultation Fee:</b> ₹{doc.consultation_fee}</div>
                                    <div><b>Phone:</b> {doc.phone}</div>
                                    <div><b>Email:</b> {doc.email}</div>
                                    <div><b>About:</b> {doc.about || 'No details available.'}</div>
                                </div>
                                <button className="doctor-card-book-btn doctor-card-expanded-book-btn" onClick={() => setShowBooking(true)}>Book Appointment</button>
                                {showBooking && (
                                    <div className="booking-card booking-card-modal" onClick={e => e.stopPropagation()}>
                                        <h3>Book Appointment</h3>
                                        <label>
                                            Date:
                                            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="booking-date-input" />
                                        </label>
                                        <label>
                                            Time:
                                            <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="booking-time-input" />
                                        </label>
                                        <button className="doctor-card-book-btn" style={{marginTop: 16}} onClick={() => alert(`Appointment booked for ${selectedDate} at ${selectedTime}`)} disabled={!selectedDate || !selectedTime}>
                                            Confirm Booking
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}


        </div>
    );
}