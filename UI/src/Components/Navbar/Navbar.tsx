import { Navbar, Container, Offcanvas, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";
import secureLocalStorage from "react-secure-storage";
import { key } from "../../App"; // Ensure this is correctly defined in your App file
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const NavbarComponent: React.FC = () => {
  const [username, setUsername] = useState<string>("");

  const getToken = () => {
    const token = secureLocalStorage.getItem(key);
    return typeof token === "string" ? token : null;
  };

 const decodeToken = () => {
    const token = getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId: number = parseInt(decodedToken?.unique_name, 10);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          toast.error("Your session has expired. Please log in again.");
          return null;
        }

        console.log(decodedToken);
        console.log(`User ID: ${userId}`);
        return userId;
      } catch (error) {
        toast.error("Failed to decode token.");
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = decodeToken();
      if (userId) {
        try {
          const result = await axios.post(`https://localhost:7273/api/User/GetUserById?userId=${userId}`, {
            userId: userId,
          });
          setUsername(result.data.userName);
          console.log(result.data.userName);
        } catch (error: any) {
          console.log(`Failed to get user details. Status code: ${error.response?.status}: ${error.message}`);
        }
      }
    };

    fetchUserDetails();
  }, []);
  

  return (
    <div>
      <Navbar collapseOnSelect expand="md" id={classes.navContainer}>
        <Container fluid>
          <Navbar.Brand className={`user-select-none ${classes.navbarBrand}`}>Organiser Events</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement="end"
            className={classes.navbarBurger}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>Organiser Events</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end gap-5 flex-grow-1 pe-3">
                <Link to="/registration" className={classes.navbarLink}>
                  Register
                </Link>

                <Link to="/login" className={classes.navbarLink}>
                  Login
                </Link>

                <Link to="/homepage" className={classes.navbarLink}>
                  Homepage
                </Link>

                <Link to="/create-event" className={classes.navbarLink}>
                  Create-Event
                </Link>
                {username !== "" ? (
                  <Link to="/homepage" className={classes.navbarLink}>
                    Hello, <p className={classes.highlight}>{username}</p>
                  </Link>
                ) : (
                  <Link to="/login" className={classes.navbarLink}>
                    Want to join us? <p className={classes.highlight}>Login Now</p>
                  </Link>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
