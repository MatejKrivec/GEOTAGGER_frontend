import Cookies from 'js-cookie';

const Logout = ({onClose}:{onClose: () => void}) => {

    const handleCloseLogout = () => {
        onClose();
    }

    const handleLogout = () => {
        Cookies.remove('token');;

        window.location.href = '/Signin';
    }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-4 md:p-6 rounded-md max-w-[496px]">
        <h1 className='text-2xl md:text-3xl mb-3'>Are you sure you want to log out?</h1>
        <div className='flex justify-end'>
        <button className='text-green-400 hover:bg-green-400 hover:text-white mr-2 rounded-2xl p-4 md:p-5' onClick={handleCloseLogout}>No</button>
        <button className='text-green-400 hover:bg-green-400 hover:text-white rounded-2xl p-4 md:p-5' onClick={handleLogout}>Yes</button>
        </div>
    </div>
    </div>

  )
}

export default Logout
