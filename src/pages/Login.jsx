import { FloatingLabel } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import API_URL from "../config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider.jsx";

function Login(){
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;

        try {
            await login(email, password);
            navigate('/ratedRentals');
        }catch(error){
            console.log(error);
        }
    }
    

    return(
        <>
            <div className="login-wrapper">
                <div className="login-card">
                    <h1>Log in</h1>
                    <p>Enter your credentials to continue</p>
                    <form onSubmit={handleSubmit}>
                    <FloatingLabel  label="Email Address" className="mb-3">
                        <Form.Control type="email" name="email" id="email" placeholder="name@example.com" />
                    </FloatingLabel>
                     <FloatingLabel  label="Password" id="password" className="mb-3">
                        <Form.Control type="password" name="password" placeholder="Password" />
                    </FloatingLabel>
                    <Button variant="primary" type="submit" className="w-100">Sign in</Button>
                    <p className="login-footer">Don't have an account? 
                        <Link to="/register"> Register</Link></p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;