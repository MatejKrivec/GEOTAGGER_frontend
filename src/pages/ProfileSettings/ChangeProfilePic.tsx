import React, { useEffect, useState } from 'react';
import Conformation from './Conformation';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';

const ChangeProfilePic = ({ onClose, onConfirmClose }: { onClose: () => void; onConfirmClose: () => void }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setData();
  }, []);

  const setData = async () => {
    const token = Cookies.get('token');
    
    try {
      const userId = localStorage.getItem('UserId');
      const data = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const user = await data.json();
      setProfilePic(user.profilePic);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); 

    const token = Cookies.get('token');
    
    try {
      if (!selectedFile) {
        throw new Error('No file selected');
      }

      const formData = new FormData();
      formData.append('profilePic', selectedFile);
  
      const IDuser = localStorage.getItem('UserId')!; // Type assertion with `!`
      formData.append('userId', IDuser);

      const key = 'UserImages/'
      formData.append('key', key);

      
  
      const response = await fetch('http://localhost:3000/aws/upload-profile-pic', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        toast.error('Failed to upload image');
        throw new Error('Failed to upload image');
      }

      const responseData = await response.json(); 
      const imageUrl = responseData.imageUrl;

   


    const userId = localStorage.getItem('UserId');
    const patchResponse = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ profilePic: imageUrl })
    });

    if (!patchResponse.ok) {
      toast.error('Failed to update profile picture');
      throw new Error('Failed to update profile picture');
    }

    setShowConfirmation(!showConfirmation);

      setShowConfirmation(!showConfirmation);
    } catch (error) {
     // toast.error('Error uploading image:', error);
      console.error('Error uploading image:', error);
    }
  };

  const handleConformationClose = () => {
    onConfirmClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedPic = reader.result as string;
        setProfilePic(uploadedPic);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
    {showConfirmation ? (
      <Conformation onClosee={handleConformationClose} />
    ) : (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-4 md:p-6 rounded-md w-full max-w-[496px]">
          <h1 className="text-2xl md:text-3xl mb-3">
            Profile <span className="text-green-400">settings</span>
          </h1>
          <p className="text-sm md:text-base mb-3">Change your profile photo</p>
          <form className="flex flex-col w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center items-center mb-5">
              <img className="rounded-full h-[5rem] w-[5rem] mb-2 md:mb-3" src={profilePic} alt="" />
              <label htmlFor="profile-pic-input" className="border text-green-400 rounded-lg p-2 w-[12rem] cursor-pointer text-center">
                Change profile photo
                <input id="profile-pic-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <div className="flex justify-end">
              <button className="text-green-400 hover:bg-green-400 hover:text-white mr-2 rounded-2xl p-4 md:p-5" onClick={handleClose}>
                Cancel
              </button>
              <button className="text-green-400 hover:bg-green-400 hover:text-white rounded-2xl p-4 md:p-5" type='submit'>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    <ToastContainer></ToastContainer>
  </>
  );
};

export default ChangeProfilePic;
