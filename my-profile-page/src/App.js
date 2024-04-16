import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, Image, Button, FormControl } from "react-bootstrap";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import profilePic from "./img/pp.jpg"; 
import navbarIcon from "./img/pp.png"; 
import AdditionPage from "./Addition.js"; 
import Api from './Api';
import Inventory from './Inventory';
import Signup from './sign_up.js';
import Login from './login.js';
import axios from 'axios';
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Pavan Pujara");
  const [description, setDescription] = useState("Hey, How yo doin? ;-)");
  const [tempName, setTempName] = useState(name);
  const [tempDescription, setTempDescription] = useState(description);
  const [user, setUser] = useState({ username: "", avatar: navbarIcon }); // Default user data

  useEffect(() => {
    // Function to check if the user is authenticated, but only when the user navigates to the root URL.
    if (location.pathname === '/') {
      const checkAuth = async () => {
        try {
          const response = await axios.get(' /getUserData', { withCredentials: true });
          if (response.data.username) {
            setIsLoggedIn(true);
            setUser({ username: response.data.username, avatar: response.data.avatar || navbarIcon });
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Authentication check failed', error);
          setIsLoggedIn(false);
        }
      };
      checkAuth();
    }
  }, [location.pathname]); // Dependency on location.pathname

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setName(tempName);
    setDescription(tempDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(name);
    setTempDescription(description);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(' /logout', {}, { withCredentials: true });
      if (response.status === 200) {
        setIsLoggedIn(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" className="py-2 shadow-sm"> {/* Added shadow for depth and increased padding */}
      <Navbar.Brand>
        <Link to="/">
          <img src={navbarIcon} alt="Icon" style={{ width: '40px' }} /> {/* Reduced size for aesthetics */}
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Ensures navbar is responsive */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link to="/" className="nav-link">Profile</Link>
          <Link to="/addition" className="nav-link">Addition</Link>
          <Link to="/api" className="nav-link">API</Link>
          <Link to="/inventory" className="nav-link">Inventory</Link>
        </Nav>
        {isLoggedIn ? (
          <Nav className="ml-auto align-items-center"> {/* Added alignment for items */}
            <span className="nav-link">Welcome, {user.username}</span>
            <Image className=" m-2" src={`data:image/jpeg;base64,${user.avatar}`|| navbarIcon} roundedCircle style={{ width: '40px', height: '40px' }} />
            <Button variant="outline-danger" className="ml-2" onClick={handleLogout}>Logout</Button>
          </Nav>
        ) : (
          <Nav className="ml-auto">
            <Link to="/login" className="nav-link">
              <Button variant="outline-primary">Login</Button>
            </Link>
            <Link to="/sign-up" className="nav-link">
              <Button variant="outline-secondary">Sign Up</Button>
            </Link>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>

      <Routes>
        <Route exact path="/" element={
          <Container className="mt-5 d-flex profile-container">
            <Image src={profilePic} className="profile-pic" />
            <div className="profile-details">
              {isEditing ? (
                <>
                  <FormControl
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="name-input"
                  />
                  <FormControl
                    as="textarea"
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    className="description-textarea mt-2"
                  />
                  <Button
                    variant="success"
                    onClick={handleSave}
                    className="save-btn mr-2"
                  >
                    Save
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleCancel}
                    className="cancel-btn"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <h5 className="name-display">
                    {name}{" "}
                    <i
                      className="bi bi-pencil-square edit-icon"
                      onClick={handleEdit}
                    ></i>
                  </h5>
                  <p className="description-display">
                    {description}{" "}
                    <i
                      className="bi bi-pencil-square edit-icon"
                      onClick={handleEdit}
                    ></i>
                  </p>
                </>
              )}
            </div>
          </Container>
        }/>
        <Route path="/addition" element={<AdditionPage />} />
        <Route path="/api" element={<Api />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
