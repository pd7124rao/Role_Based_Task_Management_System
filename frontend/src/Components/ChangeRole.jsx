import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChangeRole.css';

const roles = ['employee', 'manager', 'admin','team-lead'];

const ChangeRole = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleChangeError, setRoleChangeError] = useState(''); 

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/auth/getAllusers', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/roles/changeRole`,
        { user_id: userId, newRole: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setUsers(users.map(user => (user._id === userId ? { ...user, role: newRole } : user)));
      setRoleChangeError(''); 
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Failed to update role. Please try again.';
      setRoleChangeError(message);

      setTimeout(() => setRoleChangeError(''), 3000);
    }
  };

  if (loading) return <p className="crs-loading">Loading users...</p>;
  if (error) return <p className="crs-error">{error}</p>;

  return (
    <div className="crs-container">
      <h2 className="crs-title">User Role Management</h2>
      
      {roleChangeError && (
        <div className="crs-role-error">
          ⚠️ {roleChangeError}
        </div>
      )}

      <table className="crs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="crs-row">
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  className="crs-select"
                  value={user.role}
                  onChange={e => handleRoleChange(user._id, e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChangeRole;
