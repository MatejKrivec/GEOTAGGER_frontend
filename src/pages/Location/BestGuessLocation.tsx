import React, { useEffect, useState } from 'react'

interface Guess {
    id: number;
    UserID: number;
    LocationID: number;
    guessedLocation: string;
    distance: number;
    date: Date;
  }

  interface LocationInterface {
    id: number;
    userID: number;
    name: string;
    location: string;
    photo: string;
    date: Date;
  }

  

const BestGuessLocation = ({guess}: {guess: Guess}) => {
    const[location, setLocation] = useState<LocationInterface>();

    useEffect(()=> {
        setLocationData()
    })

    const setLocationData = async() => {
        try {
            const locationData = await fetch(`http://localhost:3000/locations/${guess.LocationID}`);
            if (!locationData.ok) {
                throw new Error('Error getting user data');
            }
            const locationDataJson = await locationData.json();
            setLocation(locationDataJson);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
  return (
    <div className="cursor-pointer relative h-[10rem] w-[15rem]">
      <div className="absolute inset-0">
        <img className="w-full h-full object-cover" src={location?.photo} alt="LocationImage" />
        <div className="absolute inset-0 bg-green-400 opacity-70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">{guess.distance}m</span>
        </div>
      </div>
    </div>
  )
}

export default BestGuessLocation
