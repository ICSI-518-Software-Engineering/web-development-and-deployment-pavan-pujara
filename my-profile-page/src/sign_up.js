import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from './img/pp.png';
import './sign-up.css';

const SignUp = () => { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateUsername = (username) => {
    return /^[a-zA-Z0-9_]+$/.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('avatar', avatar);

      const response = await axios.post('http://localhost:3001/sign_up', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Redirect to home page on successful sign up
      navigate('/home');
    } catch (err) {
      setError('Invalid username or username already exists');
    }
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  return (
    <div className="login-container">
      <img src={Logo} alt="Logo" className="logo" />
      <h2>Sign up</h2>
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
        <button type="submit" className="login-button">Welcome to my squad</button>
      </form>
    </div>
  );
};

export default SignUp; // Also changed here
