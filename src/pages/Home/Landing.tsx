//import { Location } from 'aws-sdk'
import React, { useEffect, useState, useSyncExternalStore } from 'react'
import Location from '../Location/Location'


interface LocationInterface {
  id: number,
  userID: number,
  name: String,
  location: String,
  photo: String,
  date: Date,
}


const Landing = () => {

  const [locations, setLocations] = useState<LocationInterface[]>([])

  useEffect(() => {
    setLocationsData()
  },[])

  const setLocationsData = async() => {
    const userID = localStorage.getItem('UserId')
    console.log(userID)
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

      console.log("array: "+LocationsArray)

      setLocations(LocationsArray)

      
    } catch (error) {
      
    }
  }


  return (
    <div className='overflow-y-auto m-5'>
      <div className=' flex flex-col'>
        <h1 className='text-3xl mb-3 text-green-400'>Personal best guesses</h1>
        <p className=' mb-3'>Your personal best guesses appear here.
             Go on and try to beat your personal records or set a new one!</p>
        <div className=' flex flex-col items-center'>
            best guesses list...
            <button className=' mt-5 rounded-lg border border-green-400 text-green-400 w-[6rem]'>Load more</button>
        </div>
        
      </div>
      <div className=' flex flex-col '>
          <h1 className='text-3xl mb-3  text-green-400'>New locations</h1>
          <p className=' mb-3'>New uploads from users.
              Try to guess all the locations by pressing on a picture.</p>
              {locations.length === 0 ? (
                <div className=' flex flex-col items-center justify-center'>
                      uploads list...
                      <button className=' mt-5 rounded-lg  border border-green-400 text-green-400 w-[6rem]'>Load more</button>
                </div>
              ) : (
                
                  <div className=' flex flex-wrap gap-4'>
                        {locations.map((location) => (
                        <Location key={location.id} location={location}></Location>
                      )) }
                  </div>
              )}
              <div className=' flex flex-col items-center justify-center'>
                      <button className=' mt-5 rounded-lg  border border-green-400 text-green-400 w-[6rem]'>Load more</button>
                </div>
        </div>
      
      
    </div>
  )
}

export default Landing
