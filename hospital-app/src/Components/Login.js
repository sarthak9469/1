import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Validation from "./LoginValidation";
import axios from "axios";
import '../css/Login.css';


function Login() {
    const [values, setValues] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const navigate = useNavigate();

    const url = "http://localhost:4000";


    const handleInput = (e) => {
        const { name, value } = e.target;
        setValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login values:', values);
        try {
            const response = await axios.post(`${url}/api/login`, values);
            console.log('Login response:', response.data);
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            setValues({ email: "", password: "" });
            setErrors({});

            if (role === 'doctor') {
                navigate('api/doctors/consultations', { replace: true});
            } else if (role === 'patient') {
                navigate('/api/doctors', { replace: true });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            if (errorMessage === 'Invalid Email') {
                alert('This email is not registered. Please sign up first.');
                setValues({ email: "", password: "" });
                setErrors({});
            } else if (errorMessage === 'Invalid password') {
                alert('The password you entered is incorrect.');
                setErrors({ general: 'Invalid Password' });
            } else {
                alert(errorMessage);
                setErrors({ general: errorMessage });
            }

        }
    };


    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div>
                <h1> Login </h1>
            </div>
            <div>
                <label><strong>Email</strong></label>
                <input type="email" placeholder="Email" name="email" onChange={handleInput}></input>
                {errors.email && <span> {errors.email}</span>}

            </div>
            <div>
                <label><strong>Password</strong></label>
                <div className="password-input-wrapper"></div>
                <input type={passwordVisible ? "text" : "password"} placeholder="Password" name="password" onChange={handleInput} value={values.password}></input>
                {errors.password && <span> {errors.password}</span>}
            </div>
            <div>
                <label>
                    <input type="checkbox" checked={passwordVisible} onChange={() => setPasswordVisible(!passwordVisible)} />
                    <span> Show Password </span>
                </label>
            </div>
            <div>
                <button type="submit"> Login </button>
            </div>
            <div className="new-member">
                <p> Not a User?</p>
                <Link to='/signup' className="button"> Create Account </Link>
            </div>
        </form>
    );
}

export default Login;