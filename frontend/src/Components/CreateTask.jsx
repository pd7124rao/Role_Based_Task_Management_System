import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreateTask.css'; 
import { useNavigate } from 'react-router-dom';

function CreateTask() {
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    assignTo: '',
    status: 'pending'
  });
  const [users, setUsers] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate=useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token=localStorage.getItem("token")
        const res = await axios.get('http://localhost:8000/api/auth/getAllusers',{
           headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }

        });
        setUsers(res.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setErrorMsg('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      if (!formData.task.trim()) {
    setErrorMsg('task title is required');
    return;
  }

    try {
        const token =localStorage.getItem("token")
      await axios.post('http://localhost:8000/api/tasks/createTask', formData,{
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        }
      });
      setSuccessMsg('Task created successfully');
      setFormData({
        task: '',
        description: '',
        assignTo: '',
        status: 'pending'
      });

      setTimeout(()=>{
        navigate("/taskList")
      },1000)
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error creating task');
    }
  };

  return (
    <div className="task_container">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit} className="task_form">
        <input
          type="text"
          name="task"
          placeholder="Task title"
          value={formData.task}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="assignTo"
          value={formData.assignTo}
          onChange={handleChange}
          required
        >
          <option value="">Assign to</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit">Create Task</button>

        {successMsg && <p className="success_msg">{successMsg}</p>}
        {errorMsg && <p className="error_msg">{errorMsg}</p>}
      </form>
    </div>
  );
}

export default CreateTask;
