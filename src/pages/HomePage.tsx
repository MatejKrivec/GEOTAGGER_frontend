import React, { useEffect, useState } from 'react';
import ChangeEmailUsername from './ProfileSettings/ChangeEmailUsername';
import Landing from './Home/Landing';
import Logout from './ProfileSettings/Logout';
import Profile from './Home/Profile';
import AdminHomePage from './AdminHomePage'; // Import AdminHomePage component
import '../assets/styles/HomePage.css';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';

const HomePage = () => {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab'));
  const [profilePic, setProfilePic] = useState('');
  const [points, setPoints] = useState(0);
  const [userRole, setUserRole] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      GetUserData(token);
    } else {
      console.error('Token not found');
    }

    const storedActiveTab = localStorage.getItem('activeTab');
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
    }
  }, []);

  const GetUserData = async (token: string) => {
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
        toast.error('Failed to decode token');
        throw new Error('Failed to decode token');
      }

      const userData = await response.json();

      const userId = userData.id;
      const profilePicture = userData.profilePic;

      const data = await fetch(`http://localhost:3000/users/${userId}`)
      const user = await data.json()

      if (!data.ok) {
        toast.error('Failed to decode token');
        throw new Error('Failed to decode token');
      }

      setUserRole(user.role)
      setProfilePic(user.profilePic)
      localStorage.setItem('UserId', userId);
      setPoints(user.points);
    } catch (error) {
      console.log(error)
    }
  };

  const logUserActivity = async (activity: { userId: number; action: string; componentType: string; newValue: string; location: string; createdAt: Date }) => {
    try {
      const response = await fetch('http://localhost:3000/user-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
      });

      if (!response.ok) {
        throw new Error('Failed to log user activity');
      }
    } catch (error) {
      console.error('Error logging user activity:', error);
    }
  };

  const handleTabChange = async (tab: string) => {

    const datetime = new Date();

    await logUserActivity({
      userId: parseInt(localStorage.getItem('UserId') || '0'),
      action: 'TAB_CHANGE',
      componentType: 'BUTTON',
      newValue: tab,
      location: window.location.href,
      createdAt: datetime
    });

    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  const renderContent = () => {
    if (activeTab === 'homeLanding') {
      return <Landing />;
    } else if (activeTab === 'profile') {
      return <Profile profilePic={profilePic} />;
    }
  };

  const showLogout = async() => {
    const datetime = new Date();
    await logUserActivity({
      userId: parseInt(localStorage.getItem('UserId') || '0'),
      action: 'SHOW_LOGOUT',
      componentType: 'BUTTON',
      newValue: 'showLogout',
      location: window.location.href,
      createdAt: datetime
    });

    setShowLogoutPopup(!showLogoutPopup);
  };

  const showSettings = async() => {
    const datetime = new Date();
    await logUserActivity({
      userId: parseInt(localStorage.getItem('UserId') || '0'),
      action: 'SHOW_SETTINGS',
      componentType: 'BUTTON',
      newValue: 'showSettings',
      location: window.location.href,
      createdAt: datetime
    });
    setShowSettingsPopup(!showSettingsPopup);
  };

  const closeSettingsPopup = () => {
    setShowSettingsPopup(!showSettingsPopup);
    location.reload()
  };

  const closeClickSettingsPopup = () => {
    setShowSettingsPopup(!showSettingsPopup);
  };
  
  const closeLogoutPopup = () => {
    setShowLogoutPopup(!showLogoutPopup);
  };

  return (
    <>
    {userRole === 'admin' ? (
      <AdminHomePage />
    ) : (
      <div className="flex flex-col min-h-screen relative">
        <div className="main m-5">
          <div className="headerContainer flex justify-between items-center">
            <div className="logoContainer">
              <img src="src/assets/images/geotagger_logo.PNG" alt="logo" />
            </div>
            <div className="SignIN-SignUP-container flex items-center md:justify-between justify-end">
              {/* Menu items */}
              <div className="hidden md:flex order-2 md:order-1">
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
            </div>
              {/* Profile div */}
              <div className="border-2 border-green-400 flex items-center rounded-full mr-5 order-1 md:order-2">
                <img
                  onClick={() => handleTabChange('profile')}
                  src={profilePic}
                  alt="DefaultUserPic"
                  className="w-16 h-16 rounded-full cursor-pointer"
                />
                <p className="ml-5 mr-8">{points}</p>
              </div>
              {/* Hamburger menu button */}
              <button
                  className="md:hidden text-black text-2xl order-3 md:order-3"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  ☰
                </button>
                {/* Menu items */}
                <div className={`menu-items ${menuOpen ? 'flex' : 'hidden'} flex-col md:flex-row md:hidden order-2 md:order-1 `}>
                  <button
                    className="HomeBTN hover:bg-green-400 hover:text-white border text-black font-bold py-2 px-4 rounded-xl mr-2 m-1"
                    onClick={() => handleTabChange('homeLanding')}
                  >
                    Home  <span>&rarr;</span>
                  </button>
                  <button
                    className="SettingsBTN hover:bg-green-400 hover:text-white border text-black font-bold py-2 px-4 rounded-xl mr-2 m-1"
                    onClick={showSettings}
                  >
                    Profile settings <span>&rarr;</span>
                  </button>
                  <button
                    className="logoutBTN hover:bg-green-400 hover:text-white border  text-black font-bold py-2 px-4 rounded-xl mr-2 m-1"
                    onClick={showLogout}
                  >
                    Logout <span>&rarr;</span>
                  </button>
                </div>
              {/* Plus button */}
              <button className="hidden md:block text-2xl text-white bg-green-400 rounded-full w-14 h-14 flex items-center justify-center order-4 md:order-4">+</button>
            </div>
          </div>
        </div>
  
        {renderContent()}
  
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
        <ToastContainer />
      </div>
    )}
  </>
  

  
  );
};

export default HomePage;