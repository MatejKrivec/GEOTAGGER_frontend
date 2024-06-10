import { toast, ToastContainer } from 'react-toastify'; 
import { useGetLocationByIdQuery } from '../../services/api';
import GuessInterface from '../../assets/Interfaces/Guess';



const BestGuessLocation = ({guess}: {guess: GuessInterface }) => {

    //Tole je blo pred RTK Query
   /* const[location, setLocation] = useState<LocationInterface>();

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
        } catch (error: any) {
            console.error('Error fetching user data:', error);
            //toast.error('Error fetching user data:', error)
        }
    }*/


    const { data: location, error, isLoading } = useGetLocationByIdQuery(guess.LocationID);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    console.error('Error fetching location data:', error);
    toast.error('Error fetching location data');
    return <div>Error loading location data</div>;
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
      <ToastContainer></ToastContainer>
    </div>
  )
}

export default BestGuessLocation
