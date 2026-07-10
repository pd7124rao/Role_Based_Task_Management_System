import React, { useState } from "react";
import axios from "axios";
import "./Form.css";

export default function StudentForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    classSection: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.rollNumber.trim()) newErrors.rollNumber = "Roll Number is required";
    if (!form.classSection.trim()) newErrors.classSection = "Class Section is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/students/createStudent", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Student added successfully!");
      setForm({ name: "", email: "", rollNumber: "", classSection: "" });
      setErrors({});
      setApiError("");
    } catch (error) {
      console.error(error);
      setApiError("Failed to add student. Please try again.");
    }
  };

  return (
    <div>
      <form className="Customised_form" onSubmit={handleSubmit}>
        <h2>Add Student</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Student Name"
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          name="rollNumber"
          value={form.rollNumber}
          onChange={handleChange}
          placeholder="Roll Number"
        />
        {errors.rollNumber && <p className="error">{errors.rollNumber}</p>}

        <input
          name="classSection"
          value={form.classSection}
          onChange={handleChange}
          placeholder="Class Section"
        />
        {errors.classSection && <p className="error">{errors.classSection}</p>}

        {apiError && <p className="error">{apiError}</p>}

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}
