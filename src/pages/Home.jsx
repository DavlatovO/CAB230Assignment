import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import { Bath, BedSingle, Car } from "lucide-react";
import defaultImage from "../assets/image.png";


function PropertyCard({ rental }) {
    const navigate = useNavigate();
    return (
        <div className="property-card" onClick={() => navigate(`/rentals/${rental.id}`)}>
            <div className="property-card-image">
                <span className="badge-type">{rental.propertyType}</span>
                <img src={defaultImage} alt="alt" />
            </div>
            <div className="property-card-body">
                <h3>{rental.title}</h3>
                <p className="property-address">
                    <span className="pin">📍</span>
                    {rental.suburb}, {rental.state}
                </p>
                <p className="property-price">${rental.rent.toLocaleString()} <span>/wk</span></p>
                <div className="property-divider" />
                <div className="property-stats">
                    <span><BedSingle size={18} /><strong>{rental.bedrooms}</strong></span>
                    <span><Bath size={18} strokeWidth={2.3} /><strong>{rental.bathrooms}</strong></span>
                    <span><Car size={18} strokeWidth={2.3} /><strong>{rental.parkingSpaces}</strong></span>
                </div>
            </div>
        </div>
    );
}

function Home() {
    const navigate = useNavigate();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [states, setStates] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);

    const [quickFilter, setQuickFilter] = useState({
        propertyType: "",
        state: "",
        maximumRent: "",
    });

    const fetchRentals = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.propertyType) params.append("propertyTypes", filters.propertyType);
            if (filters.state)        params.set("state", filters.state);
            if (filters.maximumRent)  params.set("maximumRent", filters.maximumRent);

            const response = await fetch(`${API_URL}/rentals/search?${params.toString()}`);
            if (!response.ok) { setError("Failed to load properties."); return; }
            const data = await response.json();
            setRentals(data.data.slice(0, 6));
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRentals();

        fetch(`${API_URL}/rentals/states`)
            .then(r => r.json())
            .then(setStates)
            .catch(err => console.error("Failed to load states:", err));

        fetch(`${API_URL}/rentals/property-types`)
            .then(r => r.json())
            .then(setPropertyTypes)
            .catch(err => console.error("Failed to load property types:", err));
    }, []);

    const handleSearch = () => {
        fetchRentals(quickFilter);  // fetch with filters, stay on page
    };

    return (
        <>
            <section className="hero-page">
                <div className="hero-content">
                    <h1>Find your dream home</h1>
                    <p>Search properties in Australia</p>
                </div>
                <div className="search-bar-wrapper">
                    <div className="search-bar mt-4">
                        <select
                            className="form-select"
                            value={quickFilter.propertyType}
                            onChange={e => setQuickFilter({ ...quickFilter, propertyType: e.target.value })}
                        >
                            <option value="">Property Type</option>
                            {propertyTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>

                        <select
                            className="form-select"
                            value={quickFilter.state}
                            onChange={e => setQuickFilter({ ...quickFilter, state: e.target.value })}
                        >
                            <option value="">State</option>
                            {states.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <select
                            className="form-select"
                            value={quickFilter.maximumRent}
                            onChange={e => setQuickFilter({ ...quickFilter, maximumRent: e.target.value })}
                        >
                            <option value="">Max Rent</option>
                            <option value="500">Up to $500/wk</option>
                            <option value="1000">Up to $1,000/wk</option>
                            <option value="1500">Up to $1,500/wk</option>
                            <option value="2000">Up to $2,000/wk</option>
                        </select>

                        <button className="btn btn-success" onClick={handleSearch}>Search</button>
                        <button className="btn btn-outline-secondary" onClick={() => navigate("/rentalSearch")}>
                            Advanced Search
                        </button>
                    </div>
                </div>
            </section>

            <section className="listings-section">
                <div className="listings-header">
                    <h2>Latest Listings</h2>
                    <p>Freshly available properties across Australia</p>
                </div>

                {loading && <p className="listings-status">Loading properties...</p>}
                {error && <p className="listings-status" style={{ color: "red" }}>{error}</p>}

                <div className="property-grid">
                    {rentals.map(rental => (
                        <PropertyCard key={rental.id} rental={rental} />
                    ))}
                </div>
            </section>
        </>
    );
}

export default Home;