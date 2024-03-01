import { useState } from "react";
import axios from "../api/axios.jsx";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function useSignup() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { auth } = useAuth();
    const userrole=auth.role;
    const axiosPrivate = useAxiosPrivate();

    async function handleSignup(email, user ,pwd, role) {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosPrivate.post("/register", {
                email,
                user,
                pwd,
                role,
                userrole
            });
            console.log(response);
            
        }
            catch (error) {
                console.error('Error signing up:', error);
                const errorMessage = error.response.data.message || error.message;
                setError(errorMessage);
                }
            setLoading(false);
         
    }
    
    return {
        error,
        loading,
        handleSignup,
    };
}
