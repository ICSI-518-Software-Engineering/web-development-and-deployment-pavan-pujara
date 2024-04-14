import React, { useState } from "react";
import { Container, Navbar, Nav, Image, Button, FormControl } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import profilePic from "./img/pp.jpg"; 
import navbarIcon from "./img/pp.png"; 
import AdditionPage from "./Addition.js"; 
import Api from './Api';
import Inventory from './Inventory';
import Signup from './sign_up.js';
import Login from './login.js';
import "./App.css";

function App() {
  // Assume isLoggedIn state indicates whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Pavan Pujara");
  const [description, setDescription] = useState("Hey, How yo doin? ;-)");
  const [tempName, setTempName] = useState(name);
  const [tempDescription, setTempDescription] = useState(description);

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

  const handleLogout = () => {
    // Perform logout actions here
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
  <Navbar.Brand className="navbar-brand">
    <Link to="/">
      <img src={navbarIcon} alt="Icon" width='50px' style={{ margin: '10px' }} />
    </Link>
  </Navbar.Brand>
  <Nav className="mr-auto" style={{ marginRight: 'auto' }}>
    <Link to="/" className="nav-link">Profile</Link>
    <Link to="/addition" className="nav-link">Addition</Link>
    <Link to="/api" className="nav-link">API</Link>
    <Link to="/inventory" className="nav-link">Inventory</Link>
  </Nav>
  {isLoggedIn ? (
    // If logged in, show user image and logout button on the right
    <Nav className="ml-auto">
      <Image src={profilePic} className="profile-pic" />
      <Button variant="danger" className="ml-2" onClick={handleLogout}>Logout</Button>
    </Nav>
  ) : (
    // If not logged in, show login and sign up buttons on the right
    <Nav className="ml-auto">
      <Link to="/login">
      <Button variant="primary" className="mr-2">Login</Button>
      </Link>
      <Link to="/sign-up">
        <Button variant="secondary">Sign Up</Button>
      </Link>
    </Nav>
  )}
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
