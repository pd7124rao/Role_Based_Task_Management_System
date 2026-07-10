import axios from "axios";
import { useEffect, useState,createContext } from "react";

export const AuthContext= createContext();

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const [isAuthenticated,setIsAuthenticated]=useState(false)
    const [userRole,setUserRole]=useState("")
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        const userLogged=localStorage.getItem("user");
        const userToken=localStorage.getItem("token")
        if(userLogged && userToken){
            const userData=JSON.parse(userLogged)
            setUser(userData)
            setIsAuthenticated(true)
            setUserRole(userData?.role)
            setLoading(false)
        }
    },[])

  const login = async ({ email, password }) => {
  console.log("getting login request");
  try {
    const response = await axios.post("http://localhost:8000/api/auth/login", { email, password });
    const { user, token } = response.data;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUserRole(user?.role);
    setLoading(false);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
    return response;
  } catch (err) {
    console.log(err);
    // Extract detailed message if present
    const message = err.response?.data?.message || "Login failed. Please try again.";
    throw new Error(message);
  }
    };


    const logout=()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsAuthenticated(false)
        setUserRole("")
        setLoading(false)
        axios.defaults.headers.common["Authorization"]=""
    }

    return(
        <AuthContext.Provider value={{logout,login,user,isAuthenticated,userRole,loading}}>
            {children}
        </AuthContext.Provider>
    )
}