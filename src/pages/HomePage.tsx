import React, { useEffect, useState } from 'react';
import ChangeEmailUsername from './ProfileSettings/ChangeEmailUsername';
import Landing from './Home/Landing';
import Logout from './ProfileSettings/Logout';
import Profile from './Home/Profile';
import '../assets/styles/HomePage.css';
import Cookies from 'js-cookie';

const HomePage = () => {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('homeLanding');

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Call the SetUserData method if token exists
      GetUserData(token);
    } else {
      console.error('Token not found');
    }
  },[] );

  const GetUserData = async (token: string) => {
    // Use the token passed as an argument
    
    try {
      const response = await fetch('http://localhost:3000/decode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to decode token');
      }
      
      const userData = await response.json();
      const userId = userData.id;
      localStorage.setItem('UserId', userId);

      const userResponse = await fetch(`http://localhost:3000/users/${userId}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.log(error)
      //toast.error((error as Error).message);
    }
  };

    const handleTabChange = (tab: React.SetStateAction<string>) => {
      setActiveTab(tab);
    };

    const renderContent = () => {
        if (activeTab === 'homeLanding') {
            return (
                <Landing  />
            );
        } else if (activeTab === 'profile') {
            return (
                <Profile/>
            );
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
  };
  const closeLogoutPopup = () => {
    setShowLogoutPopup(!showLogoutPopup);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="main m-5">
        <div className="headerContainer flex justify-between items-center">
          <div className="logoContainer">
            <img src="src\assets\images\geotagger_logo.PNG" alt="logo" />
          </div>
          <div className="SignIN-SignUP-container flex items-center">
            <button
              className="HomeBTN hover:bg-green-400 hover:text-white text-black font-bold py-2 px-4 rounded mr-2"
              onClick={() => handleTabChange('homeLanding')}
            >
              Home
            </button>
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

            <div className=" border-2 border-green-400 flex items-center rounded-full mr-5">
              <img onClick={() => handleTabChange('profile')} 
              
              src="src\assets\images\default_user_pic.jpg" alt="DefaultUserPic" className=" w-[4rem] rounded-full cursor-pointer" />
              <p className=" ml-5 mr-8">10</p>
            </div>

            <button className="text-[2rem] text-white bg-green-400 rounded-full w-[3.5rem] pb-2">+</button>
          </div>
        </div>
      </div>

      {renderContent()}

      {/* Render settings popup */}
      {showSettingsPopup && (
          <ChangeEmailUsername onClose={closeSettingsPopup} />
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
    </div>
  );
};

export default HomePage;
