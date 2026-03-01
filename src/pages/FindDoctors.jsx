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
    const [bookingStatus, setBookingStatus] = useState(''); // '' | 'loading' | 'success' | 'error'
    const location = useLocation();

    const bookAppointment = async () => {
        setBookingStatus('loading');
        try {
            // 1. Get logged-in user
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) {
                alert('Please log in to book an appointment.');
                setBookingStatus('error');
                return;
            }

            const user = userData.user;
            const userId = user.id;
            const patientName = user.user_metadata?.full_name || user.email;

            // 2. Insert appointment using auth user data
            const { error: insertError } = await supabase
                .from('appointments')
                .insert({
                    user_id: userId,
                    patient_id: userId,
                    patient_name: patientName,
                    appointment_date: selectedDate,
                    appointment_time: selectedTime
                });

            if (insertError) {
                console.error('Insert error:', insertError);
                alert('Failed to book appointment. Please try again.');
                setBookingStatus('error');
                return;
            }

            setBookingStatus('success');
        } catch (err) {
            console.error('Booking error:', err);
            alert('Something went wrong. Please try again.');
            setBookingStatus('error');
        }
    };

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const specialty = queryParams.get("specialty");

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

            // First: try matching by extracted specialty
            if (specialty) {
                const { data: specialtyData, error: specialtyError } = await supabase
                    .from("doctors")
                    .select("*")
                    .ilike("specialization", `%${specialty}%`);

                if (!specialtyError && specialtyData && specialtyData.length > 0) {
                    setResults(specialtyData);
                    setLoading(false);
                    return;
                }
            }

            // Fallback: AND matching on symptoms column
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
    }, [query, specialty]);

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
                                <button className="doctor-card-book-btn doctor-card-expanded-book-btn" onClick={() => { setShowBooking(true); setBookingStatus(''); }}>Book Appointment</button>
                                {showBooking && (
                                    <div className="booking-card booking-card-modal" onClick={e => e.stopPropagation()}>
                                        {bookingStatus === 'success' ? (
                                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                                                <h3 style={{ color: 'var(--deep-teal)', marginBottom: 8 }}>Appointment Booked!</h3>
                                                <p style={{ color: 'var(--gray-text)', fontSize: 15 }}>Your appointment on <b>{selectedDate}</b> at <b>{selectedTime}</b> has been confirmed.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <h3>Book Appointment</h3>
                                                <label>
                                                    Date:
                                                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="booking-date-input" />
                                                </label>
                                                <label>
                                                    Time:
                                                    <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="booking-time-input" />
                                                </label>
                                                <button
                                                    className="doctor-card-book-btn"
                                                    style={{ marginTop: 16 }}
                                                    onClick={bookAppointment}
                                                    disabled={!selectedDate || !selectedTime || bookingStatus === 'loading'}
                                                >
                                                    {bookingStatus === 'loading' ? 'Booking...' : 'Confirm Booking'}
                                                </button>
                                            </>
                                        )}
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