import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Nav, Container } from 'react-bootstrap';

function NavBar(){
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
                <Nav.Link as={Link} to="ratedRentals">Rated Rentals</Nav.Link>
                <Nav.Link as={Link} to="login">Login</Nav.Link>
                <Nav.Link as={Link} to="register">Register</Nav.Link>
            </Nav>
            </Navbar.Collapse>

        </Container>
    </Navbar>
 );
}
export default NavBar;