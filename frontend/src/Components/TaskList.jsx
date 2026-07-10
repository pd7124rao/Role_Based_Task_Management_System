import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState({
    _id: '',
    task: '',
    status: '',
    assignTo: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);


  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/tasks/getAllTask', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data.tasksList);
    } catch (err) {
      setErrorMsg('Failed to fetch tasks');
    }
  };


  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/auth/getAllusers', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json"
        },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };


  const openEditModal = (task) => {
    console.log(task)
    setEditTaskData({
      _id: task._id,
      task: task.task || '',
      status: task.status || 'pending',
      assignTo: task.assignTo?._id || '',
    });
    setEditModalOpen(true);
    setErrorMsg('');
    setSuccessMsg('');
  };


  const handleEditChange = (e) => {
    setEditTaskData({ ...editTaskData, [e.target.name]: e.target.value });
  };


  const handleUpdateTask = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/api/tasks/updateTask`,
        {
          task: editTaskData.task,
          status: editTaskData.status,
          assignTo: editTaskData.assignTo,
          id:editTaskData._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMsg('Task updated successfully');
      setEditModalOpen(false);
      fetchTasks();
    } catch (err) {
      setErrorMsg('Failed to update task');
    }
  };


  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const token = localStorage.getItem('token');
     await axios.delete('http://localhost:8000/api/tasks/deleteTask', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  data: { id: taskId } 
});

      setSuccessMsg('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      setErrorMsg('Failed to delete task');
    }
  };

  return (
    <div className="task_container">
      <h2>All Tasks</h2>

      {errorMsg && <p className="error_msg">{errorMsg}</p>}
      {successMsg && <p className="success_msg">{successMsg}</p>}

      <table className="task_table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.task}</td>
                <td>
                  {task.assignTo
                    ? `${task.assignTo.name} (${task.assignTo.email})`
                    : 'Unassigned'}
                </td>
                <td>
                  <span className={`status ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                </td>
                <td>
                  <button
                    className="edit_btn"
                    onClick={() => openEditModal(task)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="delete_btn"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h3>Edit Task</h3>

            <label>Task</label>
            <input
              type="text"
              name="task"
              value={editTaskData.task}
              onChange={handleEditChange}
              placeholder="Task name"
            />

            <label>Status</label>
            <select
              name="status"
              value={editTaskData.status}
              onChange={handleEditChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>

            <label>Assign To</label>
            <select
              name="assignTo"
              value={editTaskData.assignTo}
              onChange={handleEditChange}
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>

            <div className="modal_actions">
              <button className="save_btn" onClick={handleUpdateTask}>
                Update
              </button>
              <button
                className="cancel_btn"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
