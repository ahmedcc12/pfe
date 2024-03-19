import React, { useState } from 'react';
import Users from '../components/Users';
import Bots from '../components/Bots';

const Homepage = () => {
    const [activeComponent, setActiveComponent] = useState(localStorage?.getItem('activeComponent') || 'users');

    return (
        <div className="container mx-auto mt-8">
            <div className="flex justify-center">
                <button
                    className={`px-4 py-2 mr-4 rounded-md ${
                        activeComponent === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setActiveComponent('users')}
                >
                    Users
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${
                        activeComponent === 'bots' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setActiveComponent('bots')}
                >
                    Bots
                </button>
            </div>

            <div className="mt-8">
                {activeComponent === 'users' ? <Users /> : <Bots />}
            </div>
        </div>
    );
};

export default Homepage;
