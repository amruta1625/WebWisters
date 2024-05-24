import React, { useState } from "react";
import createaccount from './createaccount.png';
import axios from "axios";
import './register.css';
import logotradethrill from '../../logotradethrill.svg';
import { Link, useNavigate } from 'react-router-dom';

import bcrypt from 'bcryptjs';

const Register = () => {

  const navigate = useNavigate()
  
  
  const [user, setUser] = useState({
    name: "",
    user_id: "",
    email:"",
    confirm_password: "",
    hashed_password: "",
  });

  const [error, setError] = useState({
    nameEmpty: false,
    rollnoEmpty: false,
    // usernameEmpty: false,
    emailEmpty: false,
    passwordEmpty: false,
    rollnoInvalid: false,
    rollnoUsed: false,
    passwordDoesntMatch: false
  });

  const [registrationStage, setStage] = useState("not yet submitted");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (name === "user_id") {
      setError((prevError) => ({
        ...prevError,
        rollnoEmpty: false,
        rollnoInvalid: isNaN(value) || value <= 0, 
        rollnoUsed: false, 
      }));
    }

    if (name === "email") {
      // const emailRegex = /^\S+@\S+\.\S+$/;
      const emailRegex = /^$|^[a-z0-9.]+@[a-z0-9]+\.gmail\.com$|^[a-z0-9.]+@gmail\.com$/;
      setError((prevError) => ({
        ...prevError,
        emailEmpty: false,
        emailInvalid: !emailRegex.test(value)
      }));
    }
  };

  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hash the password
    // const hashedPassword = await bcrypt.hash(user.hashed_password, 10);
    const hashedPassword = user.hashed_password
    setUser((prevUser) => ({
      ...prevUser,
      hashed_password: hashedPassword,
      // confirm_password: confirmPassword,
    }));

    if (error.rollnoEmpty || error.rollnoInvalid || error.rollnoUsed) {
      return; // Do not proceed with registration
    }

    register(hashedPassword);
  };

  const register = async (hashedPassword) => {
    const { name, user_id, email, hashed_password, confirm_password } = user;

    let emptyKeys = {};
    for (const key of Object.keys(user)) {
      if (user[key] === "") {
        emptyKeys[key + "Empty"] = true;
      }
    }

    setError({ ...error, ...emptyKeys });
    if (Object.keys(emptyKeys).length > 0) return;

    if (hashed_password !== confirm_password) {
      setError({ ...error, passwordDoesntMatch: true });
      return;
    }
    // console.log(hashed_password)
    // console.log(hashedPassword)
    

    setStage("pending");
    const real_hashed_password = await bcrypt.hash(user.hashed_password, 10);
    const data = {
      ...user,
      hashed_password: real_hashed_password
    }
    console.log(data)
    axios.post("https://tradethrill.jitik.online:8000/register", data)
    .then(() => {
      navigate("/otp", { state: { user_id: user_id } });
    })

    .catch((error) => {
      if (error.response && error.response.status === 400 && error.response.data.detail === "User already registered") {
          alert("User already registered. Please proceed to login.");
          navigate("/login");
      }else if (error.response && error.response.status === 403 && error.response.data.detail === "User access restricted due to reports"){
          alert("You've been reported")
      } else {
          console.error("Error registering user:", error);
      }
      setStage("not yet submitted");
    });

  };

  const backgroundStyle = {
    backgroundImage: `url(${createaccount})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  return (
    <>
      <div className="register">
        <div className="background-container" style={backgroundStyle}>
          <div className="logo-container">
             <img src={logotradethrill} alt="logo" className="logotradethrill" /> 
            <h2 className="logo-name">TradeThrill</h2>
          </div>
          <div className="create">
            <h1 className="createstatement">
              Create new <br /> Account
            </h1>
            <h1 className="loginpage">
              Already registered ? <Link to="/login">Login</Link>
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <h5 className="NameStatement">Please enter your name</h5>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  className={`inputName ${error.nameEmpty ? "error" : ""}`}
                />
              </div>
              <div className="input-container">
                <h5 className="NameStatement">Please enter Roll Number</h5>
                <input
                  type="number"
                  name="user_id"
                  value={user.user_id}
                  onChange={handleChange}
                  placeholder="Enter Your Roll Number"
                  className={`inputName ${error.rollnoEmpty || error.rollnoInvalid || error.rollnoUsed ? "error" : ""}`}
                />
                {error.rollnoEmpty && <p className="error-message">Roll Number is required</p>}
                {error.rollnoInvalid && <p className="error-message">Invalid Roll Number format</p>}
                {error.rollnoUsed && <p className="error-message">Roll Number is already registered</p>}
              </div>
              <div className="input-container">
                <h5 className="NameStatement">Please enter your email</h5>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="abc@gmail.com"
                  className={`inputName ${error.emailEmpty || error.emailInvalid ? "error" : ""}`}
                />
                {error.emailEmpty && <p className="error-message">Email is required</p>}
                {error.emailInvalid && <p className="error-message">Invalid email format</p>}
              </div> 

              {/* Add other input fields for username, password, etc. */}
              <div className="input-container">
                <h5 className="NameStatement">Please enter password</h5>
                <input
                  type="password"
                  name="hashed_password"
                  value={user.hashed_password}
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                  className={`inputName ${error.passwordEmpty ? "error" : ""}`}
                />
                {error.passwordEmpty && <p className="error-message">Password is required</p>}
              </div>
              <div className="input-container">
                <h5 className="NameStatement">Confirm Password</h5>
                <input
                  type="password"
                  name="confirm_password"
                  value={user.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`inputName ${error.passwordDoesntMatch ? "error" : ""}`}
                />
                {error.passwordDoesntMatch && <p className="error-message">Passwords do not match</p>}
              </div>
              <button className="button" type="submit">
                {registrationStage === "pending" ? "Loading" : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
