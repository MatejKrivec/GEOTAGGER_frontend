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




function App() {

  return (
    <Router>
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

  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to="/Signin" />;
  }

  return <>{<HomePage/>}</>;
}

export default App
