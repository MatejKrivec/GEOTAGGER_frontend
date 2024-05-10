import React, { useState } from 'react'
import Conformation from './Conformation'

const ChangeProfilePic = ({onClose, onConfirmClose}: {onClose: () => void; onConfirmClose: () => void}) => {

  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleClose = () => {
    onClose();
  }

  const handleSubmit = () => {
    setShowConfirmation(!showConfirmation)
  }

  const handleConformationClose = () => {
    onConfirmClose();
  }

  return (
    <>
      { showConfirmation ? (<Conformation onClosee={handleConformationClose}/>):
      (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-md w-[496px]">
              <h1 className='text-3xl mb-3'>
                  Profile <span className="text-green-400">settings</span>
              </h1>
                  <p className=' mb-3'>Change your profile photo</p>
                <form className='flex flex-col w-full max-w-md'>

                  <div className=' flex flex-col justify-center items-center mb-5'>
                    <img className=' rounded-full h-auto w-[5rem] mb-2' src="src\assets\images\default_user_pic.jpg" alt="" />
                    <button className=' border text-green-400 rounded-lg p-2 w-[12rem]'>Change profile photo</button>
                  </div>


                  <div className=' flex justify-end'>
                      <button className=' text-green-400 hover:bg-green-400 hover:text-white mr-2 rounded-2xl p-5' onClick={handleClose} >Cancel</button>
                      <button className=' text-green-400 hover:bg-green-400 hover:text-white rounded-2xl p-5' onClick={handleSubmit}>Submit</button>
                  </div>

                </form>
            </div>
        </div>
      )}
    </>
  )
}

export default ChangeProfilePic
