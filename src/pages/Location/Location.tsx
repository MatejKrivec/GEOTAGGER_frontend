import LocationInterface from "../../assets/Interfaces/Location"

  

const Location = ({location, onClick}: {location: LocationInterface | null, onClick: () => void}) => {

  return (
    <div onClick={onClick} className="cursor-pointer">
      <div className="relative h-[10rem] w-[15rem]">
      <div className="absolute inset-0 bg-cover bg-center " >
        <img className=' w-full h-full object-cover' src={location?.photo?.toString()} alt="LocationImage" />
      </div>
    </div>
    </div>
  )
}

export default Location
