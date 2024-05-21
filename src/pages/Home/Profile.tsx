import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import MyLocation from '../Location/MyLocation';
import AddLocation from '../Location/AddLocation';
import EditLocation from '../Location/EditLocation';



interface LocationInterface {
  id:       number,
  userID:   number,
  name:     String,
  location: String,
  photo:    String,
  date:     Date,
}


const Profile = ({profilePic}:{profilePic: string}) => {

  const [ime, setIme] = useState('');
  const [addLocation, setAddLocation] = useState(false)
  const [editLocation, setEditLocation] = useState(false)
  const [locations, setLocations] = useState<LocationInterface[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationInterface | null>(null);

  useEffect(() => {
    SetUserData();

  }, ); 

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

  

  const handleDeleteLocation = () => {
    
  }

 

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
        
      
        const locationsData = await fetch(`http://localhost:3000/locations/user/${id}`,{
          method: 'GET',
          headers: {
            'Contetn-Type': 'application/json'
          }
        })

        if (!locationsData.ok) {
          throw new Error('error');
        }

        const locationArray = await locationsData.json()

        setLocations(locationArray)

        
    } catch (error: any) {
        console.error('Error fetching username:', error);
       // toast.error(error.message);
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
          <div className=' mb-[3.5rem] flex  items-center'>
            <img src={profilePic} alt="DefaultUserPic" className=" w-[4rem] h-[4rem] rounded-full " />
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
            {locations.length === 0 ? (
              <div>
                <p className=' text-lg font-bold'>No uploads yet!</p>
                <p className=' mb-3 '>Upload new location with the click
                  on button bellow or in navigation bar press the “+” button.</p>
                <button className=' mb-10 rounded-lg border border-green-400 text-white bg-green-400 w-[7rem]' onClick={handleAddLocation}>Add location</button>
              </div>
            ) : (
              <div className=' flex flex-wrap gap-4'>
                {locations.map((location) => (
                  < MyLocation key={location.id} location={location} EditVisable={handleEditLocation} />
                ))}
                <div className='addBtnContainer  h-[10rem] w-[15rem]'>
                  <button className='bg-gray-300 h-full w-full flex items-center justify-center text-8xl pb-4' onClick={handleAddLocation}>+</button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
    
  )
}

export default Profile
