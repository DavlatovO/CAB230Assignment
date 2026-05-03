import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from "../services/AuthProvider";

function NavBar(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () =>{
        logout();
        setTimeout(() => navigate("/"), 1000);
    }

    return (
        <Navbar className="custom-navbar" expand="lg" >
            <Container>
                {/* Logo */}
                <Navbar.Brand as={Link} to="/">Rental Web</Navbar.Brand>

                {/* Menus */}
                <Navbar.Toggle aria-controls="main-navbar"/>
                <Navbar.Collapse id="main-navbar">
                <Nav className="ms-auto nav-links">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="about">About</Nav.Link>
                    <Nav.Link as={Link} to="rentalSearch">Rental Search</Nav.Link>
                    { user ? (
                        //logged in
                        <>
                        <Nav.Link as={Link} to="ratedRentals">My Rated Rentals</Nav.Link>
                        {/* <Navbar.Text className="nav-greeting">Hi, {user}</Navbar.Text> */}
                        <Nav.Link onClick={handleLogout} className="nav-logout">Log out</Nav.Link>
                        </>
                    ) : (
                        //logged out
                        <>
                        <Nav.Link as={Link} to="login">Login</Nav.Link>
                        <Nav.Link as={Link} to="register">Register</Nav.Link>
                        </>
                    )}

                </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
    }
export default NavBar;