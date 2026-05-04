import { useState, useEffect } from "react";
import {useNavigate, useParams } from 'react-router-dom';
import Description from "../services/Description";
import image from '../assets/image.png';
import agency_pic from '../assets/agency.png'
import MapProperty from "../services/Map";
import API_URL from "../config";
import { createPortal } from "react-dom";
import { Car, Bath, BedSingle } from "lucide-react";



// Page component for viewing a single rental and submitting a rating
function Rentals() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [rental, setRental] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedStar, setSelectedStar] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    
    useEffect(() => {
        if (!id) return;
        const fetchRental = async () =>{
            const response = await fetch(`${API_URL}/rentals/${id}`);
            if(!response.ok){
                throw new Error("Error in fetching...");
            }
            const data = await response.json();
            setRental(data);
        }
        fetchRental();
    }, [id])

    if(rental === null){
        return(<p>Loading...</p>);
    }

    // Send the user's selected rating for this rental to the API
    const submitRating = async () => {
        const token = localStorage.getItem("token");

        // Guard: no token at submit time (e.g. token was cleared mid-session)
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/ratings/rentals/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ rating: selectedStar })
            });

            // Redirect to login if token is expired or unauthorised
            if (response.status === 401) {
                localStorage.removeItem("token"); // clear stale token
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to submit rating");
            }

            setSubmitted(true);
            setTimeout(() => {
                setShowRatingModal(false);
                setSelectedStar(0);
                setSubmitted(false);
                fetch(`${API_URL}/rentals/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                })
                    .then(res => res.json())
                    .then(data => setRental(data));
            }, 1500);

        } catch (err) {
            console.error("Rating error: ", err);
        }
        };
    // Require login before showing the rating modal
    const handleRateClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        } else {
            setShowRatingModal(true);
        }
    }
   

    return (
        <>
            <section className="first-page">
                <div className="hero-label">
                    <h1 className="title">{rental.title}</h1>
                    <p className="address">{rental.streetAddress}</p>
                </div>
            </section>
            <section className="details-page">
                <div className="image-grid">
                    <div className="main-image">
                        <img src={image} />
                    </div>
                    <div className="side-images">
                        <img src={image} alt="Property"/>
                        <img src={image} />
                    </div>
                </div>


                <div className="content-row">
                    <div className="left-content">
                        <div className="price-row">
                            <span className="price-main">${rental.rent} /</span>
                            <span className="price-per">week</span>
                        </div>
                        <p className="address">{rental.streetAddress}, {rental.suburb}, {rental.state} {rental.postcode}</p>
                        <div className="rating-row">
                            <span className="stars">
                                {"★".repeat(Math.floor(rental.averageRating))}
                                {"☆".repeat(5 - Math.floor(rental.averageRating))} 
                            </span>
                            <span className="rating-value">{rental.averageRating}</span>
                            <span className="rating-count">({rental.numRatings})</span>
                            <p className="rate" onClick={handleRateClick}>Rate this property</p>
                        </div>
                        <div className="info-row">
                            <span className="stat-pill"><BedSingle size={25} strokeWidth={1.5}/>{rental.bedrooms}</span>
                            <span className="stat-pill"><Bath size={25} strokeWidth={1.5}/>{rental.bathrooms}</span>
                            <span className="stat-pill"><Car size={25} strokeWidth={1.5}/>{rental.parkingSpaces}</span>
                            <span className="stat-pill">{rental.propertyType}</span>
                        </div>
                        <p className="extra-note">{rental.amenities}</p>

                        <p className="section-label">About this property</p>
                        <Description description={rental.description} />
                    </div>
                
                    <div className="agency-card">
                        <img src={agency_pic} />
                        <h3>{}</h3>
                        <p>{rental.agencyName}</p>
                        <button>Contact Agent</button>
                    </div>
                </div>  

                <div className="map-section">
                    <p>Location</p>
                    <div className="map-wrapper">
                        <MapProperty lat={rental.latitude} longt={rental.longitude} />
                    </div>
                </div>  
            </section>
            {showRatingModal && createPortal(
            <div 
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 99999
                }}
                onClick={() => setShowRatingModal(false)}
            >
                <div 
                    style={{
                        background: "white",
                        padding: "2rem",
                        borderRadius: "16px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        width: "400px",
                        gap: "1.5rem",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                    }}
                    onClick={e => e.stopPropagation()}
                > {submitted ? (
                    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem"}}>
                        <span style={{fontSize: "3rem"}}>✅</span>
                        <h3>Thanks for your rating!</h3>
                        <p style={{color: "#888", fontSize: "0.9rem"}}>Your feedback helps others find great homes.</p>

                    </div>
                ):(
                    <>
                    <h3>Rate this property</h3>
                    <div className="star-selector">
                        {[1,2,3,4,5].map(star => (
                            <span
                                key={star}
                                style={{color: star <= (hoveredStar || selectedStar) ? "#f5a623" : "#ccc", fontSize: "2rem", cursor: "pointer"}}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                onClick={() => setSelectedStar(star)}
                            >★</span>
                        ))}
                    </div>
                    <button onClick={submitRating} disabled={!selectedStar}>Submit</button>
                    <button onClick={() => setShowRatingModal(false)}>Cancel</button>
                    </>


                )}
                </div>
            </div>,
            document.body
             )}
        </>

    );
}
export default Rentals;