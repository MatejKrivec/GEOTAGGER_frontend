import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'; 
import Cookies from 'js-cookie';
import UserInterface from '../../assets/Interfaces/User';
import GuessInterface from '../../assets/Interfaces/Guess';





const UserGuess = ({ guess, index }: { guess: GuessInterface; index: number }) => {
    const [user, setUser] = useState<UserInterface>()

    useEffect(() => {
        const fetchUserData = async() => {

          const token = Cookies.get('token');
            try {
                const userData = await fetch(`https://geotagger.adaptable.app/users/${guess.UserID}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                })
                if (!userData.ok) {
                    throw new Error('Error getting user data');
                }
                const userDataJson = await userData.json();
                setUser(userDataJson);
            } catch (error: any) {
                console.error('Error fetching user data:', error);
               // toast.error('Error fetching user data:', error);
            }
        }

        fetchUserData()
    }, [])

    let backgroundColor = '';
    if (index === 0) {
      backgroundColor = 'bg-yellow-400'; 
    } else if (index === 1) {
      backgroundColor = 'bg-gray-400'; 
    } else if (index === 2) {
      backgroundColor = ' bg-yellow-600'; 
    } else   {
      backgroundColor = 'bg-gray-600'; 
    } 

    const userID = localStorage.getItem('UserId');
    let background = ''; 
    let distancetextcolour = 'text-green-400';
    let textcolour = '';

    if (userID !== null) {
      const userIdNumber = parseInt(userID, 10); 
      if (userIdNumber === guess.UserID) {
        background = 'bg-green-300';
        distancetextcolour = 'text-white';
        textcolour = 'text-white';
      }
    }


  return (
    <div className={`flex  items-center  mb-3 ${background} p-1`}>
        <div className='flex  items-center '>
            <div className={`leaderboardPlaceTag flex justify-center items-center w-[2rem] h-[2rem] rounded-full mr-4 ${backgroundColor}`}>
                <p className='text-white'>{index + 1}</p>
            </div>
            <div className='userImage mr-4'>
                <img src={user?.profilePic} alt="userImage" className='w-[3rem] h-[3rem] rounded-full'/>
            </div>
            <div className={`nameAndDate flex flex-col `}>
                <p className={`${textcolour}`}>{user?.username}</p>
                <p className={`${textcolour}`}>{new Date(guess.date).toLocaleDateString()}</p>
            </div>
        </div>
       
        <div className={`errorDistance ml-auto ${distancetextcolour}`}>
            <p className='  text-xl'>{guess.distance}m</p>
        </div>
        <ToastContainer></ToastContainer>
    </div>
  )
}

export default UserGuess
