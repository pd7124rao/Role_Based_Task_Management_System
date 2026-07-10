import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContex'
import { Navigate } from 'react-router-dom'

function ProtectedRoutes({children}) {
  const {isAuthenticated,loading}=useContext(AuthContext)

  if(loading){
    return <div>Loading...</div>
  }
  return isAuthenticated?children:<Navigate to="/login" replace/>
}

export default ProtectedRoutes