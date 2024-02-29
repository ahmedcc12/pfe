// useLogout.jsx
import useAuth from "../hooks/useAuth";
import { useContext } from "react";

export default function useLogout() {
    const { setAuth } = useAuth();

    const logout = () => {
        // Clear authentication state
        setAuth({});
        //clear local storage
        localStorage.removeItem('token');

    };

    return { logout };
}
