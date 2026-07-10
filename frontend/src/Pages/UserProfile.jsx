import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContex";
import './UserProfile.css'; 
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate=useNavigate()

  if (!user) {
    return <div className="no-user">No user data available.</div>;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2 className="profile-title">User Profile</h2>

        <div className="profile-details">
          <div className="profile-field">
            <label>Username:</label>
            <span>{user.name}</span>
          </div>

          <div className="profile-field">
            <label>Role:</label>
            <span>{user.role}</span>
          </div>

          <button className="logout-button" onClick={()=>navigate   ("/changePassword")}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
