import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import HomePage from "./components/HomePage.js";
import AdditionPage from "./components/Addition.js";
import Api from './components/Api';
import Inventory from './components/Inventory';
import Login from './auth/login.js';
import Profile from './auth/Profile';
import RequireAuth from './auth/RequireAuth';
import NavigationBar from './components/Navbar.js';
import './App.css'
import SignUp from './auth/sign_up.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: "", avatar: "" });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URI+'/getUserData', { withCredentials: true });
        if (response.data.username) {
          setIsLoggedIn(true);
          setUser({ username: response.data.username, avatar: response.data.avatar });
        } else {
          setIsLoggedIn(false);
          setUser({ username: "", avatar: "" });
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        setIsLoggedIn(false);
        setUser({ username: "", avatar: "" });
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_API_URI+'/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUser({ username: "", avatar: "" });
        window.location.href = '/login'; // Redirect to login page after logout
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  return (
    <Router>
      {isLoggedIn && <NavigationBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={user.username} avatar={user.avatar} />}
      <Routes>
        <Route exact path="/" element={<RequireAuth><HomePage/></RequireAuth>} />
        <Route path="/addition" element={<RequireAuth><AdditionPage /></RequireAuth>} />
        <Route path="/api" element={<RequireAuth><Api /></RequireAuth>} />
        <Route path="/inventory" element={<RequireAuth><Inventory /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
