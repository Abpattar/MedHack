import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { extractSpecialty } from "../utils/extractSpecialty";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!query.trim()) return;
        const specialty = extractSpecialty(query);
        navigate(`/find-doctors?query=${encodeURIComponent(query)}&specialty=${encodeURIComponent(specialty)}`);
    };

    return (
        <div className="floating-search-wrapper">
            <div className="floating-search">
                <input
                    type="text"
                    placeholder="Search symptoms, doctors..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />

                <button onClick={handleSearch}>
                    ✈
                </button>
            </div>
        </div>
    );
}