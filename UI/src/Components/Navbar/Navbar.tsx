import { Navbar, Form, Container, Offcanvas, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";

function OffcanvasExample() {
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

                {/* <NavDropdown
                    title="Dropdown"
                    id={`offcanvasNavbarDropdown-expand-sm`}
                  >
                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action4">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Something else here
                    </NavDropdown.Item>
                  </NavDropdown> */}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
}

export default OffcanvasExample;
