import React, { useEffect } from 'react'

const Conformation = ({onClosee}: {onClosee: () => void}) => {
    
    useEffect(()=> {
       // console.log("aaaaaaa")
    })
    const handleCloseConf = () => {
        onClosee();
    }
    
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-md w-[496px]">
                <h1 className='text-3xl mb-3'>Information changed</h1>
                    <p className=' mb-3'>Your settings are saved.</p>
                    <div className=' flex justify-end'>
                        <button className=' text-green-400 hover:bg-green-400 hover:text-white mr-2 rounded-2xl p-5' onClick={handleCloseConf}>Close</button>
                    </div>
              </div>
          </div>
    )
}

export default Conformation
