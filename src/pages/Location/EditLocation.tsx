import React, { useEffect, useState, useRef } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { toast, ToastContainer } from 'react-toastify'; 
import Cookies from 'js-cookie';
import LocationInterface from '../../assets/Interfaces/Location';


const libraries: Libraries = ['places'];



const EditLocation = ({ Close, LocationToEdit }: { Close: () => void; LocationToEdit: LocationInterface | null }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCgJ8LbG1xEChvwgnIIt4dQmBEzaW2nqsY',
    libraries,
  });

  const [locationImage, setLocationImage] = useState<string>("src/assets/images/placeholder-image 1.png");
  const [locationImage2, setLocationImage2] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [location2, setLocation2] = useState('');
  const [locationID, setLocationID] = useState('')
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocationImage(LocationToEdit?.photo?.toString() || "src/assets/images/placeholder-image 1.png");
    setLocation(LocationToEdit?.location?.toString() || "")
    setLocationID(LocationToEdit?.id?.toString() || '')

    setLocationImage2(locationImage)
    setLocation2(location)
    }, [LocationToEdit]);

  useEffect(() => {
    if (!isLoaded || autocompleteRef.current || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current!.getPlace();
      setLocation(place.formatted_address || '');
    });
  }, [isLoaded]);

  const handleEditLocation = async () => {


    if (locationImage === locationImage2 && location === location2) {
      console.log('No changes to edit');
      toast.error('No changes to edit');
      return;
    }

    let imageUrl = locationImage2;
    let data: Partial<LocationInterface> = {};

    if (location !== location2) {
      data.location = location;
    }

    const token = Cookies.get('token');

    if (locationImage !== locationImage2 && selectedFile) {
      const formData = new FormData();
      formData.append('locationPic', selectedFile);
      formData.append('locationID', locationID);
      formData.append('key', 'Locations/');

      const response = await fetch('http://localhost:3000/aws/edit-location-pic', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const responseData = await response.json();
      imageUrl = responseData.imageUrl;
      data.photo = imageUrl;
    }

    if (Object.keys(data).length > 0) {
      const update = await fetch(`http://localhost:3000/locations/${locationID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!update.ok) {
        throw new Error('Failed to update location');
      }
    }

    Close();
  };

  const handleCancelEditLocation = () => {
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

  return (
    <div className='editLocationContainer flex flex-col items-center '>
      <div className='Container flex flex-col w-[30rem] items-center'>
        <div className='titleDiv text-3xl mb-2'>
          Edit <span className="text-green-500">location</span>
        </div>
        <div className='imageContainer w-[30rem] h-[10rem] mb-2 bg-gray-400'>
          <img className='w-full h-full object-cover' src={locationImage} alt="image" />
        </div>
        <div className='inputContainer w-[30rem] mb-3'>
          <label htmlFor="location">Location</label>
          <input
            className='w-full border rounded-lg'
            type="text"
            name='location'
            ref={inputRef}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className='flex w-[30rem] justify-between items-center'>
          <div className='uploadImageBtnContainer'>
            <label htmlFor="profile-pic-input" className="border border-green-400 text-green-400 rounded-lg p-2 w-[8rem] cursor-pointer text-center">
              Add image
              <input id="profile-pic-input" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <div className='addBtnContainer'>
            <button className='text-green-600 hover:bg-green-700 hover:text-white rounded-xl p-2 w-[6rem]' onClick={handleEditLocation}>Save</button>
            <button className='text-green-600 hover:bg-green-700 hover:text-white rounded-xl p-2 w-[6rem]' onClick={handleCancelEditLocation}>Cancel</button>
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default EditLocation;
