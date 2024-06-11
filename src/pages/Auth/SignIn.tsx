import { useEffect } from 'react';
import '../../assets/styles/AuthPages.css';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoginForm from '../../assets/Interfaces/LogInForm';

//import logoImage from  '../../assets/images/geotagger_logo.png';
import mapDecorationImage from '../../assets/images/image 1.png'
import GoogleLogo from '../../assets/images/google-logo.jpg'
import fbLogo from '../../assets/images/fb_logo.png'



const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(1, 'Password must be at least 1 character').required('Password is required'),
});


const SignIn = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const handleToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token !== null) {
        const valid = await fetch('http://localhost:3000/auth/verify-token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!valid.ok) {
          throw new Error('Failed to verify token');
        }

        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60000);

        Cookies.set('token', token, {
          expires: oneHourLater,
          secure: true,
          sameSite: 'None'
        });

        try {
          const response = await fetch('http://localhost:3000/auth/protected', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Wrong username or password');
          }

          const responseData = await response.json();
          navigate('/' + responseData.route);

        } catch (error) {
          console.error('Error authenticating:', error);
          toast.error((error as Error).message + " Error authenticating");
        }
      } else {
        console.error('No token found in the URL query parameters.');
      }
    };

    handleToken();
  }, [navigate]);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }

      const { token } = await response.json();

      const verifyResponse = await fetch('http://localhost:3000/auth/verify-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!verifyResponse.ok) {
        throw new Error('Invalid token');
      }

      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60000);

      Cookies.set('token', token, {
        expires: oneHourLater,
        secure: true,
        sameSite: 'None'
      });

      try {
        const response = await fetch('http://localhost:3000/auth/protected', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Wrong username or password');
        }

        localStorage.setItem('activeTab', 'homeLanding');

        const responseData = await response.json();
        navigate('/' + responseData.route);

      } catch (error) {
        console.error('Error authenticating:', error);
        toast.error((error as Error).message);
      }



    } catch (error) {
      console.error('Error logging in:', error);
      toast.error((error as Error).message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/Oauth/google';
  };

  return (
    <div className='flex flex-col md:flex-row w-full'>
      <div className='w-full md:w-[45%] mt-10 px-4'>
        <div className='flex flex-col justify-center items-center mb-5'>
          <img src='../../assets/images/geotagger_logo.png' alt="logo" className="w-32 h-auto mr-[21rem] mb-20" />
          <h1 className='text-4xl mb-2'>Sign in</h1>
          <p className='text-center'>Welcome back to Geotagger. We are glad that you are back.</p>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <form className='flex flex-col w-full max-w-md' onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Email</label>
            <input
              className='border rounded-lg px-2 py-1 mb-2 w-full'
              type="email"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            <label htmlFor="password">Password</label>
            <input
              className='border rounded-lg px-2 py-1 mb-1 w-full'
              type="password"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            <Link className='SignUpToLoginLink text-green-400 self-end mb-3 hover:text-blue-400' to="/ForgotPassword">Forgot password</Link>
            <button className='bg-green-400 text-white font-bold py-2 px-4 mb-2 w-full rounded-xl' type='submit'>Sign in</button>
          </form>
          <div className='flex flex-col w-full max-w-md'>
            <button className='border text-black font-bold py-2 px-4 mb-2 w-full rounded-xl flex justify-center items-center' onClick={handleGoogleLogin}>
              <img src={GoogleLogo} alt="googleLogo" className='w-8 bg-transparent mr-2' />
              Sign in with Google
            </button>
            <button className='bg-blue-400 text-white font-bold py-2 px-4 mb-2 w-full rounded-xl flex justify-center items-center'>
              <img src={fbLogo} alt="fbLogo" className='w-8 mr-2' />
              Sign in with Facebook
            </button>
            <div className="flex justify-between">
              <p>Do you want to create an account?</p>
              <Link className='SignUpToLoginLink text-green-400 hover:text-blue-400' to="/Signup">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
      <div className='hidden md:block w-full md:w-[55%]'>
        <img src={mapDecorationImage} alt="mapImg" className="w-full h-full object-cover" />
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
