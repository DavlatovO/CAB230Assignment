import { useState, useEffect } from "react";
import {useNavigate, useSearchParams } from 'react-router-dom';
import Description from "../services/Description";
import image from '../assets/image.png';
import agency_pic from '../assets/agency.png'

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
   

    return (<div className="rentals-container">
        <section className="first-page">
            <h2>{rental.title}</h2>
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
        </section>
    </div>);
}
export default Rentals;