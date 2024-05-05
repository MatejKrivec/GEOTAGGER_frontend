import '../assets/styles/InitPage.css';

const InitPage = () => {
  return (
    <div className='container mx-auto my-4'>
      <div className="headerContainer ">
          <div className='logoContainer'>
            <img src="src\assets\images\geotagger_logo.PNG" alt="logo" />
          </div>
          <div className='SignIN-SignUP-container flex items-center'>
            <button className=' hover:bg-green-400 hover:text-white text-black font-bold py-2 px-4 rounded mr-2'>Sign in</button>
            <span className='mr-2'>or</span>
            <button className=' hover:bg-green-400 hover:text-white text-black font-bold py-2 px-4 rounded'>Sign up</button>
          </div>
        </div>
        <div className='flex'>
          <div className='w-3/10'>
            <div className='ContentContainer flex flex-col justify-center items-start'>
              <h1 className='text-green-400 text-4xl'>Explore the world with Geotagger!</h1>
              <p className="text-lg">Geotagger is a website that allows you to post pictures and tag them on the map. Other users can then try to locate them via Google Maps.</p>
              <button className='bg-green-400 hover:text-white font-bold py-2 px-4 rounded mt-4'>Sign up</button>
            </div>
          </div>
          <div className=' w-7/10'>
            <div className='ImageContainer'>
              <img src="src/assets/images/background-world-map 1.png" alt="map image" />
            </div>
          </div>
        </div>


        <div className='flex flex-col justify-center items-center'>
          <h2 className='text-green-400 text-3xl text-center'>Try yourself at Geotagger!</h2>
          <p className="text-center">Try to guess the location of the image by selecting a position on the map. When you guess it, it gives you the error distance.</p>
        </div>

      <div className="imageContainer text-center">
          <img src="src\assets\images\lockedP_image.PNG" alt="" />
      </div>
      <div className=' text-center'>
        <button className='bg-green-400 hover:text-white font-bold py-2 px-4 rounded mt-4'>Sign up</button>
      </div>


      <footer className=' bg-green-400'>
        <div className=' flex justify-between'>
          <h4>Geotagger</h4>
          <p>All Rights Reserved | skillupmentor.com</p>
        </div>
      </footer>

    </div>
   
  )
}

export default InitPage
