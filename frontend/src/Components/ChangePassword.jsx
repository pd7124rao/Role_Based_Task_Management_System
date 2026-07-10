import React, { useState } from "react";
import axios from "axios";
import './ChangePassword.css';
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate=useNavigate()

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return "All fields are required.";
    }

    if (newPassword.length < 6) {
      return "New password must be at least 6 characters.";
    }

    if (newPassword === currentPassword) {
      return "New password must be different from current password.";
    }

    if (newPassword !== confirmPassword) {
      return "New password and confirmation do not match.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      const token = localStorage.getItem("token"); 

      const response = await axios.post(
        "http://localhost:8000/api/auth/changePasword",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(response.data.message || "Password changed successfully.");

    setTimeout(() => {
      navigate("/user");
    }, 1000);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to change password.";
      setError(message);
      setSuccess("");
    }
  };

  return (
    <div className="password-container">
      <h2 className="password-title">Change Password</h2>
      <form onSubmit={handleSubmit} className="password-form">
        <div className="password-field">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div className="password-field">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="password-field">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" className="change-button">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
