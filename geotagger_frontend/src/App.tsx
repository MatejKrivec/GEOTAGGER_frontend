import './App.css'
import { BrowserRouter as Router, Route,Routes,  Navigate } from 'react-router-dom';
import InitPage from './pages/InitPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitPage />} />
      </Routes>
    </Router>
  )
}

export default App
