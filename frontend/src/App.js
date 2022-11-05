import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
    <BrowserRouter>
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
