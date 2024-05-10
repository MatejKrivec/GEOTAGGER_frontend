import React from 'react'

const Landing = () => {
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
        <div className=' flex flex-col items-center justify-center'>
            uploads list...
            <button className=' mt-5 rounded-lg  border border-green-400 text-green-400 w-[6rem]'>Load more</button>
        </div>
        
      </div>
    </div>
  )
}

export default Landing
