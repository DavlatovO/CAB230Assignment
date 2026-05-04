import { Link, useNavigate } from "react-router-dom";
import { FloatingLabel, Form, Button } from "react-bootstrap";
import API_URL from "../config";
import { useState } from "react";

function Register() {
    const [feedback, setFeedback] = useState(null);
    const navigate = useNavigate();

    // Validate register form entries before submission
    const validate = (email, password) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !password) return "Please fill in both email and password.";
        if (!emailRegex.test(email)) return "Please enter a valid email address.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
        return null;
    };
  
    // Register a new user and redirect to login on success
    const register = async (event) => {
        event.preventDefault();

        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;

        const validationError = validate(email, password);
        if (validationError){
          setFeedback({ success:false, message:validationError });
          return;
        }
                
        try{
            const response = await fetch(`${API_URL}/user/register`,{
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ email, password })
            });
        
            if (response.status === 409) {
              const data = await response.json();
              setFeedback({ success:false, message: data.message });
              return;
            }
          
            if(!response.ok){
              setFeedback("Something went wrong. Please try again.");
              return;
            }
            const data = await response.json();
            localStorage.setItem("token", data.token);
            setTimeout(() => navigate("/login"), 1000);
        
          } catch(err){
               setFeedback({ success:false, message:err });}
            
    };


  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h1>Create account</h1>
        <form onSubmit={register}>
        <FloatingLabel label="Email address" className="mb-3">
          <Form.Control type="email" name="email" id="email" placeholder="name@example.com" />
        </FloatingLabel>

        <FloatingLabel  label="Password" className="mb-3">
          <Form.Control type="password" name="password" id="password" placeholder="Password" />
        </FloatingLabel>

          {feedback && (
            <p style={{ color: feedback.success ? "green": "red", fontSize:"0.875rem" }}>{feedback.message}</p>
          )}

        <Button variant="primary" type="submit" className="register-submit">Register</Button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;