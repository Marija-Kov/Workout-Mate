import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'

function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Navbar />
    <div className="pages">
      <Routes>
         <Route
        path="/"
        element={<LandingPage/>}/>
        <Route path="/login" element={<LogIn />} /> 
        <Route path="/signup" element={<SignUp />} />   
        <Route
        path="/home"
        element={<Home />}
        />
      </Routes>
    </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
