
import React, { useEffect } from 'react'

import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { axiosInstance } from './lib/axios';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
const App = () => {
  
  const {authUser,checkAuth,isCheckingAuth, onlineUsers} = useAuthStore()
  const {theme}= useThemeStore()

  console.log("Auth User (full):", authUser);
console.log("Auth User ID:", authUser?._id || "No user ID");
console.log("Online Users:", onlineUsers.length > 0 ? onlineUsers : "No online users");

  
  useEffect(() => {
    checkAuth()
  }, [checkAuth]);
  console.log("Auth User:", authUser);
  console.log({authUser});

  if(isCheckingAuth && !authUser){ 
    return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  );
  }
  return (
    <div data-theme={theme}>
    <Navbar/> 
    <Routes>
        <Route path='/' element={authUser? <HomePage /> : <Navigate to="/login"/>} />
        <Route path='/signup' element={!authUser? <SignUpPage />: <Navigate to="/"/>} />
        <Route path='/login' element={!authUser? <LoginPage />: <Navigate to="/"/> } />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser? <ProfilePage />:<Navigate to="/login"/> } />   
        </Routes>

        <Toaster
  position="top-center"
  reverseOrder={false}
/>
    </div>
  )
}

export default App