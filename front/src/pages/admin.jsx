import React, { useState } from 'react';
import Users from '../components/Users';
import Bots from '../components/Bots';
import Groups from '../components/Groups';

const AdminHomePage = () => {
    const [adminActiveComponent, setadminActiveComponent] = useState(localStorage?.getItem('adminActiveComponent') || 'users');

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <hr className="my-4" />
            <div className="flex justify-center">
                <button
                    className={`px-4 py-2 mr-4 rounded-md ${adminActiveComponent === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => setadminActiveComponent('users')}
                >
                    Users
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${adminActiveComponent === 'bots' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => setadminActiveComponent('bots')}
                >
                    Bots
                </button>
                <button
                    className={`px-4 py-2 ml-4 rounded-md ${adminActiveComponent === 'groups' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => setadminActiveComponent('groups')}
                >
                    Groups
                </button>
            </div>

            <div className="mt-8">
                {adminActiveComponent === 'users' && <Users />
                }

                {adminActiveComponent === 'bots' && <Bots />
                }
                {adminActiveComponent === 'groups' && <Groups />
                }
            </div>
        </div>
    );
};

export default AdminHomePage;
