import React, { useState } from 'react'
import '../../assets/styles/AuthPages.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';



const SignIn = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const HandleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();


    try{

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        console.log('Failed to log in')
        throw new Error('Failed to log in');
      }

      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60000);

      const { token } = await response.json();
      Cookies.set('token', token, { 
        expires: oneHourLater, 
        secure: true, 
        sameSite: 'None' 
      });

      try {
        const response = await fetch('http://localhost:3000/auth/protected', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
        if (!response.ok) {
          throw new Error('Wrong username or password'); 
        }
      
        const responseData = await response.json();
        navigate('/'+responseData.route); 
      
      } catch (error) {
        console.error('Error authenticating:', error);

        //toast.error((error as Error).message);
      }

    }
    catch (error) {
      console.error('Error logging in:', error);
      //toast.error((error as Error).message);
    }
  }
  



  return (

    <div className=' flex w-full'>
      <div className=' w-[45%] mt-10'>
        
        <div className='flex flex-col justify-center items-center mb-5'>
            <img src="src\assets\images\geotagger_logo.PNG" alt="logo" className="w-32 h-auto mr-[21rem] mb-20" />
            <h1 className='text-4xl mb-2'>Sign in</h1>
            <p className='text-center'>Welcome back to Geotagger. We are glad that you are back.</p>
        </div>
        <div className='flex justify-center'>
            
        <form className='flex flex-col w-full max-w-md' onSubmit={HandleSubmit}>

            <label htmlFor="Email">Email</label>
            <input className='border rounded-lg px-2 py-1 mb-2 w-full ' name='email' type="email"  onChange={handleChange} required/>

            <label htmlFor="password">Password</label>
            <input className='border rounded-lg px-2 py-1 mb-1  w-full' name='password' type="password" onChange={handleChange} required/>

            <Link className='SignUpToLoginLink text-green-400 self-end mb-3 hover:text-blue-400' to="/ForgotPassword">Forgot password</Link>

            <button className='bg-green-400 text-white font-bold py-2 px-4 mb-2 w-full rounded-xl '>Sign in</button>
            <button className='border text-black font-bold py-2 px-4 mb-2 w-full rounded-xl flex justify-center items-center'>
                <img src="src\assets\images\google-logo.jpg" alt="googleLogo" className=' w-8 bg-transparent mr-2'/>
                Sign in with Google</button>
            <button className='bg-blue-400 text-white font-bold py-2 px-4 mb-2 w-full rounded-xl flex justify-center items-center'>
                <img src="src\assets\images\fb_logo.png" alt="" className='  w-8 mr-2' />
                Sign in with Facebook</button>

            <div className="flex justify-between">
            <p>Do you want to create an account?</p>
            <Link className='SignUpToLoginLink text-green-400 hover:text-blue-400' to="/Signup">Sign up</Link>
            </div>
        </form>
        </div>
      </div>

      <div className=' w-[55%]'>
            <img src="src\assets\images\image 1.png" alt="mapImg" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}

export default SignIn
