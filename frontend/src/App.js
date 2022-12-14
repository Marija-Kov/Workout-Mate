import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"))

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
        <Route path="reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
    </BrowserRouter>
    </div>
  );
}

export default App;
