
import { Link, Route, Routes } from "react-router-dom"; // Remove 'BrowserRouter as Router', 'Switch'
import "bootstrap/dist/css/bootstrap.min.css";
import profilePic from "./pp.jpg"; // Ensure this path is correct
import navbarIcon from "./pp.png"; // Ensure this path is correct


function App() {
 
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
        </Nav>
      </Navbar>
    </div>
  );
}

export default App;
