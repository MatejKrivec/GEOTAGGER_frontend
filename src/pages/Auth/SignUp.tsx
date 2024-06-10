import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SignUpForm from '../../assets/Interfaces/SignUpForm';

// Define the validation schema using Yup
const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  firstname: yup.string().required('First name is required'),
  surname: yup.string().required('Last name is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  repeatPassword: yup.string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Repeat password is required')
});



const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    const username = `${data.firstname} ${data.surname}`;

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: data.email,
          password: data.password
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      window.location.href = '/Signin';
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error((error instanceof Error) ? error.message : 'Error creating user');
    }
  };

  return (
    <div className='flex flex-col md:flex-row w-full'>
      <div className='w-full md:w-[45%] mt-10 px-4'>
        <div className='flex flex-col justify-center items-center mb-5'>
          <img src="src/assets/images/geotagger_logo.PNG" alt="logo" className="w-32 h-auto mr-[21rem] mb-20" />
          <h1 className='text-4xl mb-2'>Sign up</h1>
          <p className='text-center mb-2'>Your name will appear on posts and your public profile.</p>
          <img src="src/assets/images/default_user_pic.jpg" alt="DefaultUserPic" className='w-[4rem] rounded-full' />
        </div>
        <div className='flex justify-center'>
          <form className='flex flex-col w-full max-w-md' onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Email</label>
            <input
              className='border rounded-lg px-2 py-1 mb-2 w-full'
              id='email'
              type="email"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            
            <div className='flex justify-between'>
              <div className='mr-2 w-full'>
                <label htmlFor="firstname">First name</label>
                <input
                  className='border rounded-lg px-2 py-1 mb-2 w-full'
                  id='firstname'
                  type="text"
                  {...register('firstname')}
                />
                {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
              </div>
              <div className='ml-2 w-full'>
                <label htmlFor="surname">Last name</label>
                <input
                  className='border rounded-lg px-2 py-1 mb-2 w-full'
                  id='surname'
                  type="text"
                  {...register('surname')}
                />
                {errors.surname && <p className="text-red-500">{errors.surname.message}</p>}
              </div>
            </div>
            
            <label htmlFor="password">Password</label>
            <input
              className='border rounded-lg px-2 py-1 mb-2 w-full'
              id='password'
              type="password"
              {...register('password')}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            
            <label htmlFor="repeatPassword">Repeat password</label>
            <input
              className='border rounded-lg px-2 py-1 mb-2 w-full'
              id='repeatPassword'
              type="password"
              {...register('repeatPassword')}
            />
            {errors.repeatPassword && <p className="text-red-500">{errors.repeatPassword.message}</p>}
            
            <button className='bg-green-400 text-white font-bold py-2 px-4 mb-2 w-full rounded-xl' type='submit'>Sign up</button>
            
            <div className="flex justify-between">
              <p>Already have an account?</p>
              <Link className='SignUpToLoginLink text-green-400 hover:text-blue-400' to="/Signin">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
      <div className='hidden md:block w-full md:w-[55%]'>
        <img src="src/assets/images/image 1.png" alt="mapImg" className="w-full h-full object-cover" />
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
