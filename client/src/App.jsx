import React, { useContext } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import { Toaster } from 'react-hot-toast';
import assets from './assets/assets';
import { AuthContext } from '../context/AuthContext';

const App = () => {
  const { authUser } = useContext(AuthContext);
  return (
    <div style={{ backgroundImage: `url(${assets.bgImage})` }} className="bg-cover bg-center bg-no-repeat min-h-screen">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <LandingPage />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App;
