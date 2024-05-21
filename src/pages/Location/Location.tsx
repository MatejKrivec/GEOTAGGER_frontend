import React from 'react'

interface LocationInterface {
    id: number,
    userID: number,
    name: String,
    location: String,
    photo: String,
    date: Date,
  }
  

const Location = ({location}: {location: LocationInterface | null}) => {

  return (
    <div>
      <div className="relative h-[10rem] w-[15rem]">
      <div className="absolute inset-0 bg-cover bg-center " >
        <img className=' w-full h-full object-cover' src={location?.photo?.toString()} alt="LocationImage" />
      </div>
    </div>
    </div>
  )
}

export default Location
