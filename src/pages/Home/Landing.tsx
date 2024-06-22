//import { Location } from 'aws-sdk'
import  { useEffect, useState } from 'react'
import Location from '../Location/Location'
import Guess from '../Guess/Guess'
import BestGuessLocation from '../Location/BestGuessLocation'
import { toast, ToastContainer } from 'react-toastify'; 
import { useGetGuessesByUserIdQuery } from '../../services/api';
import Cookies from 'js-cookie';
import LocationInterface from '../../assets/Interfaces/Location';
import GuessInterface from '../../assets/Interfaces/Guess';




const Landing = () => {

  const [locations, setLocations] = useState<LocationInterface[]>([])
  const [guessing, setGuessing] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationInterface | null>(null)
 
  //const [guesses, setGuesses] = useState<Guess[]>([]);

  const userId = localStorage.getItem('UserId');
  const { data: guesses, error, isLoading } = useGetGuessesByUserIdQuery(userId || '');


  useEffect(() => {
    if (error) {
      console.error('Error fetching guesses:', error);
      toast.error('An error occurred while fetching guesses.');
    }
  }, [error]);

  useEffect(() => {
   // setBestGuessesData();
    setLocationsData()
    localStorage.setItem('activeTab', 'homeLanding');
  },)

  const setLocationsData = async() => {
    const userID = localStorage.getItem('UserId')

    const token = Cookies.get('token');

    try {
      const LocationsData = await fetch(`https://geotagger.adaptable.app/locations/other/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if(!LocationsData.ok){
        throw new Error('Failed to fecth locations!')
      }

      const LocationsArray = await LocationsData.json();

      setLocations(LocationsArray)
      
    } catch (error) {
      console.log(error)
    }
  }

 /* const setBestGuessesData = async () => {

    const id = localStorage.getItem('UserId');
    try {
      const response = await fetch(`http://localhost:3000/guesses/user/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching guesses');
      }
      const data: Guess[] = await response.json();
  
      const groupedGuesses: { [key: number]: Guess } = {};
      data.forEach((guess: Guess) => {
        if (!(guess.LocationID in groupedGuesses) || guess.distance < groupedGuesses[guess.LocationID].distance) {
          groupedGuesses[guess.LocationID] = guess;
        }
      });
  
      const uniqueGuesses = Object.values(groupedGuesses);
  
      uniqueGuesses.sort((a: Guess, b: Guess) => a.distance - b.distance);
  
      setGuesses(uniqueGuesses);

      //location.reload()
    } catch (error: any) {
      console.error('Error:', error);
     // toast.error('Error:', error);
      //toast.error('An error occurred while fetching guesses.');
    }
  };*/

  const handleLocationClick = (location: LocationInterface) => {
    setSelectedLocation(location)
    setGuessing(!guessing)
  }

  const handleGuesClose = () => {
    setGuessing(!guessing)
  }


  //// RTK QUERY CODE v profile je se defauolt nareto da klicem api pa to tui pa uporabljam slice pa api.ts

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading guesses</div>;


  const groupedGuesses: { [key: number]: GuessInterface } = {};
  guesses?.forEach((guess: GuessInterface) => {
    if (!(guess.LocationID in groupedGuesses) || guess.distance < groupedGuesses[guess.LocationID].distance) {
      groupedGuesses[guess.LocationID] = guess;
    }
  });

  const uniqueGuesses = Object.values(groupedGuesses);
  uniqueGuesses.sort((a: GuessInterface, b: GuessInterface) => a.distance - b.distance);

  ////

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
          {uniqueGuesses.map((guess) => (
            <BestGuessLocation key={guess.id} guess={guess}></BestGuessLocation>
          ))}
        </div>
        <div className='flex justify-center '>
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
