import React, { useState, useEffect, useContext } from "react";
import "./notifications.css"; // Make sure to import your stylesheet
import axios from "axios";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const { authCreds } = useContext(AuthContext);

  useEffect(() => {
    // Ensure user is authenticated
    if (authCreds.user_id === 0) {
      navigate('/');
    }
  }, [authCreds.user_id, navigate]);

  useEffect(() => {
    axios
      .get(`https://tradethrill.jitik.online:8000/get_notifications/${authCreds.user_id}`)
      // .get(http://127.0.0.1:8000/get_notifications/${authCreds.user_id})
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAccept = (notification) => {
    if (notification.type === 0) {
      const data = {
        pid: notification.pid,
        seller_id: authCreds.user_id,
        buyer_id: notification.from_id,
      };
      axios.post("https://tradethrill.jitik.online:8000/notify_accept", data)
      // axios.post("http://127.0.0.1:8000/notify_accept", data)
        .then((response) => {
          console.log(response);
          // Update notification to show as accepted
          const updatedNotifications = notifications.map((notif) => {
            if (notif.id === notification.id) {
              return { ...notif, accepted: true };
            }
            return notif;
          });
          setNotifications(updatedNotifications);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDecline = (notification) => {
    if (notification.type === 0) {
      const data = {
        pid: notification.pid,
        seller_id: authCreds.user_id,
        buyer_id: notification.from_id,
      };
      axios.post("https://tradethrill.jitik.online:8000/notify_reject", data)
      // axios.post("http://127.0.0.1:8000/notify_reject", data)
        .then((response) => {
          console.log(response);
          // Remove declined notification
          const updatedNotifications = notifications.filter(
            (notif) => notif.id !== notification.id
          );
          setNotifications(updatedNotifications);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const renderNotificationType = (type) => {
    switch (type) {
      case 0:
        return "requested to buy ";
      case 1:
        return "sold the product ";
      case 2:
        return "rejected to sell ";
      case 3:
        return "bought the product ";
      case 4:
        return "messaged you ";
      default:
        return "";
    }
  };

  return (
    <div className="notifications">
      <h1 className="notifications-heading">Notifications</h1>
      <div className="notifications-container">
        {notifications.slice().reverse().map((notification) => (
          <div key={notification.id} className="notification">
            {/* <div className="user">{notification.from_name}</div>
            <div className="action">
              {renderNotificationType(notification.type)}: {notification.matter}
            </div>
            <div classname="product_title">{notification.product_title}</div> */}
            <div className="main_notification"> {`${notification.from_name} ${renderNotificationType(notification.type)}: ${notification.product_title}`}</div>
            
            {notification.type === 0 && (
              <div>
                {notification.accepted ? (
                  <span>Accepted</span>
                ) : (
                  <>
                    <button onClick={() => handleAccept(notification)}>Accept</button>
                    <button className="decline-btn" onClick={() => handleDecline(notification)}>Decline</button>
                  </>
                )}
              </div>
            )}
            <div className="action">{notification.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;