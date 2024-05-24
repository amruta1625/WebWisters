import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/navbar';
import { useNavigate } from "react-router-dom";
import "./changepassword.css"; 
import AuthContext from '../../../context/AuthProvider';
import bcrypt from 'bcryptjs';

const ChangePassword = () => {
  const navigate = useNavigate();

  const {authCreds, setAuthCreds} = useContext(AuthContext);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  // const [error, setError] = useState('');

  const [user, setUser] = useState({
    user_id: authCreds.user_id,
    new_password: '',
    confirm_password: '',
    // otp: '',
  });

  const [error, setError] = useState({
    rollnoEmpty: false,
    newPasswordEmpty: false,
    confirmPasswordEmpty: false,
    otpEmpty: false,
    passwordsMatch: true,
  });

  const [step, setStep] = useState(1);

  useEffect(() => {
    // Ensure user is authenticated
    if (authCreds.user_id === 0) {
      navigate('/');
    }
  }, [authCreds.user_id, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    setError((prevError) => ({
      ...prevError,
      passwordsMatch: true,
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {

      if (user.new_password !== user.confirm_password) {
        setError((prevError) => ({
          ...prevError,
          passwordsMatch: false,
        }));
        return;
      }

      const hashedPassword = await bcrypt.hash(user.new_password, 10);

      // Update the user object with the hashed password
      // setUser((prevUser) => ({
      //   ...prevUser,
      //   new_password: hashedPassword,
      // }));

      const userData = {
        user_id: user.user_id,
        new_password: hashedPassword,
      };

      // const response = await axios.post('https://elan.iith-ac.in:8082/forgotpassword', user);
      const response = await axios.post('https://tradethrill.jitik.online:8000/forgotpassword', userData);
      // const response = await axios.post('http://127.0.0.1:8000/forgotpassword', user);
      console.log(response.data); 
      setStep(2); 
    } 
    catch (error) {
      console.error(error); // Handle error
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://tradethrill.jitik.online:8000/newotp', user);
      // const response = await axios.post('http://127.0.0.1:8000/newotp', user);
      console.log(response.data); 
      alert("OTP verified. Please proceed to login with your new password");
      navigate("/");
    } catch (error) {
      console.error(error); 
      alert("Invalid OTP");
      navigate("/changepassword");
    }
  };
  // const handleSendOTP = async () => {
  //   try {

  //     const response = await axios.post('https://elan.iith-ac.in:8082/forgotpassword', {  });
  //     setMessage(response.data.message);
  //     setOtpSent(true);
  //     setError('');
  //   } catch (error) {
  //     setMessage('');
  //     setError('Error sending OTP. Please try again.');
  //   }
  // };

  // const handleVerifyOTP = async () => {
  //   try {
  //     const response = await axios.post('https://elan.iith-ac.in:8082/newotp', { });
  //     setMessage(response.data.message);
  //     setError('');
  //   } catch (error) {
  //     setMessage('');
  //     setError('Invalid OTP. Please try again.');
  //   }
  // };

  return (
    <>
      <Navbar />
      <div className="change-container">
        <div className="xyz-forgot-password-container">
          <h2>Change Password</h2>
          {/* {message && <p className="message">{message}</p>}
          {error && <p className="error">{error}</p>}
          {!otpSent ? (
            <div>
              <label>User ID:</label>
              <input
                type="number"
                value= {authCreds.user_id}
                readOnly // Make the email field read-only if you want to prevent users from changing it
              />
              <button onClick={handleSendOTP}>Send OTP</button>
            </div>
          ) : (
            <div>
              <label>OTP:</label>
              <input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={handleVerifyOTP}>Verify OTP</button>
            </div>
          )} */}
          {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <p>User ID:</p>
              <input
                type="number"
                name="user_id"
                value={authCreds.user_id}
                readOnly
                // onChange={handleChange}
                // className={`form-control ${error.rollnoEmpty ? 'error' : ''}`}
                // placeholder="Enter Roll Number"
              />
              {/* {error.rollnoEmpty && <p className="error-message">Roll Number is required</p>} */}
            </div>

            <div className="form-group">
              <p>New Password:</p>
              <input
                type="password"
                name="new_password"
                value={user.new_password}
                onChange={handleChange}
                className={`form-control ${error.newPasswordEmpty || !error.passwordsMatch ? 'error' : ''}`}
                placeholder="Enter new password"
              />
              {error.newPasswordEmpty && <p className="error-message">New Password is required</p>}
            </div>

            <div className="form-group">
              <p>Confirm Password:</p>
              <input
                type="password"
                name="confirm_password"
                value={user.confirm_password}
                onChange={handleChange}
                className={`form-control ${error.confirmPasswordEmpty || !error.passwordsMatch ? 'error' : ''}`}
                placeholder="Confirm new password"
              />
              {error.confirmPasswordEmpty && <p className="error-message">Confirm Password is required</p>}
              {!error.confirmPasswordEmpty && !error.passwordsMatch && <p className="error-message">Passwords don't match</p>}
            </div>

            <div className="button-container">
              <button type="submit" className="submit">Send OTP</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <p>Enter OTP:</p>
              <input
                type="text"
                name="otp"
                value={user.otp}
                onChange={handleChange}
                className={`form-control ${error.otpEmpty ? 'error' : ''}`}
                placeholder="Enter OTP"
              />
              {error.otpEmpty && <p className="error-message">OTP is required</p>}
            </div>

            <div className="button-container">
              <button type="submit" className="submit">Verify OTP</button>
            </div>
          </form>
        )}
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
