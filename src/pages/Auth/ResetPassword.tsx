import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault(); 
    try {
      const response = await fetch('http://localhost:3000/ResetPassword/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: formData.token }),
      });

      if (!response.ok) {
        throw new Error('Error validating');
      }

      const data = await response.json();
      const userId = data.userId;
      console.log('user id: ' + userId);

      console.log('Token is valid');

      if (formData.newPassword !== formData.confirmNewPassword) {
        console.log('Passwords do not match');
        toast.error('Passwords do not match');
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
        console.log('Error updating user');
        throw new Error('Error updating user');
      }

      setResetSuccess(true);
    } catch (error) {
      console.error('Error validating token:', error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row w-full'>
  <div className='w-full md:w-[45%] mt-10 px-4'>
    <div className='flex flex-col justify-center items-center mb-5'>
      <img src="src/assets/images/geotagger_logo.PNG" alt="logo" className="w-32 h-auto mr-[21rem] mb-20" />
      <h1 className='text-4xl mb-2'>Reset password</h1>
      <p className='text-center'>Enter the token received in your email.</p>
    </div>
    <div className='flex justify-center'>
      <form className='flex flex-col w-full max-w-md' onSubmit={handleSubmit}>
        <label htmlFor="token">Token</label>
        <input
          className='border rounded-lg px-2 py-1 mb-2 w-full'
          name='token'
          type="text"
          value={formData.token}
          onChange={handleChange}
          required
        />
        <label htmlFor="newPassword">New password</label>
        <input
          className='border rounded-lg px-2 py-1 mb-2 w-full'
          name='newPassword'
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <label htmlFor="confirmNewPassword">Confirm new password</label>
        <input
          className='border rounded-lg px-2 py-1 mb-4 w-full'
          name='confirmNewPassword'
          type="password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          required
        />
        <button className='bg-green-400 text-white font-bold py-2 px-4 mb-2 w-full rounded-xl' type='submit'>Reset password</button>
        {resetSuccess && <p className="text-green-500">Password reset successful!</p>}
        <div className="flex items-center justify-center">
          <Link className='SignUpToLoginLink text-green-400 hover:text-blue-400' to="/Signin">Back to Signin.</Link>
        </div>
      </form>
    </div>
  </div>
  <div className='hidden md:block w-full md:w-[55%]'>
    <img src="src/assets/images/image 1.png" alt="mapImg" className="w-full h-full object-cover" />
  </div>
  <ToastContainer />
</div>

  );
};

export default ResetPassword;
