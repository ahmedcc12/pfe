import { Outlet } from "react-router-dom";
import { useState, useEffect} from "react";
import { useAuth } from "../hooks/useAuth";

const PersistLogin = () => {
    const [isLoading, setLoading] = useState(true);
    const { auth } = useAuth();

    useEffect(() => {
        if (auth.accessToken) {
            setLoading(false);
        }
    }, [auth]);
    }
