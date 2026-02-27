import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import './FindDoctors.css';

export default function FindDoctors() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
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
            <h2 className="find-doctors-title">
                {query
                    ? `Doctors for: ${query}`
                    : "Search for a symptom using the bar below"}
            </h2>

            {loading && <p>Loading...</p>}

            {!loading && results.length === 0 && query && (
                <p>No doctors found.</p>
            )}

            {!loading && results.length > 0 && (
                <div className="find-doctors-row">
                    {results.map((doc) => (
                        <div
                            key={doc.id}
                            className="doctor-card"
                            onClick={() => setExpandedId(doc.id)}
                        >
                            <h3>{doc.name}</h3>
                            <p><b>Specialization:</b> {doc.specialization}</p>
                            <p><b>Location:</b> {doc.location}</p>
                            <p><b>Experience:</b> {doc.experience_years} years</p>
                            <p><b>Fee:</b> ₹{doc.consultation_fee}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Expanded doctor card */}
            {expandedId && (
                <div className="doctor-card-expanded">
                    <button className="doctor-card-close-btn" onClick={() => setExpandedId(null)}>Close</button>
                    {results.filter(doc => doc.id === expandedId).map(doc => (
                        <>
                            <h2>{doc.name}</h2>
                            <p><b>Specialization:</b> {doc.specialization}</p>
                            <p><b>Location:</b> {doc.location}</p>
                            <p><b>Experience:</b> {doc.experience_years} years</p>
                            <p><b>Consultation Fee:</b> ₹{doc.consultation_fee}</p>
                            <p><b>Phone:</b> {doc.phone}</p>
                            <p><b>Email:</b> {doc.email}</p>
                            <p><b>About:</b> {doc.about || 'No details available.'}</p>
                            <button className="doctor-card-book-btn">Book Appointment</button>
                        </>
                    ))}
                </div>
            )}
        </div>
    );
}