//import { Location } from 'aws-sdk'
import React, { useEffect, useState, useSyncExternalStore } from 'react'
import Location from '../Location/Location'
import Guess from '../Guess/Guess'
import BestGuessLocation from '../Location/BestGuessLocation'
import { toast, ToastContainer } from 'react-toastify'; 


interface LocationInterface {
  id: number,
  userID: number,
  name: string,
  location: string,
  photo: string,
  date: Date,
}


const Landing = () => {

  const [locations, setLocations] = useState<LocationInterface[]>([])
  const [guessing, setGuessing] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationInterface | null>(null)
  const [guesses, setGuesses] = useState<Guess[]>([]);

  useEffect(() => {
    setBestGuessesData();
    setLocationsData()
    localStorage.setItem('activeTab', 'homeLanding');
    //location.reload()
  },)

  const setLocationsData = async() => {
    const userID = localStorage.getItem('UserId')
    //console.log(userID)
    try {
      const LocationsData = await fetch(`http://localhost:3000/locations/other/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if(!LocationsData.ok){
        throw new Error('Failed to fecth locations!')
      }

      const LocationsArray = await LocationsData.json();

     // console.log("array: "+LocationsArray)

      setLocations(LocationsArray)

      
    } catch (error) {
      console.log(error)
    }
  }

  const setBestGuessesData = async () => {

    const id = localStorage.getItem('UserId');
    try {
      const response = await fetch(`http://localhost:3000/guesses/user/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching guesses');
      }
      const data: Guess[] = await response.json();
  
      // Group guesses by LocationID and find the best guess (smallest distance) for each location
      const groupedGuesses: { [key: number]: Guess } = {};
      data.forEach((guess: Guess) => {
        if (!(guess.LocationID in groupedGuesses) || guess.distance < groupedGuesses[guess.LocationID].distance) {
          groupedGuesses[guess.LocationID] = guess;
        }
      });
  
      // Convert object back to array
      const uniqueGuesses = Object.values(groupedGuesses);
  
      // Sort unique guesses by distance
      uniqueGuesses.sort((a: Guess, b: Guess) => a.distance - b.distance);
  
      setGuesses(uniqueGuesses);

      //location.reload()
    } catch (error: any) {
      console.error('Error:', error);
     // toast.error('Error:', error);
      //toast.error('An error occurred while fetching guesses.');
    }
  };

  const handleLocationClick = (location: LocationInterface) => {
    setSelectedLocation(location)
    setGuessing(!guessing)
  }

  const handleGuesClose = () => {
    setGuessing(!guessing)
  }


  return (
    <div className='overflow-y-auto m-5'>
  {guessing && selectedLocation ? (
    <Guess location={selectedLocation} onClose={handleGuesClose}></Guess>
  ) : (
    <>
      <div className='flex flex-col'>
        <h1 className='text-3xl mb-3 text-green-400'>Personal best guesses</h1>
        <p className='mb-3'>Your personal best guesses appear here. Go on and try to beat your personal records or set a new one!</p>
        <div className='flex flex-wrap gap-4 justify-center md:justify-start'>
          {guesses.map((guess) => (
            <BestGuessLocation key={guess.id} guess={guess}></BestGuessLocation>
          ))}
        </div>
        <div className='flex justify-center md:justify-start'>
          <button className='mt-5 rounded-lg border border-green-400 text-green-400 w-[6rem]'>Load more</button>
        </div>
      </div>
      <div className='flex flex-col'>
        <h1 className='text-3xl mb-3 text-green-400'>New locations</h1>
        <p className='mb-3'>New uploads from users. Try to guess all the locations by pressing on a picture.</p>
        {locations.length === 0 ? (
          <div className='flex flex-col items-center justify-center'>
            uploads list...
            <button className='mt-5 rounded-lg border border-green-400 text-green-400 w-[6rem]'>Load more</button>
          </div>
        ) : (
          <div className='flex flex-wrap gap-4 justify-center md:justify-start'>
            {locations.map((location) => (
              <Location key={location.id} location={location} onClick={() => handleLocationClick(location)}></Location>
            ))}
          </div>
        )}
        <div className='flex items-center justify-center'>
          <button className='mt-5 rounded-lg border border-green-400 text-green-400 w-[6rem]'>Load more</button>
        </div>
      </div>
    </>
  )}
  <ToastContainer></ToastContainer>
</div>

  )
}

export default Landing
