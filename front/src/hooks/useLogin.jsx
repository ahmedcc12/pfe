import { useContext, useState } from "react";
import axios from "../api/axios.jsx";
import useAuth from "../hooks/useAuth";
 
export default function useLogin() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { auth,setAuth } = useAuth();

    async function handleLogin(email ,password) {
        setLoading(true);
        setError(null);

        try{
            const response = await axios.post("/users/login", {email, password});
            if(response.status === 200){
                const token = response?.data?.token;
                const role = response?.data?.role;
                const access = response?.data?.access;
                
                setAuth({ email, token, role, access });
                //console.log('setAuth',auth.role);
                localStorage.setItem('token', token);
            
            }
        } 
        catch (error) {
            console.error('Error loging in:', error);
            setError(error);
        }
        setLoading(false);
     
}
return {
    error,
    loading,
    handleLogin,
    };  
}   