import React, { useEffect, useState } from 'react'
import ChangePassword from './ChangePassword'
import ChangeProfilePic from './ChangeProfilePic'
import Conformation from './Conformation'
import { toast, ToastContainer } from 'react-toastify'; 

const ChangeEmapilUsername = ({onClose,onCloseClick}: {onClose: () => void,onCloseClick: () => void}) => {

    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false)
    const [showChangeProfilePicPopup, setShowChangeProfilePicPopup] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
      });

    useEffect(() => {

        const setFormData = async () => {
            const userId = localStorage.getItem('UserId')
            const response = await fetch(`http://localhost:3000/users/${userId}`)
            const data = await response.json()
            const [firstName, lastName] = data.username.split(' ');
            setUserData({
                firstName,
                lastName,
                email: data.email,
              });
        }
        
        setFormData();
    }, [])


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
      };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); 
        try{
            const userId = localStorage.getItem('UserId')

            const username = `${userData.firstName.trim()} ${userData.lastName.trim()}`;
            const updatedUserData = {
                username,
                email: userData.email, 
            };

            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            })
            if (!response.ok) {
                console.log('Error updating user')
                toast.error('Error updating user')
                throw new Error('Error updating user');
              }
            setShowConfirmation(true)
           
        }catch(error){
            console.log(`Error updating user details:`+ error)
          //  toast.error(`Error updating user details: ${error.message}`)
           // toast.error(`Error updating user details: ${error.message}`);
        }
        
    }

    


    const openChangePassword = () => {
        setShowChangePasswordPopup(!showChangePasswordPopup);
    }
    const closeChangePassword = () => {
        setShowChangePasswordPopup(!showChangePasswordPopup);
    }

    const openChangeProfilePic = () => {
        setShowChangeProfilePicPopup(!showChangeProfilePicPopup);
    }
    const closeChangeProfilePic = () => {
        setShowChangeProfilePicPopup(!showChangeProfilePicPopup);
    }

    const handleCloseClick = () => {
        onCloseClick();
    }
    const handleCloseConfirmation = () => {
        onClose();
    }

  return (
    <>
    {showChangePasswordPopup ? (
      <ChangePassword onClose={closeChangePassword} onConfirmClose={handleCloseConfirmation} />
    ) : showChangeProfilePicPopup ? (
      <ChangeProfilePic onClose={closeChangeProfilePic} onConfirmClose={handleCloseConfirmation} />
    ) : showConfirmation ? (
      <Conformation onClosee={handleCloseConfirmation} />
    ) : (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-4 md:p-6 rounded-md w-full max-w-sm md:max-w-md">
          <h1 className="text-2xl md:text-3xl mb-3">
            Profile <span className="text-green-400">settings</span>
          </h1>
          <p className="mb-3">Change your information</p>
          <form className="flex flex-col w-full" onSubmit={handleSubmit}>
            <label htmlFor="Email">Email</label>
            <input
              className="border rounded-lg px-3 py-2 mb-3 w-full"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleInputChange}
            />
  
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-3 md:mr-3">
                <label htmlFor="Firstname">First name</label>
                <input
                  className="border rounded-lg px-3 py-2 mb-3 w-full"
                  name="firstName"
                  type="text"
                  value={userData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3 md:ml-3">
                <label htmlFor="Lastname">Last name</label>
                <input
                  className="border rounded-lg px-3 py-2 mb-3 w-full"
                  name="lastName"
                  type="text"
                  value={userData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
  
            <a href="#" onClick={openChangePassword} className="text-green-400 mb-3 md:mb-4">
              Change password
            </a>
            <a href="#" onClick={openChangeProfilePic} className="text-green-400 mb-4">
              Change profile picture
            </a>
  
            <div className="flex justify-end">
              <button
                className="text-green-400 hover:bg-green-400 hover:text-white mr-3 rounded-2xl px-4 py-2"
                onClick={handleCloseClick}
              >
                Cancel
              </button>
              <button
                className="text-green-400 hover:bg-green-400 hover:text-white rounded-2xl px-4 py-2"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    )}
  </>
  
  
    
  )
}

export default ChangeEmapilUsername
