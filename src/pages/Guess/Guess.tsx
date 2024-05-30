import React, { useEffect, useState } from 'react';
import UserGuess from './UserGuess';
import GoogleMapComponent2 from './GoogleMapComponent2';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface LocationInterface {
  id: number;
  userID: number;
  name: string;
  location: string;
  photo: string;
  date: Date;
}

interface Guess {
  id: number;
  UserID: number;
  LocationID: number;
  guessedLocation: string;
  distance: number;
  date: Date;
}

const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  const apiKey = 'AIzaSyCdwFcRukCF5DwPyaa15dXxX-Ls3Tq55Lo';
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
  );

  if (!response.ok) {
    console.error('Error fetching geocode data:', response.statusText);
    return null;
  }

  const data = await response.json();

  if (data.status !== 'OK' || data.results.length === 0) {
    console.error('Error fetching geocode data:', data.status);
    return null;
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
};

const calculateCrowDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000; // Convert to meters
};

const Guess = ({ location, onClose}: { location: LocationInterface, onClose: () => void }) => {
  const [errorDistance, setErrorDistance] = useState('');
  const [guessedLocation, setGuessedLocation] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);

  useEffect(() => {
    
  
    fetchGuesses();

    console.log(guesses)
  }, [location.id]);

  const fetchGuesses = async () => {
    try {
      const response = await fetch(`http://localhost:3000/guesses/location/${location.id}`);
      if (!response.ok) {
        throw new Error('Error fetching guesses');
      }
      const data = await response.json();
      
      // Group guesses by UserID
      const groupedGuesses: { [key: number]: Guess } = {};
      data.forEach((guess: Guess) => {
        if (!(guess.UserID in groupedGuesses) || guess.distance < groupedGuesses[guess.UserID].distance) {
          groupedGuesses[guess.UserID] = guess;
        }
      });

      // Convert object back to array
      const uniqueGuesses = Object.values(groupedGuesses);

      // Sort unique guesses by UserID
      uniqueGuesses.sort((a: Guess, b: Guess) => a.distance - b.distance);

      setGuesses(uniqueGuesses);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while fetching guesses.');
    }
  };


  const handleLocationSelect = async (address: string, newLocation: any) => {
    const actualLocation = await geocodeAddress(location.location);
    const guessedLocationCoords = await geocodeAddress(address);

    if (actualLocation && guessedLocationCoords) {
      const distance = calculateCrowDistance(
        actualLocation.lat,
        actualLocation.lng,
        guessedLocationCoords.lat,
        guessedLocationCoords.lng
      );
     // setDistance(`${distance.toFixed(0)} meters`);
      setErrorDistance(`${distance.toFixed(0)} meters`);
      setGuessedLocation(address);
    } else {
      console.error('Error geocoding addresses');
      toast.error('Error geocoding addresses.');
      setErrorDistance('Error calculating distance');
    }
  };

  const handleGuessClick = async () => {
    handleLocationSelect(guessedLocation, location.location);
   // setErrorDistance(Distance);
  
    try {
      const date = Date.now();
      const datetime = new Date(date).toISOString();
      const userID = localStorage.getItem('UserId');

      if (userID === null) {
        throw new Error('User ID not found in localStorage');
      }

      const userResponse = await fetch(`http://localhost:3000/users/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error('Error fetching user data');
      }

      const userData = await userResponse.json();
      console.log("USer POINTSS: "+ userData.points)
      if (userData.points === 0) {
        console.log("toaaaaasst")
        toast.error('You have zero points. Go upload a location.');
        return;
      }
      console.log("toaaaaasst22222222")

      


      const postResponse = await fetch(`http://localhost:3000/guesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserID: parseInt(userID),
          LocationID: location.id,
          guessedLocation: guessedLocation,
          distance: parseInt(errorDistance),
          date: datetime,
        })
      });
  
      if (!postResponse.ok) {
        throw new Error('Error creating a guess');
      }

      const errorDistanceInput = document.getElementsByName('errorDistance')[0] as HTMLInputElement;
      errorDistanceInput.value = errorDistance.toString();
      console.log(errorDistance)
  
      const newGuess = await postResponse.json();
      console.log('New guess created:', newGuess);
  
      const countResponse = await fetch(`http://localhost:3000/guesses/count/${userID}/${location.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!countResponse.ok) {
        throw new Error('Error fetching guess count');
      }
  
      const guessCount = await countResponse.json();
      console.log(`Number of guesses: ${guessCount}`);
  
      let points = 0;
      if (guessCount === 1) {
        points = 1;
      } else if (guessCount === 2) {
        points = 2;
      } else if (guessCount >= 3) {
        points = 3;
      }
  
      const updateResponse = await fetch(`http://localhost:3000/users/updateUserPoints/${userID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ points })
      });
  
      if (!updateResponse.ok) {
        throw new Error('Error updating user points');
      }
  
      console.log('User points updated successfully');
      fetchGuesses();
  
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleBackClick = () => {
    onClose()
  }

  return (
    <>
    <div className='w-full'>
      <button className='bg-green-400 text-white hover:border-blue-400 rounded-xl p-1 w-full' onClick={handleBackClick}>Back</button>
    </div>
    <div className='flex flex-col md:flex-row gap-4'>
      <div className='guess flex flex-col w-full md:w-[65%]'>
        <div className='text-3xl mb-4'>
          <h1>
            Take a <span className='text-green-400'>guess</span>!
          </h1>
        </div>
        <div className='image bg-slate-300 h-[20rem] mb-4'>
          <img className='object-cover w-full h-full' src={location.photo} alt='LocationPicture' />
        </div>
        <div className='mapComponent bg-slate-300 h-[15rem] mb-4'>
          <GoogleMapComponent2 onLocationSelect={handleLocationSelect}></GoogleMapComponent2>
        </div>
        <div className='guessInput flex justify-between mb-2'>
          <div className='flex flex-col w-[75%]'>
            <label htmlFor='guessedLocation'>Guessed location</label>
            <input
              className='border rounded-lg'
              type='text'
              name='guessedLocation'
              value={guessedLocation}
              onChange={(e) => setGuessedLocation(e.target.value)}
            />
          </div>
          <div className='flex flex-col w-[22.5%]'>
            <label htmlFor='errorDistance'>Error distance</label>
            <input className='border rounded-lg' type='text' name='errorDistance'  readOnly />
          </div>
        </div>
        <div className='btnContainer self-end'>
          <button
            className='bg-green-400 text-white hover:border-blue-400 rounded-xl p-1 w-[4.5rem]'
            onClick={handleGuessClick}
          >
            Guess
          </button>
          <ToastContainer />
        </div>
      </div>
  
      {/* Leaderboard Section */}
      <div className='leaderboard flex flex-col w-full md:w-[35%]'>
        <div className='text-3xl mb-4'>
          <h1>Leaderboard</h1>
        </div>
        <div className='flex flex-col'> 
          {guesses.map((guess, index) => (
            <UserGuess key={guess.id} guess={guess} index={index}></UserGuess>
          ))}
        </div>
      </div>
      {/* End Leaderboard Section */}
    </div>
  </>
  
    
  );
};

export default Guess;
