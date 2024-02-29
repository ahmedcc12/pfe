import React from 'react';
import { Link } from 'react-router-dom';
import Users from '../components/Users.jsx';

const Homepage = () => {
    return (
        <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Admin Homepage</h2>
        <p>Welcome to the Admin homepage</p>

        <br />
            <Users />
            <br />

        <p>register a user : </p>
        <Link to="/admin/register">register</Link>
        </div>
    );
    }

export default Homepage;