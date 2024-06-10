import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { toast, ToastContainer } from 'react-toastify'; 
import Cookies from 'js-cookie';
import LocationInterface from '../../assets/Interfaces/Location';


interface LocationProps {
  EditVisable: (location: LocationInterface) => void;
  location: LocationInterface;
}

const MyLocation = ({ EditVisable, location }: LocationProps) => {

    const handleEditLocation = () => {
      EditVisable(location)
    }
  
    const handleDeleteLocation = async() => {


     // console.log("id od lokacije:"+location.id)

      //const id = location.id

      const token = Cookies.get('token');

      try {

        const deleteLocationPhoto = await fetch(`http://localhost:3000/aws/${location.id}`,{
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({key: "Locations/"})
        })

        if(!deleteLocationPhoto.ok){
          throw new Error("Failed to delete location")
        }


      

        const deleteLocation = await fetch(`http://localhost:3000/locations/${location.id}`,{
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        })

        if(!deleteLocation.ok){
          toast.error('Failed to delete location.')
          throw new Error("Failed to delete location")
        }

      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className="relative h-[10rem] w-[15rem]">
      <div className="absolute inset-0 bg-cover bg-center " 
        style={{ backgroundImage: `url(${location.photo})` }}>
        <div className=" flex justify-between p-2">
            <button className="bg-green-600 text-white py-2 px-4 rounded" onClick={handleEditLocation}> <PencilIcon className="h-5 w-5 " /> </button>
            <button className="bg-red-700 text-white py-2 px-4 rounded" onClick={handleDeleteLocation}> <TrashIcon className="h-5 w-5 " /> </button>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default MyLocation;
