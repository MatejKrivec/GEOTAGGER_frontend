import '../assets/styles/InitPage.css';
import { useNavigate } from 'react-router-dom';

const InitPage = () => {

  const navigate = useNavigate();

  const SignInClick = () => {
    navigate("/Signin")
  }
  const SignUpClick = () => {
    navigate("/Signup")
  }

  return (
    <div className=' flex flex-col min-h-screen   w-full'>
      <div className='Content mx-10 mt-5 '>
        <div className="headerContainer mb-10">
          <div className='logoContainer'>
            <img src="src\assets\images\geotagger_logo.PNG" alt="logo" />
          </div>
          <div className='SignIN-SignUP-container flex items-center'>
            <button className='hover:bg-green-400 hover:text-white text-black font-bold py-2 px-4 rounded mr-2' onClick={SignInClick}>Sign in</button>
            <span className='mr-2'>or</span>
            <button className='hover:bg-green-400 hover:text-white text-black font-bold py-2 px-4 rounded' onClick={SignUpClick}>Sign up</button>
          </div>
        </div>
              
        <div className='flex'>
          <div className=' w-[25%]'>
            <div className='ContentContainer flex flex-col justify-center items-start'>
              <h1 className='text-green-400 text-4xl mb-5'>Explore the world with Geotagger!</h1>
              <p className="text-lg mb-2">Geotagger is a website that allows you to post pictures and tag them on the map. Other users can then try to locate them via Google Maps.</p>
              <button className='bg-green-400 text-white font-bold rounded-2xl py-2 px-4 mt-4' onClick={SignUpClick}>Sign up</button>
            </div>
          </div>
          <div className='w-[75%] flex justify-end'>
            <div className='ImageContainer'>
              <img  src="src/assets/images/background-world-map 1.png" alt="map image" />
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-center items-center'>
          <h2 className='text-green-400 text-3xl text-center mb-5'>Try yourself at Geotagger!</h2>
          <p className="text-center mb-10">Try to guess the location of the image by selecting a position on the map. When you guess it, it gives you the error distance.</p>
        </div>

        <div className="imageContainer flex justify-center items-center">
          <img className='align-middle' src="src\assets\images\lockedP_image.PNG" alt="" />
        </div>
        
        <div className='text-center mb-20'>
          <button className='bg-green-400 w-100 rounded-2xl text-white font-bold py-2 px-4 mt-4' onClick={SignUpClick}>Sign up</button>
        </div>
      </div>
      

      <footer className='bg-green-400 mt-auto '>
        <div className='flex justify-between text-white container mx-auto py-4 px-4 max-w-full w-full'>
          <h4>Geotagger</h4>
          <p>All Rights Reserved | skillupmentor.com</p>
        </div>
      </footer>
    </div>

   
  )
}

export default InitPage
