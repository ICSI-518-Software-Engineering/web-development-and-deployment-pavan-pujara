import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [userData, setUserData] = useState({ username: '', avatar: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_API_URI + "/getUserData", { withCredentials: true });
        setUserData({ username: res.data.username, avatar: res.data.avatar });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Your Profile Page</h5>
          <div className="d-flex align-items-center">
            <img
              src={`data:image/jpeg;base64,${userData.avatar}`}
              alt="Avatar"
              className="mr-3"
            />
            <span className="h4">Welcome, {userData.username}, hope you are having great day. :)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
