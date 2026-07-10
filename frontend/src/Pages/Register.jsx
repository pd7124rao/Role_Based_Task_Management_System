import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
    setSuccessMsg('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    setSuccessMsg('');

    try {
      const { data } = await axios.post('http://localhost:8000/api/auth/register', formData);
      setSuccessMsg('Registration successful!');
      setFormData({ name: '', email: '', password: '' });
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.message) {
        const message = error.response.data.message;
        setApiError(message);

        if (message.toLowerCase().includes("already exists")) {
          setApiError(
            <>
              {message} &nbsp;
              <Link to="/login">Login instead</Link>
            </>
          );
        }
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_container">
      <div className="login_form">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}

          {apiError && <div style={{ color: 'red' }}>{apiError}</div>}
          {successMsg && <div style={{ color: 'green' }}>{successMsg}</div>}

          <button disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>

          <p style={{ marginTop: '10px' }}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
