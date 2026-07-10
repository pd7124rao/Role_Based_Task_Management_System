import React, { useContext, useState } from 'react'
import Input from '../Components/Input'
import Button from '../Components/Button'
import './Login.css'
import { AuthContext } from '../Context/AuthContex'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [error, setError] = useState("")
  const { login } = useContext(AuthContext)
  const [user, setUser] = useState({ email: "", password: "" })
  const navigate = useNavigate()

  const validateForm = () => {
    if (!user.email || !user.password) {
      setError("Email and password are required.")
      return false
    }
    setError("") 
    return true
  }
const UserLogin = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    await login(user);
    navigate("/user");
  } catch (err) {
    setError(err.message);  
  }
};



  return (
    <div className="login_container">
      <div className="login_form">
        <form onSubmit={UserLogin} className='Customised_form' method="post">
          <div className='Login_Heading'>Login</div>

          <Input
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            type='email'
            name="email"
            placeholder="Enter your email"
            value={user.email}
          />
          <Input
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            type='password'
            name="password"
            placeholder="Enter your password"
            value={user.password}
          />
          
          {error && <div className="Error_Message">{error}</div>}

          <Button type="submit">Login</Button>

          <p className="redirect_message">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
