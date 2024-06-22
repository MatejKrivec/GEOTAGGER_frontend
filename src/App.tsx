import './App.css'
import { BrowserRouter as Router, Route,Routes,  Navigate } from 'react-router-dom';
import InitPage from './pages/InitPage';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import HomePage from './pages/HomePage';
import Cookies from 'js-cookie';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import AdminHomePage from './pages/AdminHomePage';
import ErrorComponent from './pages/Error/ErrorComponent';
import { useEffect, useState } from 'react';




function App() {

  return (
    <Router>
      <ErrorComponent /> 
      <Routes>
        <Route path="/" element={<InitPage />} />
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />

        <Route element={<RouteGuard  />}>
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Admin" element={<AdminHomePage />} />
        </Route>

      </Routes>
    </Router>
  )
}

function RouteGuard() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get('token');

  useEffect(() => {
    const checkUserRole = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://geotagger.adaptable.app/decode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          throw new Error('Failed to decode token');
        }

        const userData = await response.json();
        const userId = userData.id;

        const userResponse = await fetch(`https://geotagger.adaptable.app/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user');
          console.log('Failed to fetch user');
        }

        const user = await userResponse.json();
        setRole(user.role);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/Signin" />;
  }

  if (role === 'admin') {
    return <AdminHomePage />;
  } else if (role === 'user') {
    return <HomePage />;
  } else {
    return <Navigate to="/Signin" />;
  }
}

export default App
