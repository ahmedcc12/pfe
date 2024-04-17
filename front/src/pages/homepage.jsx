import React, { useState } from 'react';
import UserBots from '../components/userBots';
import UserActivity from '../components/userActivity';
import useAuth from '../hooks/useAuth';

const Homepage = () => {
  const [userActiveComponent, setUserActiveComponent] = useState(
    localStorage?.getItem('userActiveComponent') || 'userBots'
  );
  const { auth } = useAuth();

  console.log(auth);
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <hr className="my-4" />

      <div className="flex justify-center">
        <button
          className={`px-4 py-2 mr-4 rounded-md ${
            userActiveComponent === 'userBots'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setUserActiveComponent('userBots')}
        >
          User Bots
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            userActiveComponent === 'userActivity'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setUserActiveComponent('userActivity')}
        >
          Activity
        </button>
      </div>
      <div className="mt-8">
        {userActiveComponent === 'userBots' && <UserBots />}
        {userActiveComponent === 'userActivity' && <UserActivity />}
      </div>
    </div>
  );
};

export default Homepage;
