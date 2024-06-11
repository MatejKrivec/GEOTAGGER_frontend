import '../assets/styles/InitPage.css';
import { useNavigate } from 'react-router-dom';
import mapImage from '../assets/images/background-world-map 1.png';
import logoImage from  '../assets/images/geotagger_logo.png';
import PresentationImage from '../assets/images/lockedP_image.png'

const InitPage = () => {

  const navigate = useNavigate();

  const SignInClick = () => {
    navigate("/Signin")
  }
  const SignUpClick = () => {
    navigate("/Signup")
  }

  return (
        <div className='flex flex-col min-h-screen w-full'>
          <div className='Content mx-4 md:mx-10 mt-5'>
            <div className="headerContainer mb-10 flex flex-col md:flex-row items-center justify-between">
              <div className='logoContainer mb-4 md:mb-0'>
                <img src={logoImage} alt="logo" />
              </div>
              <div className='SignIN-SignUP-container flex items-center'>
                <button className='hover:bg-green-400 hover:text-white text-black font-bold py-2 px-4 rounded mr-2' onClick={SignInClick}>Sign in</button>
                <span className='mr-2'>or</span>
                <button className='hover:bg-green-400 hover:text-white text-black font-bold py-2 px-4 rounded' onClick={SignUpClick}>Sign up</button>
              </div>
            </div>
                  
            <div className='flex flex-col md:flex-row'>
            <div className='w-full md:w-1/4 mb-4 md:mb-0'>
              <div className='ContentContainer flex flex-col justify-center items-center md:items-start text-center md:text-left'>
                <h1 className='text-green-400 text-3xl md:text-4xl mb-5'>Explore the world with Geotagger!</h1>
                <p className="text-base md:text-lg mb-2">Geotagger is a website that allows you to post pictures and tag them on the map. Other users can then try to locate them via Google Maps.</p>
                <button className='bg-green-400 text-white font-bold rounded-2xl py-2 px-4 mt-4' onClick={SignUpClick}>Sign up</button>
              </div>
            </div>
              <div className='w-full md:w-3/4 flex justify-center md:justify-end'>
                <div className='ImageContainer'>
                  <img src={mapImage} alt="map image" className='w-full'/>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center items-center text-center'>
              <h2 className='text-green-400 text-2xl md:text-3xl mb-5'>Try yourself at Geotagger!</h2>
              <p className="mb-10">Try to guess the location of the image by selecting a position on the map. When you guess it, it gives you the error distance.</p>
            </div>

            <div className="imageContainer flex justify-center items-center">
              <img className='align-middle w-full md:w-auto' src={PresentationImage} alt="" />
            </div>
            
            <div className='text-center mb-20'>
              <button className='bg-green-400 w-full md:w-auto rounded-2xl text-white font-bold py-2 px-4 mt-4' onClick={SignUpClick}>Sign up</button>
            </div>
          </div>

          <footer className='bg-green-400 mt-auto'>
            <div className='flex flex-col md:flex-row justify-between text-white container mx-auto py-4 px-4'>
              <h4>Geotagger</h4>
              <p>All Rights Reserved | skillupmentor.com</p>
            </div>
          </footer>
        </div>

   
  )
}

export default InitPage
