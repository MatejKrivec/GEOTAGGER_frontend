import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';

import geotaggerLogo from  '../../assets/images/geotaggerLogo.jpg';
import mapDecorationImage from '../../assets/images/image 1.png'


const ForgotPassword = () => {
    const [Email, setEmail] = useState('');


   /* const handleSubmit = () => {
      
    }*/

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("email!!!!!!!!!!! " + Email)
        try {
            const response = await fetch('http://localhost:3000/ResetPassword/request', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: Email }),
            });
        
            if (!response.ok) {
              throw new Error('Failed to send reset token');
            }
        
            const { resetToken} = await response.json();

           const templateParams = {
              from_name: 'Matej',
              to_email: 'abrakadabra',
              to_name: 'Uporabnik geotaggerja',
              message: 'tukaj je tvoja koda za resetiranje passworda: ' + resetToken,
          };
          
        await emailjs.send('xxxxxxxxxxx', 'xxxxxxxxxxx', templateParams, 'xxxxxxxxxxx')
              .then(
                  () => {
                      console.log('SUCCESS!');
                      toast.success('Reset token sent successfully!');
                  },
                  (error) => {
                      console.log('FAILED...', error.text);
                      toast.error('Failed to send email: ' + error.text);
                  },
              );
      
            window.location.href = '/ResetPassword';

          } catch (error) {
            console.error('Error sending reset token:', error);
            toast.error((error instanceof Error) ? error.message : 'Error sending reset token');
          }
    };
    
  return (
    <div className='flex flex-col md:flex-row w-full'>
    <div className='w-full md:w-[45%] mt-10 px-4'>
      <div className='flex flex-col justify-center items-center mb-5'>
        <img src={geotaggerLogo} alt="logo" className="w-32 h-auto mr-[21rem] mb-20" />
        <h1 className='text-4xl mb-2'>Forgot password</h1>
        <p className='text-center'>Enter your account email and press send.</p>
        <p className='text-center'>Then a password reset token will be sent to you.</p>
      </div>
      <div className='flex justify-center'>
        <form id="forgotPasswordForm" className='flex flex-col w-full max-w-md' onSubmit={handleSubmit}>
          <label htmlFor="Email">Email</label>
          <input className='border rounded-lg px-2 py-1 mb-2 w-full ' name='email' type="email" onChange={(e) => setEmail(e.target.value)} required />
          <button className='bg-green-400 text-white font-bold py-2 px-4 mb-2 w-full rounded-xl' type='submit'>Send reset token</button>
          <div className="flex items-center justify-center">
            <Link className='SignUpToLoginLink text-green-400 hover:text-blue-400' to="/Signin">Back to Signin.</Link>
          </div>
        </form>
      </div>
    </div>
    <div className='hidden md:block w-full md:w-[55%]'>
      <img src={mapDecorationImage} alt="mapImg" className="w-full h-full object-cover" />
    </div>
    <ToastContainer />
  </div>

  )
}

export default ForgotPassword;
