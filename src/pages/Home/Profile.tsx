import  { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import MyLocation from '../Location/MyLocation';
import AddLocation from '../Location/AddLocation';
import EditLocation from '../Location/EditLocation';
import BestGuessLocation from '../Location/BestGuessLocation';
import {  ToastContainer } from 'react-toastify'; 
import { useError } from '../Error/ErrorContext';
import LocationInterface from '../../assets/Interfaces/Location';
import GuessInterface from '../../assets/Interfaces/Guess';








const Profile = ({profilePic}:{profilePic: string}) => {



  const { displayError } = useError();

  const [ime, setIme] = useState('');
  const [addLocation, setAddLocation] = useState(false)
  const [editLocation, setEditLocation] = useState(false)
  const [locations, setLocations] = useState<LocationInterface[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationInterface | null>(null);
  const [guesses, setGuesses] = useState<GuessInterface[]>([]);


  useEffect(() => {
    SetUserData();
    setBestGuessesData();
   
  }, [addLocation, selectedLocation, locations]); 

  const handleAddLocation = () => {
      setAddLocation(!addLocation)
  }

  const closeAddLocation = () => {
    setAddLocation(!addLocation)
  }

  const handleEditLocation = (location: LocationInterface) => {
    setSelectedLocation(location);
    console.log(location)
    setEditLocation(!editLocation)
  }

  const closeEditLocation = () => {
    setEditLocation(!editLocation)
  }

  const setBestGuessesData = async () => {
    const token = Cookies.get('token');
    const id = localStorage.getItem('UserId');
    try {
      const response = await fetch(`https://geotagger.adaptable.app/guesses/user/${id}`,{
        method: 'GET',
        headers: {
          'Contetn-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error fetching guesses');
       console.log('Error fetching guesses');
      }
      const data: GuessInterface[] = await response.json();
  
      const groupedGuesses: { [key: number]: GuessInterface } = {};
      data.forEach((guess: GuessInterface) => {
        if (!(guess.LocationID in groupedGuesses) || guess.distance < groupedGuesses[guess.LocationID].distance) {
          groupedGuesses[guess.LocationID] = guess;
        }
      });
  
      const uniqueGuesses = Object.values(groupedGuesses);
  
      uniqueGuesses.sort((a: GuessInterface, b: GuessInterface) => a.distance - b.distance);
  
      setGuesses(uniqueGuesses);
    } catch (error) {

      ////ERROR COMPONENT

      console.error('Error:', error);
      if (typeof error === 'string') {
        displayError(error);
      } else if (error instanceof Error) {
        displayError(error.message);
      } else {
        displayError('An unexpected error occurred.');
      }
     // toast.error('An error occurred while fetching guesses.');
    }
  };


  const SetUserData = async () => {
    const id = localStorage.getItem('UserId');
    const token = Cookies.get('token');

    try {
        const response = await fetch(`https://geotagger.adaptable.app/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
            },
        });
        
        if (!response.ok) {
            throw new Error('error');
            console.log('error');
        }

        const userData = await response.json();
        setIme(userData.username)
        
      
        const locationsData = await fetch(`https://geotagger.adaptable.app/locations/user/${id}`,{
          method: 'GET',
          headers: {
            'Contetn-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!locationsData.ok) {
          throw new Error('error');
        }

        const locationArray = await locationsData.json()

        setLocations(locationArray)

        
    } catch (error) {
        console.error('Error fetching username:', error);
      //  toast.error(error.message +"sadasdasdasdad");
    }
}; 
  
  return (
    <div>
  {addLocation ? (
    <AddLocation Close={closeAddLocation}></AddLocation>
  ) : editLocation ? (
    <EditLocation Close={closeEditLocation} LocationToEdit={selectedLocation}></EditLocation>
  ) : (
    <div className='overflow-y-auto m-5'>
      <div className='mb-[3.5rem] flex items-center justify-center md:justify-start'>
        <img src={profilePic} alt="DefaultUserPic" className="w-[4rem] h-[4rem] rounded-full" />
        <h1 className='username text-5xl ml-5 text text-green-400'>{ime}</h1>
      </div>
      {guesses.length === 0 ? (
        <div className='flex flex-col'>
          <h1 className='text-2xl mb-3'>My best guesses</h1>
          <p className='text-lg font-bold'>No best guesses yet!!</p>
          <p className='mb-3'>Start new game and guess the location
            of the picture to get the results here!</p>
          <button className='mb-10 rounded-lg border border-green-400 text-white bg-green-400 w-[8.5rem] mt-3'>Go to locations</button>
        </div>
      ) : (
        <div>
          <h1 className='text-2xl mb-3'>My best guesses</h1>
          <div className='flex flex-wrap gap-4 justify-center md:justify-start'>
            {guesses.map((guess) => (
              <BestGuessLocation key={guess.id} guess={guess}></BestGuessLocation>
            ))}
          </div>
          <div className='flex justify-center '>
            <button className='mt-5 rounded-lg border border-green-400 text-green-400 w-[6rem]'>Load more</button>
          </div>
        </div>
      )}
      <div className='flex flex-col'>
        <h1 className='text-2xl mb-3'>My uploads</h1>
        {locations.length === 0 ? (
          <div>
            <p className='text-lg font-bold'>No uploads yet!</p>
            <p className='mb-3'>Upload new location with the click
              on button below or in navigation bar press the “+” button.</p>
            <button className='mb-10 rounded-lg border border-green-400 text-white bg-green-400 w-[7rem]' onClick={handleAddLocation}>Add location</button>
          </div>
        ) : (
          <>
            <div className='flex flex-wrap gap-4 justify-center md:justify-start'>
              {locations.map((location) => (
                < MyLocation key={location.id} location={location} EditVisable={handleEditLocation} />
              ))}
              <div className='addBtnContainer h-[10rem] w-[15rem]'>
                <button className='bg-gray-300 h-full w-full flex items-center justify-center text-8xl pb-4' onClick={handleAddLocation}>+</button>
              </div>
            </div>
            <div className='flex justify-center '>
              <button className='mt-5 rounded-lg border border-green-400 text-green-400 w-[6rem]'>Load more</button>
            </div>
          </>
        )}
      </div>
    </div>
  )}
  <ToastContainer></ToastContainer>
</div>

    
  )
}

export default Profile
