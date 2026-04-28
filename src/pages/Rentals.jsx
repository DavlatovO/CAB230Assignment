import { useState, useEffect } from "react";
import {useNavigate, useSearchParams } from 'react-router-dom';
import Description from "../services/Description";
import image from '../assets/image.png';
import agency_pic from '../assets/agency.png'
import MapProperty from "../services/Map";

function Rentals() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [rental, setRental] = useState(null);

    useEffect(() => {
        const fetchRental = async () =>{
            const response = await fetch(`http://4.237.58.241:3000/rentals/${id}`);
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
                        <p className="address">{rental.streetAddress}, {rental.suburb}, {rental.state}</p>
                        
                        <div className="info-row">
                            <span className="stat-pill">🛏️{rental.bedrooms} beds</span>
                            <span className="stat-pill">🛁{rental.bathrooms} baths</span>
                            <span className="stat-pill">🚘{rental.parkingSpaces} cars</span>
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
        </>

    );
}
export default Rentals;