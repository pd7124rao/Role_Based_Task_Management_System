import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { AuthContext } from '../Context/AuthContex';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const isAdmin = user?.role === 'admin';
    const isManager=user?.role==='manager';
    const isTeamLead=user?.role==='team-lead'

    return (
        <nav className="navbar">
            <div className="navbar-section navbar-left">
                <h1 className="navbar-title">My App</h1>
            </div>

            <div className="navbar-section navbar-center">
                <NavLink to="/user" className="nav-link" activeClassName="active-link">
                    User Profile
                </NavLink>
                <NavLink to="/changePassword" className="nav-link" activeClassName="active-link">
                    Change Password
                </NavLink>

                <NavLink to="/ownTask" className="nav-link" activeClassName="active-link">
                    Your Task
                </NavLink>

                {isAdmin && (
                    <NavLink to="/createTask" className="nav-link" activeClassName="active-link">
                        Create Task
                    </NavLink>
                )}
                 {isAdmin && (
                    <NavLink to="/taskList" className="nav-link" activeClassName="active-link">
                        All Tasks
                    </NavLink>
                )}
                  {(isAdmin || isManager || isTeamLead) && (
                    <NavLink to="/changeRole" className="nav-link" activeClassName="active-link">
                        Change-Role
                    </NavLink>
                )}
            </div>

            <div className="navbar-section navbar-right">
                <button onClick={logout} className="logout-btn-nav">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
