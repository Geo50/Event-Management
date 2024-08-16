import { Navbar, Container, Offcanvas, Nav, Button, ToastBody } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import secureLocalStorage from "react-secure-storage";
import { key } from "../../App"; // Ensure this is correctly defined in your App file
import { useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";

const NavbarComponent: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navigate = useNavigate();

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
        // if (decodedToken.exp < currentTime) {
        //   toast.error("Your session has expired. Please log in again.");
        //   navigate("/homepage");
        //   return null;
        // }
       
        return userId;
      } catch (error) {
        toast.error("Failed to decode token.");
        return null;
      }
    }
    return null;
  };

  const userId = decodeToken();

  const destroyToken = useCallback(() => {
    if (!isLoggedIn) return; // Prevent multiple calls if already logged out
  
    secureLocalStorage.clear();
    setIsLoggedIn(false);
    setUsername("");
    
    // Show toast only once
  
    // Navigate after a short delay
    setTimeout(() => {
      navigate("/homepage");
    }, 1000);
  }, [navigate, isLoggedIn]);
  
  useEffect(() => {
    let isMounted = true;
  
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const result = await axios.post(`https://localhost:7273/api/User/GetUserById?userId=${userId}`, {
            userId: userId,
          });
          if (isMounted) {
            setUsername(result.data.userName);
            setIsLoggedIn(true);
          }
        } catch (error: any) {
          if (isMounted) {
            setIsLoggedIn(false);
            setUsername("");
          }
        }
      } else {
        if (isMounted) {
          setIsLoggedIn(false);
          setUsername("");
        }
      }
    };
  
    fetchUserDetails();
  
    return () => {
      isMounted = false;
    };
  }, [userId]);


  return (
    <div>
      <Navbar collapseOnSelect expand="md" id={classes.navContainer}>
        <Container fluid>
          <Navbar.Brand className={`user-select-none ${classes.navbarBrand}`}>Connexus</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement="end"
            className={classes.navbarBurger}
            >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>Connexus</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end gap-5 flex-grow-1 pe-3 align-items-center">               
                <Link to="/homepage" className={classes.navbarLink}>
                  Homepage
                </Link>
                {isLoggedIn ? (
                  <Fragment>
                    <div>
                    <Link to="/profile" className={classes.navbarLink}>
                      Hello, <p className={classes.highlight}>{username}</p>
                    </Link>
                    </div>
                    <div>
                    <Link to="/homepage" className={classes.navbarLink}>
                      <Button onClick={destroyToken} className={classes.logoutButton}>
                        Logout
                      </Button>
                    </Link>
                    </div>
                    </Fragment>                  
                ) : (
                  <Link to="/login" className={classes.navbarLink}>
                    <p className={classes.highlight}>Login Now</p>
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
