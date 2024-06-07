import React, { useEffect, useState } from 'react';
import ChangeEmailUsername from './ProfileSettings/ChangeEmailUsername';
import Logout from './ProfileSettings/Logout';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { toast, ToastContainer } from 'react-toastify';
import ActivityLogItem from './UserActivity/ActivityLogItem';
import Cookies from 'js-cookie';

interface User {
  username: string;
  profilePic: string;
}

interface Activity {
  id: number;
  userId: number;
  action: string;
  componentType: string;
  newValue: string;
  location: string;
  createdAt: string;
}

const AdminHomePage: React.FC = () => {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]); // State for storing activities

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {

    const token = Cookies.get('token');

    try {
      const response = await fetch('http://localhost:3000/user-activity/latest', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user activities');
      }
      const data: Activity[] = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
     // toast.error('Failed to fetch user activities');
    }
  };

  const showLogout = () => {
    setShowLogoutPopup(!showLogoutPopup);
  };

  const showSettings = () => {
    setShowSettingsPopup(!showSettingsPopup);
  };

  const closeSettingsPopup = () => {
    setShowSettingsPopup(!showSettingsPopup);
    location.reload();
  };

  const closeClickSettingsPopup = () => {
    setShowSettingsPopup(!showSettingsPopup);
  };

  const closeLogoutPopup = () => {
    setShowLogoutPopup(!showLogoutPopup);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="main m-5">
        <div className="headerContainer flex justify-between items-center">
          <div className="logoContainer">
            <img src="src/assets/images/geotagger_logo.PNG" alt="logo" />
          </div>
          <div className="Header-container flex items-center">
            <button
              className="SettingsBTN hover:bg-green-400 hover:text-white text-black font-bold py-2 px-4 rounded mr-2"
              onClick={showSettings}
            >
              Profile settings
            </button>
            <button
              className="logoutBTN hover:bg-green-400 hover:text-white text-black font-bold py-2 px-4 rounded mr-2"
              onClick={showLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className='m-5'>
        <div className='flex flex-col mb-4'>
          <h1 className='text-xl md:text-3xl mb-2 text-green-400'>Activity log</h1>
        </div>

        <div className='activityLogs flex flex-col items-center max-h-[35rem] overflow-y-auto'>
          <div className='LogsData grid grid-cols-1 md:grid-cols-6 gap-4 border-b-2 border-black pb-0.5 w-full'>
            <p>User</p>
            <p>Date/Time</p>
            <p>Action</p> 
            <p>Component type</p>
            <p>New value</p>
            <p>Location of action</p>
          </div>
          {activities.length > 0 ? (
            activities.map(activity => (
              <ActivityLogItem key={activity.id} activity={activity} />
            ))
          ) : (
            <div className='flex flex-col justify-center items-center mt-8'>
              <MagnifyingGlassIcon className="h-5 w-5" />
              <h1 className='text-xl md:text-2xl mb-2'>No activity log found</h1>
              <p>No activity log found. Refresh the page.</p>
            </div>
          )}
        </div>
      </div>

      {showSettingsPopup && (
        <ChangeEmailUsername onClose={closeSettingsPopup} onCloseClick={closeClickSettingsPopup} />
      )}
      {showLogoutPopup && (
        <Logout onClose={closeLogoutPopup} />
      )}

      <footer className="bg-green-400 mt-auto">
        <div className="flex justify-between text-white container mx-auto py-4 px-4 max-w-full w-full">
          <h4>Geotagger</h4>
          <p>All Rights Reserved | skillupmentor.com</p>
        </div>
      </footer>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default AdminHomePage;
