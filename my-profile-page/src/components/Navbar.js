import React from 'react';
import { Navbar, Nav, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import navbarIcon from "../img/pp.png";

function NavigationBar({ isLoggedIn, handleLogout, username, avatar }) {
  return (
    <Navbar bg="light" expand="lg" className="py-2 shadow-sm">
      <Navbar.Brand>
        <Link to="/">
          <img src={navbarIcon} alt="Icon" style={{ width: '40px' }} />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link to="/" className="nav-link">Profile</Link>
          <Link to="/addition" className="nav-link">Addition</Link>
          <Link to="/api" className="nav-link">API</Link>
          <Link to="/inventory" className="nav-link">Inventory</Link>
        </Nav>
        {isLoggedIn ? (
          <Nav className="ml-auto align-items-center">
            <Link to="/profile" className="nav-link">User Profile</Link>
            <span className="nav-link">Welcome, {username}</span>
            <Image className="m-2" src={`data:image/jpeg;base64,${avatar}` || navbarIcon} roundedCircle style={{ width: '40px', height: '40px' }} />
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
  );
}

export default NavigationBar;
