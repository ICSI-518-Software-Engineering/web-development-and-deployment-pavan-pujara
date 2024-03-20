import "./App.css";
import React, { useState } from "react";
import { Container, Navbar, Nav, Image, Button, FormControl } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import profilePic from "./pp.jpg"; 
import navbarIcon from "./pp.png"; 
import AdditionPage from "./Addition.js"; 
import Api from './Api';
import Inventory from './Inventory';

function App() {
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

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand className="navbar-brand">
          <Link to="/">
            <img src={navbarIcon} alt="Icon" width='50px' style={{ margin: '10px' }} />
          </Link>
        </Navbar.Brand>
        <Nav className="mr-auto" style={{ marginRight: '10px' }}>
          <Link to="/" className="nav-link">Profile</Link>
          <Link to="/addition" className="nav-link">Addition</Link>
          <Link to="/api" className="nav-link">API</Link>
          <Link to="/inventory" className="nav-link">Inventory</Link>
        </Nav>
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
      </Routes>
    </div>
  );
}

export default App;
