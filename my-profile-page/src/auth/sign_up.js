import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../img/pp.png';
import './css/sign-up.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getIsAuthenticated = useCallback(async () => {
    try {
        const res = await axios.get(process.env.REACT_APP_API_URI+"/getUserData", { withCredentials: true });
        console.log(res);
        window.location.href = '/';
        navigate('/');
    } catch (error) {
        console.log(error);
    }
}, [navigate]);

useEffect(() => {
    getIsAuthenticated();
}, [getIsAuthenticated]);


  const validateUsername = (username) => {
    return /^[a-zA-Z0-9_]+$/.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateUsername(username)) {
      setError('Username can only contain letters, numbers, and underscores "_".');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username.toLowerCase());
      formData.append('password', password);
      formData.append('avatar', avatar);

      const response = await axios.post(process.env.REACT_APP_API_URI+'/sign_up', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true // Ensure cookies are sent with the request to handle session automatically
      });
      
      // Redirect to the home page or dashboard on successful sign up
      if (response.status === 201) {
        navigate('/'); // Redirect user to home page after successful sign up and automatic login
      } else {
        throw new Error('Signup failed'); // Throw if status code is not 201, indicating unsuccessful signup
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleLogin = () => {
    navigate('/login'); // Redirect to sign-up page
};
  return (
    <div className="login-container">
      <img src={Logo} alt="Logo" className="logo" />
      <h2>Sign Up</h2>
      <h5>and get one step closer to getting connected with me. :)</h5>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Avatar</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
        <button type="submit" className="login-button btn btn-success" disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <button onClick={handleLogin} className="login-button btn btn-info" disabled={isLoading}>
                Already A user.
                </button>
      </form>
    </div>
  );
};

export default SignUp;
