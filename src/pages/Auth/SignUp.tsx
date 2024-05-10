import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const SignUp = () => {

  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    console.log(formData);
  };

  const LogHandler= () => {

    console.log(formData.password + formData.repeatPassword)
  }


  const HandleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      console.error('Password and repeat password do not match');
      // Optionally, you can display an error message to the user
      return;
    }

    const username = `${formData.firstname} ${formData.surname}`;

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: formData.email,
          password: formData.password
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      window.location.href = '/Signin';
    }
    catch (error) {
      console.error('Error creating user:', error);
      //toast.error((error instanceof Error) ? error.message : 'Error creating user');
    }
  }

  return (
    <div className=' flex w-full '>
      <div className=' w-[45%] mt-10'>
        
        <div className='flex flex-col justify-center items-center mb-5'>
            <img src="src\assets\images\geotagger_logo.PNG" alt="logo" className="w-32 h-auto mr-[21rem] mb-20" />
            <h1 className='text-4xl mb-2'>Sign up</h1>
            <p className='text-center mb-2'>Your name will appear on posts and your public profle.</p>
            <img src="src\assets\images\default_user_pic.jpg" alt="DefaultUserPic" className=' w-[4rem] rounded-full' />
        </div>
        <div className='flex justify-center'>
            
        <form className='flex flex-col w-full max-w-md' onSubmit={HandleSubmit}>

            <label htmlFor="email">Email</label>
            <input className='border rounded-lg px-2 py-1 mb-2 w-full' name='email' id='email' type="email" onChange={handleChange} required/>

            <div className=' flex justify-between'>
                <div className=' mr-2'>
                    <label htmlFor="firstname">First name</label>
                    <input className='border rounded-lg px-2 py-1 mb-2 w-full' name='firstname' id='firstname' type="text" onChange={handleChange} required/>
                </div>
                <div className=' ml-2'>
                    <label htmlFor="surname">Last name</label>
                    <input className='border rounded-lg px-2 py-1 mb-2 w-full' name='surname' id='surname' type="text" onChange={handleChange} required/>
                </div>
            </div>

            <label htmlFor="password">Password</label>
            <input className='password border rounded-lg px-2 py-1 mb-2 w-full' name='password' id='password' type="password" onChange={handleChange} required/>

            <label htmlFor="repeatPassword">Repeat password</label>
            <input className='border rounded-lg px-2 py-1 mb-2 w-full' name='repeatPassword' id='repeatPassword' type="password" onChange={handleChange} required/>

            <button className='bg-green-400 text-white font-bold py-2 px-4 mb-2 w-full rounded-xl' type='submit'>Sign in</button>
            <button className='bg-purple-400 text-white font-bold py-2 px-4 mb-2 w-full rounded-xl' onClick={LogHandler}>check</button>

            <div className="flex justify-between">
            <p>Already have an account?</p>
            <Link className='SignUpToLoginLink text-green-400' to="/Signin">Sign in</Link>

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

export default SignUp
