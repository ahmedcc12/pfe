
import React from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Homepage = () => {
    const { auth } = useAuth();
    return (
        <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Homepage</h2>
        <p>Welcome to the homepage</p>
        <br />
        {auth?.role === 'admin' && (
            <Link to="/admin">Admin</Link>
        )}
        </div>
    );
    }

export default Homepage;