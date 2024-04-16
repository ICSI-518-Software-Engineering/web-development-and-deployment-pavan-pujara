import React, { useState, useEffect } from 'react';
import { Image, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './Profile.css';

// Move constant outside to avoid re-declaration on each render
const defaultLogo = require('./img/pp.png'); // Use require if importing outside component

const Profile = () => {
    const [user, setUser] = useState({ username: 'Loading...', avatar: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/getUserData', { withCredentials: true });
                if (response.data) {
                    setUser(prevUser => ({
                        username: response.data.username,
                        avatar: response.data.avatar || defaultLogo
                    }));
                    if(user.avatar === ''){
                    const logoclass = 'logo';
                       }
                }
            } catch (error) {
                console.error('Error fetching user data', error);
                setUser(prevUser => ({ ...prevUser, avatar: defaultLogo })); // Functional update to avoid dependency
            }
        };
        fetchData();
    }, []); // No dependency needed if they are constants

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Row>
                <Col className="text-center">
                    <div className="profile-image-container">
                        <Image src={user.avatar || defaultLogo} alt="Profile" className={`profile-image ${!user.avatar ? 'logo' : ''}`} />
                    </div>
                    <h1 className="profile-username">{user.username}</h1>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
