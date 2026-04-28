import { Link, useNavigate } from "react-router-dom";
import { FloatingLabel, Form, Button } from "react-bootstrap";
import API_URL from "../config";

function Register() {

    const navigate = useNavigate();
    const register = (event) => {
        event.preventDefault();

        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;

        const url = `${API_URL}/user/register`

        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password})
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`Htttp error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            console.log("hello");
            navigate("/login");
        })
        .catch(error => console.log(error));
    }


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