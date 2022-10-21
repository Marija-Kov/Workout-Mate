import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
// import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'
// import SignUp from './components/SignUp'
// import LogIn from './components/LogIn'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Navbar />
    <div className="pages">
      <Routes>
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} />   
        <Route
        path="/"
        element={<Home />}
        />
      </Routes>
    </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
