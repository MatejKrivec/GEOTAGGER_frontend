import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';

const Profile = () => {

  const [ime, setIme] = useState('');

  useEffect(() => {
    SetUserData();

  }, ); // Empty dependency array to run only once on component mount

 

  const SetUserData = async () => {
    const id = localStorage.getItem('UserId');
    
    try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error('error');
        }

        const userData = await response.json();
        setIme(userData.username)
        
      
        
    } catch (error: any) {
        console.error('Error fetching username:', error);
       // toast.error(error.message);
    }
}; 
  
  return (
    <div className='overflow-y-auto m-5'>
      <div className=' mb-[3.5rem] flex  items-center'>
        <img src="src\assets\images\default_user_pic.jpg" alt="DefaultUserPic" className=" w-[4rem] rounded-full " />
        <h1 className='username text-5xl ml-5 text text-green-400'>{ime}</h1>
      </div>
      <div className=' flex flex-col'>
        <h1 className='text-2xl mb-3'>My best guesses</h1>
        <p className=' text-lg font-bold'>No best guesses yet!!</p>
        <p className=' mb-3'>Start new game and guess the location
         of the picture to get the results here!</p>
        
        <button className=' mb-10 rounded-lg border border-green-400 text-white bg-green-400 w-[8.5rem]'>Go to locations</button>
       
        
      </div>
      <div className=' flex flex-col '>
        <h1 className='text-2xl mb-3'>My uploads</h1>
        <p className=' text-lg font-bold'>No uploads yet!</p>
        <p className=' mb-3 '>Upload new location with the click
         on button bellow or in navigation bar press the “+” button.</p>
         <button className=' mb-10 rounded-lg border border-green-400 text-white bg-green-400 w-[7rem]'>Add location</button>
       
        
      </div>
    </div>
  )
}

export default Profile
