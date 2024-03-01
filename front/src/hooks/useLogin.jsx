import { useContext, useState } from "react";
import axios from "../api/axios.jsx";
import useAuth from "../hooks/useAuth";
 
export default function useLogin() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { auth,setAuth } = useAuth();

    async function handleLogin(email ,pwd) {
        setLoading(true);
        setError(null);

        try{
            const response = await axios.post("/auth", 
            JSON.stringify({ email, pwd }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
            );
            if(response.status === 200){
                const accessToken = response?.data?.accessToken;
                const role = response?.data?.role;
                const access = response?.data?.access;
                                
                setAuth({ email, accessToken, role, access });
                //console.log('setAuth',auth.role);
                localStorage.setItem('accessToken', accessToken);
            
            }
        } 
        catch (err) {
            if (!err?.response) {
                setError('No Server Response');
            } else if (err.response?.status === 400) {
                setError('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setError('Unauthorized');
            } else {
                setError('Login Failed');
            }
        }
        setLoading(false);
     
}
return {
    error,
    loading,
    handleLogin,
    };  
}   