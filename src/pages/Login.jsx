import { FloatingLabel } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import API_URL from "../config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider.jsx";
import { useState } from "react";

function Login(){
    
    const navigate = useNavigate();
    const { login } = useAuth();
    const[error, setError] = useState(null);

    // Validate login form values before submitting
    const validate = (email, password) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !password) return "Please fill in email or password.";
        if (!emailRegex.test(email)) return "Please enter a valid email address.";
        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;

        const validationError = validate(email, password);
        if (validationError){
            setError({ success:false, message:validationError });
            return;
        }

        try {
            const result = await login(email, password);
            setError(result);
            if (result.success){
                setTimeout(() => navigate('/'), 1000);
            }
        }catch(error){
            setError({success: false, message: error})
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
                    
                    {error && (
                        <p style={{ color: error.success ? "green": "red", fontSize:"0.875rem" }}>{error.message}</p>
                    )}
                    
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