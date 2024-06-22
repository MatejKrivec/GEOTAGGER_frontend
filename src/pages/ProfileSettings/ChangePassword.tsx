import React, { useState } from 'react'
import Conformation from './Conformation'
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';

const ChangePassword = ({onClose, onConfirmClose}: {onClose: () => void; onConfirmClose: () => void;}) => {

  const [showConfirmation, setShowConfirmation] = useState(false)

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClose = () => {
    onClose();
  }

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); 

    const token = Cookies.get('token');

    try{


      if (!formData.newPassword && !formData.repeatNewPassword) {
          console.log('Please fill in all password fields.');
          toast.error('Please fill in all password fields.');
          return; 
      }

      if (formData.newPassword !== formData.repeatNewPassword) {
        console.log('Passwords do not match')
        toast.error('Passwords do not match')
      }
      else{
        const userId = localStorage.getItem('UserId');

        const response = await fetch(`https://geotagger.adaptable.app/users/validatePassword/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: formData.currentPassword }),
        });

        const isPasswordValid = await response.text();

        console.log(isPasswordValid)

        if (isPasswordValid === 'false') {
          console.log('invalid current pasword!!!!')
          toast.error('invalid current pasword!!!!')
          return;
        }


        const newPassword = formData.newPassword;
        const update = await fetch(`https://geotagger.adaptable.app/users/updatePassword/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password: newPassword }), 
        });
        if (!update.ok) {
          console.log('Error updating user')
          toast.error('Error updating user')
          throw new Error('Error updating user');
        }


        setShowConfirmation(true)

      }

    } catch{
    }
  }

  const handleConformationClose = () => {
    onConfirmClose();
  }

  return (
    <>
  {showConfirmation ? (
    <Conformation onClosee={handleConformationClose} />
  ) : (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 md:p-8 rounded-md w-full max-w-sm md:max-w-md">
        <h1 className="text-3xl md:text-4xl mb-4">
          Profile <span className="text-green-400">settings</span>
        </h1>
        <p className="mb-4">Change your password</p>
        <form className="flex flex-col w-full" onSubmit={handleSubmit}>
          <label htmlFor="CurrentP">Current password</label>
          <input
            className="border rounded-lg px-3 py-2 mb-3 w-full"
            name="currentPassword"
            type="password"
            onChange={handleChange}
          />

          <label htmlFor="NewP">New password</label>
          <input
            className="border rounded-lg px-3 py-2 mb-3 w-full"
            name="newPassword"
            type="password"
            onChange={handleChange}
          />

          <label htmlFor="RepeatNewP">Repeat new password</label>
          <input
            className="border rounded-lg px-3 py-2 mb-3 w-full"
            name="repeatNewPassword"
            type="password"
            onChange={handleChange}
          />

          <div className="flex justify-end">
            <button
              className="text-green-400 hover:bg-green-400 hover:text-white mr-3 md:mr-4 rounded-lg px-4 py-2"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="text-green-400 hover:bg-green-400 hover:text-white rounded-lg px-4 py-2"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
  <ToastContainer />
</>

  )
}

export default ChangePassword
