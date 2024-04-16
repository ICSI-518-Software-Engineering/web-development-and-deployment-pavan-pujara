import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const RequireAuth = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/getUserData', { withCredentials: true });
        setIsLoggedIn(response.data.username ? true : false);
      } catch (error) {
        console.error('Authentication check failed', error);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
