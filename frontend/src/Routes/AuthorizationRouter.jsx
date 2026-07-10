import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContex'
import { Navigate } from 'react-router-dom'

function AuthorizationRouter({children,roleAccess}) {
  const {isAuthenticated,userRole,loading}=useContext(AuthContext)

  if(loading){
    return <div>Loading...</div>
  }
  if(!isAuthenticated || !roleAccess.includes(userRole)){
    return <Navigate to="/login" replace />
  }
  return children
}

export default AuthorizationRouter