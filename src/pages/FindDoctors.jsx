import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabase";

export default function FindDoctors() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!query) {
                setResults([]);
                return;
            }

            setLoading(true);

            const words = query.toLowerCase().split(" ");

            const filter = words
                .map(word => `symptoms.ilike.%${word}%`)
                .join(",");

            const { data, error } = await supabase
                .from("doctors")
                .select("*")
                .or(filter);

            if (error) console.error(error);
            else setResults(data);

            setLoading(false);
        };

        fetchDoctors();
    }, [query]);

    return (
        <div style={{ padding: "40px" }}>
            <h2>
                {query
                    ? `Doctors for: ${query}`
                    : "Search for a symptom using the bar below"}
            </h2>

            {loading && <p>Loading...</p>}

            {!loading && results.length === 0 && query && (
                <p>No doctors found.</p>
            )}

            {!loading &&
                results.map((doc) => (
                    <div key={doc.id} style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        background: "#ffffff"
                    }}>
                        <h3>{doc.name}</h3>
                        <p><b>Specialization:</b> {doc.specialization}</p>
                        <p><b>Location:</b> {doc.location}</p>
                        <p><b>Experience:</b> {doc.experience_years} years</p>
                        <p><b>Consultation Fee:</b> ₹{doc.consultation_fee}</p>
                        <p><b>Phone:</b> {doc.phone}</p>
                    </div>
                ))}
        </div>
    );
}