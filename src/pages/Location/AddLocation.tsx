import React, { useDebugValue, useEffect, useState } from 'react'
import GoogleMapComponent from './GoogleMapComponent';
import { toast, ToastContainer } from 'react-toastify'; 



const AddLocation = ({Close}: {Close: () => void}) => {

    const [locationImage, setLocationImage] = useState("src/assets/images/placeholder-image 1.png");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [location, setLocation] = useState('');
    

    const handleAddLocation = async() => {
        if(locationImage === "src/assets/images/placeholder-image 1.png") {
            console.log('image cant be default')
            toast.error('you have to add an image')
            return
        }
        if(location === ''){
            console.log('location cant be empty')
            toast.error('location cant be empty')
            return
        }

        try {
            if (!selectedFile) {
                throw new Error('No file selected');
                toast.error('No file selected')
              }

            const formData = new FormData();
            formData.append('profilePic', selectedFile);
        
            const IDuser = localStorage.getItem('UserId')!; // Type assertion with `!`
            formData.append('userId', IDuser);

            const key = 'Locations/'
            formData.append('key', key);
        
            const response = await fetch('http://localhost:3000/aws/upload-profile-pic', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const responseData = await response.json(); 
            const imageUrl = responseData.imageUrl;

            const date = Date.now()
            const datetime= new Date(date).toISOString();

            const create = await fetch('http://localhost:3000/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: parseInt(IDuser),
                    location: location,
                    photo: imageUrl,
                    date: datetime,
                    name: location
                })
            })

            if (!create.ok) {
                throw new Error('Failed to create user');
            }

            const userID = localStorage.getItem('UserId');
            const points = 10

            const updateResponse = await fetch(`http://localhost:3000/users/addUserPoints/${userID}`, {
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
            toast.success('User points updated successfully')
            
        } catch (error) {
            
        }

        Close();
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setLocationImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
    };

    const handleLocationSelect = (address: string) => {
        setLocation(address);
    };

  return (
    <div className='addLocationContainer flex flex-col items-center '>
        <div className='Container flex flex-col w-[30rem] items-center'>
            <div className='titleDiv text-3xl mb-2'>
                Add a new <span className="text-green-500">location</span>
            </div>
            <div className='imageContainer w-[30rem] h-[10rem] mb-2  bg-gray-400'>
                <img className='w-full h-full object-cover' src={locationImage} alt="image" />
            </div>
            <div className='uploadImageBtnContainer w-[30rem] flex justify-end mb-2'>
            <label htmlFor="profile-pic-input" className="border border-green-400 text-green-400  rounded-lg p-2 w-[8rem] cursor-pointer text-center">
                  Add image
                  <input id="profile-pic-input" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
            </div>
            <div className='mapContainer w-[30rem] h-[15rem] bg-gray-400 mb-2'>
                <GoogleMapComponent onLocationSelect={handleLocationSelect} />
            </div>
            <div className='inputContainer w-[30rem] mb-2'>
                <label htmlFor="location">Location</label>
                <input className='w-full border rounded-lg' type="text" name='location' value={location} onChange={(e) => setLocation(e.target.value)} required/>
            </div>
            <div className='addBtnContainer w-[30rem] flex justify-end mb-4'>
                <button className=' text-white bg-green-600 rounded-xl p-2 w-[6rem]' onClick={handleAddLocation}>Add new</button>
            </div>
        </div>
        <ToastContainer></ToastContainer>
        

      
    </div>
  )
}

export default AddLocation
