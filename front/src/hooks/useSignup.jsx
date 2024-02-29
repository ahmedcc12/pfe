import { useState } from "react";
import axios from "../api/axios.jsx";
import useAuth from "../hooks/useAuth";

export default function useSignup() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { auth } = useAuth();
    const userrole=auth.role;

    async function handleSignup(email, name ,password, role) {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("/users/signup", {
                email,
                name,
                password,
                role,
                userrole
            });
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
