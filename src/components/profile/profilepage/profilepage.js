import React, { useState, useContext, useEffect } from "react";
import "./profilepage.css";
import Navbar from "../Navbar/navbar";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import AuthContext from "../../../context/AuthProvider";

import bcrypt from 'bcryptjs';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { authCreds, setAuthCreds, setIsLoggedIn } = useContext(AuthContext);
  const [user, setUser] = useState({
    user_id: "",
    hashed_password: "",
  });

  useEffect(() => {
    if (authCreds.user_id === 0) {
      navigate('/');
    }
  }, [authCreds.user_id, navigate]);

  const [newUserData, setNewUserData] = useState({
    name: authCreds.name,
    user_id: authCreds.user_id,
    email: authCreds.email,
    profile_pic: authCreds.profile_pic,
    hashed_password: authCreds.hashed_password
  });
  const [newProfilePic, setNewProfilePic] = useState(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePic(file);
  };

  const handleSaveClick = async (e) => {
    try {
      e.preventDefault();

      if (isEditing && !newUserData.name.trim()) {
        alert("Name cannot be empty");
        return;
      }

      if (isEditing && newProfilePic){
        const formData = new FormData();
        formData.append("data", JSON.stringify(newUserData));
        if (newProfilePic) {
          formData.append("file", newProfilePic);
        }

        const response = await axios.post("https://tradethrill.jitik.online:8000/edit_profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(response);
      } else {
        const updatedUserData = {
          user_id: newUserData.user_id,
          name: newUserData.name
        };

        const response = await axios.post("https://tradethrill.jitik.online:8000/edit_name", updatedUserData);
        console.log(response);
      }

      // const real_hashed_password = await bcrypt.hash(user.hashed_password, 10);

      const updatedUser = {
        user_id: newUserData.user_id, 
        // hashed_password: newUserData.hashed_password 
        // hashed_password: real_hashed_password
      };

      
      axios
        // .post("https://elan.iith-ac.in:8082/login", updatedUser)
        .get(`https://tradethrill.jitik.online:8000/login/${newUserData.user_id}`)
        .then((res) => {
          // const a = bcrypt.compareSync(newUserData.hashed_password, res.data.hashed_password);
      // console.log(a);

          if (res.data.message === "success" ) {
            setAuthCreds(prevAuthCreds => ({
              ...prevAuthCreds,
              user_id: res.data.user_id,
              name: res.data.name,
              email: res.data.email,
              active: res.data.verified,
              notification: res.data.notifications,
              profile_pic: res.data.photo,
              hashed_password: res.data.hashed_password
            }));
            setIsLoggedIn(true);
          } else {
            alert("Invalid Credentials");
          }
        })
        .catch((err) => {
          console.log("Error:", err);
        });
        setIsEditing(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({
      ...newUserData,
      [name]: value,
    });
  };

  return (
    <>
      <Navbar />
      <div className="profile-containers">
      <div class="profile-container">
        <section className="profile-section">
          <div className="matter">
            <div className="xyz">
              <div className="abc">
                <div id="profile-pic">
                  {isEditing && (
                    <div>
                      <label htmlFor="newProfilePic">Change Profile Picture:</label>
                      <input
                        type="file"
                        id="newProfilePic"
                        name="newProfilePic"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                  {isEditing && newProfilePic ? (
                    <img
                      src={URL.createObjectURL(newProfilePic)}
                      alt="New Profile Pic"
                      className="user-image"
                    />
                  ) : (
                    <img
                      src={`data:image/png;base64,${authCreds.profile_pic}`}
                      alt={authCreds.profile_pic}
                      className="user-image"
                    />
                  )}
                  {/* <img
                    src={`data:image/png;base64,${authCreds.profile_pic}`}
                    alt={authCreds.profile_pic}
                    className="user-image"
                  /> */}
                </div>
              </div>
              {isEditing ? (
                <form>
                  <div className="text">
                    <div>
                      <span className="ar">
                        <pre style={{ display: "inline-block" }}>NAME :</pre>
                      </span>
                      <input
                        type="text"
                        id="name"
                        className="br"
                        name="name"
                        value={newUserData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="btn">
                    <button type="submit" onClick={(e) => handleSaveClick(e)} className="button">
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text">
                  
                  <span className="br">Name: {authCreds.name}</span>
                  
                  <span className="br">IITK Roll Number: {authCreds.user_id}</span>

                  <span className="br">Email: {authCreds.email}</span>
                </div>
              )}
            </div>
            <div className="btn right-align">
              {!isEditing && (
                <button type="button" onClick={handleEditClick} className="button">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </section>
        </div>
      </div>
    </>
  );
}
