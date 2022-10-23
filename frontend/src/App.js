import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
// import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'
// import SignUp from './components/SignUp'
// import LogIn from './components/LogIn'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
    <BrowserRouter>
    <Navbar />
    <div className="pages">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} /> 
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />   
        <Route path="/" element={!user ? <Navigate to="/login" /> : <Home />} />
      </Routes>
    </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
