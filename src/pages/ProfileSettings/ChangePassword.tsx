import React, { useState } from 'react'
import Conformation from './Conformation'

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
    try{

      console.log(formData)

      if (!formData.newPassword && !formData.repeatNewPassword) {
          console.log('Please fill in all password fields.');
          return; // Return early if any password is empty
      }

      if (formData.newPassword !== formData.repeatNewPassword) {
        //toast.error('Passwords do not match');
        console.log('Passwords do not match')
      }
      else{
        const userId = localStorage.getItem('UserId');

        const response = await fetch(`http://localhost:3000/users/validatePassword/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.currentPassword }),
        });

        const isPasswordValid = await response.text();

        console.log(isPasswordValid)

        if (isPasswordValid === 'false') {
          //toast.error('Invalid current password');
          console.log('invalid current pasword!!!!')
          return;
        }

        const newPassword = formData.newPassword;
        const update = await fetch(`http://localhost:3000/users/updatePassword/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }), 
        });
        if (!update.ok) {
          console.log('Error updating user')
          throw new Error('Error updating user');
        }


        setShowConfirmation(true)


      }

    } catch{

    }

   // setShowConfirmation(!showConfirmation)
  }

  const handleConformationClose = () => {
    onConfirmClose();
  }

  return (
    <>
      { showConfirmation ? (<Conformation onClosee={handleConformationClose}/> ): 
      (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-[496px]">
              <h1 className='text-3xl mb-3'>
                  Profile <span className="text-green-400">settings</span>
              </h1>
                  <p className=' mb-3'>Change your password</p>
                <form className='flex flex-col w-full max-w-md' onSubmit={handleSubmit}>

                  <label htmlFor="CurrentP">Current password</label>
                  <input className='border rounded-lg px-2 py-1 mb-2 w-full ' name='currentPassword' type="password"  onChange={handleChange}/>

                  <label htmlFor="NewP">New password</label>
                  <input className='border rounded-lg px-2 py-1 mb-2 w-full ' name='newPassword' type="password" onChange={handleChange}/>

                  <label htmlFor="RepeatNewP">Repeat new password</label>
                  <input className='border rounded-lg px-2 py-1 mb-2 w-full ' name='repeatNewPassword' type="password" onChange={handleChange}/>


                  <div className=' flex justify-end'>
                      <button className=' text-green-400 hover:bg-green-400 hover:text-white mr-2 rounded-2xl p-5' onClick={handleClose}>Cancel</button>
                      <button className=' text-green-400 hover:bg-green-400 hover:text-white rounded-2xl p-5' type='submit'>Submit</button>
                  </div>

                </form>
            </div>
        </div>
      )}
    </>
  )
}

export default ChangePassword
