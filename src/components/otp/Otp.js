import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import "./Otp.css"; // Import CSS file

const Otp = () => {
  const { authCreds, setAuthCreds } = useContext(AuthContext);
  const [packet, setPacket] = useState({
    user_id: "",
    otp: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPacket((prevPacket) => ({
      ...prevPacket,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://tradethrill.jitik.online:8000/otp", packet)
      // .post("http://127.0.0.1:8000/otp", packet)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          setAuthCreds({
            ...authCreds,
            active: 1,
          });
          alert("OTP verified");
          navigate("/login");
        } else {
          alert("Invalid OTP");
          navigate("/register");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Enter OTP</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="input-field">
            <label htmlFor="user_id" className="label">
              Roll Number :
            </label>
            <input
              type="number"
              placeholder="Enter Roll Number"
              name="user_id"
              id="user_id"
              onChange={(e) => handleChange(e)}
              // type="number"
              // name="user_id"
              // value={packet.user_id}
              // readOnly
            />
          </div>
          <div className="input-field">
            <label htmlFor="otp" className="label">
              OTP :
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              id="otp"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
