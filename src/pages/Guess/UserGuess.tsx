import React, { useEffect, useState } from 'react'

interface Guess {
    id: number;
    UserID: number;
    LocationID: number;
    guessedLocation: string;
    distance: number;
    date: Date;
  }

  interface User {
    id: number;
    username: string;
    email: string;
    password?: string;
    profilePic?: string;
    points: number;
  }

const UserGuess = ({ guess, index }: { guess: Guess; index: number }) => {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const fetchUserData = async() => {
            try {
                const userData = await fetch(`http://localhost:3000/users/${guess.UserID}`);
                if (!userData.ok) {
                    throw new Error('Error getting user data');
                }
                const userDataJson = await userData.json();
                setUser(userDataJson);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUserData()
    })

    let backgroundColor = '';
    if (index === 0) {
      backgroundColor = 'bg-yellow-400'; // First place
    } else if (index === 1) {
      backgroundColor = 'bg-gray-400'; // Second place
    } else if (index === 2) {
      backgroundColor = ' bg-yellow-600'; // Third place
    } else   {
      backgroundColor = 'bg-gray-600'; // Dark gray for positions 4-6
    } 


  return (
    <div className='flex  items-center justify-between mb-3'>
        <div className='flex  items-center '>
            <div className={`leaderboardPlaceTag flex justify-center items-center w-[2rem] h-[2rem] rounded-full mr-4 ${backgroundColor}`}>
                <p className='text-white'>{index + 1}</p>
            </div>
            <div className='userImage mr-4'>
                <img src={user?.profilePic} alt="userImage" className='w-[3rem] h-[3rem] rounded-full'/>
            </div>
            <div className='nameAndDate flex flex-col'>
                <p>{user?.username}</p>
                <p>{new Date(guess.date).toLocaleDateString()}</p>
            </div>
        </div>
       
        <div className='errorDistance '>
            <p className=' text-green-400 text-xl'>{guess.distance}m</p>
        </div>
    </div>
  )
}

export default UserGuess
