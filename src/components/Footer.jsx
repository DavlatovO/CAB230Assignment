import { Link } from 'react-router-dom'

function Footer(){
    return (
        <footer className="footer">
            <div className="footer-section">
                <div className="footer-col">
                    <h4>Explore</h4>
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/rentalSearch">Rental Search</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>

                <div className="footer-col">
                    <h4>Help</h4>
                    <a>Email: davlatovoybek007@gmail.com</a>
                    <a>Phone: +61 123 456 789</a>
                </div>
                <div className="footer-col">
                    <h4>Locations</h4>
                    <a href="#">Brisbane</a>
                    <a href="#">Sydney</a>
                    <a href="#">Melbourne</a>
                    <a href="#">Perth</a>
                </div>

            <div className="footer-bottom">
                <span>© 2026 CAB230 Student. All rights reserved</span>
                <div className="footer-bottom-links">
                    <a href="#">Terms of Use</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Cookie Settings</a>
                </div>
            </div>
            </div>
        </footer>
    );
}
export default Footer;









{/* <div className="footer-container">
                <div className="footer-section">
                    <h3>Real Estate</h3>
                    <p>Find your dream home anywhere in Australia</p>
                </div>

                <div className="footer-seciton">
                    <h4>Qick Links</h4>
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Rental Search</a>
                    <a href="#">Login</a>
                    <a href="#">Register</a>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Email: davlatovoybek007@gmail.com</p>
                    <p>Phone: +61 123 456 789</p>
                </div>

                <div className="footer-bottom">
                    <p>© CAB230 Student, 2026</p>
                </div>
            </div> */}