import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Navbar />
    <div className="pages">
      <Routes>
         <Route
        path="/"
        element={<LandingPage/>}
        />
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
