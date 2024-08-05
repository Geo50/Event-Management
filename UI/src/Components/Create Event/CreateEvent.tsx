import { Button, Col, Container, ListGroup, Nav, Row } from "react-bootstrap";
import classes from "./CreateEvent.module.css";
import { useCallback, useEffect, useState } from "react";
import Winetable from "../../assets/Table-Background.jpg";

const CreateEvent: React.FC = () => {
  const [imageURL, setImageURL] = useState<string>("");
  const [view, setView] = useState<string>("details");

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const imageURL = URL.createObjectURL(file);
        setImageURL(imageURL);
      }
    },
    []
  );

  useEffect(() => {
    document.body.style.backgroundImage = `url(${Winetable})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.height = "100vh";
    document.body.style.overflow = "";
    document.body.style.backdropFilter = "blur(3px)";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleNavbarShow = (selectedKey: string | null) => {
    if (selectedKey) {
      setView(selectedKey);
    }
  };


  return (
    <Container fluid className={classes.container}>
      <Col xl={4} lg={6} md={8} sm={12} className={classes.backgroundContainer}>
        <Nav
          variant="tabs"
          activeKey={view}
          onSelect={handleNavbarShow}
          className="mb-5"
        >
          <Nav.Item>
            <Nav.Link eventKey="details" className={classes.navbarItem}>
              Event Details
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="tickets" className={classes.navbarItem}>
              Tickets
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {view === "details" && (
          <div>
            <h1 className={`${classes.title} display-4`}>Set Up Your Event</h1>
            <div className={classes.hiddenElement}>
              <input
                type="file"
                name="image_insertion"
                id="image_insertion"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
              />
            </div>
            <div className={classes.imageContainer}>
              {!imageURL && (
                <label
                  htmlFor="image_insertion"
                  className={`${classes.imageInputField}`}
                >
                  Choose your event picture
                </label>
              )}

              {imageURL && (
                <img
                  src={imageURL}
                  alt="Event"
                  className={classes.imagePreview}
                />
              )}
            </div>
            <div>
              <ListGroup className={classes.inputElementBox}>
                <ListGroup.Item className={classes.inputElementBox}>
                  <input
                    type="text"
                    placeholder="Enter event name"
                    className={classes.inputElements}
                  />
                </ListGroup.Item>
                <ListGroup.Item className={classes.inputElementBox}>
                  <input
                    type="text"
                    placeholder="Describe your event"
                    className={classes.inputElements}
                  />
                </ListGroup.Item>
                <ListGroup.Item className={classes.inputElementBox}>
                  <input
                    type="datetime-local"
                    className={classes.inputElements}
                  />
                </ListGroup.Item>
                <ListGroup.Item className={classes.inputElementBox}>
                  <input
                    type="text"
                    placeholder="Event Place"
                    className={classes.inputElements}
                  />
                </ListGroup.Item>
                <ListGroup.Item className={classes.inputElementBox}>
                  <input
                    type="text"
                    placeholder="Event Type (concert...)"
                    className={classes.inputElements}
                  />
                </ListGroup.Item>
                <ListGroup.Item className={classes.inputElementBox}>
                  <input
                    type="number"
                    placeholder="Event Attendees"
                    className={classes.inputElements}
                  />
                </ListGroup.Item>
              </ListGroup>
            </div>
          </div>
        )}
        {view === "tickets" && (
          <div>
            <h1 className={`${classes.title} display-4`}>
              Create Your Tickets
            </h1>
            <Button className={classes.addTicket} variant="danger">
              Add New Ticket
            </Button>
            <ListGroup className={classes.inputElementBox}>
              <ListGroup.Item className={classes.inputElementBox}>
                <input
                  type="text"
                  placeholder="Ticket Name"
                  className={classes.inputElements}
                />
              </ListGroup.Item>
              <ListGroup.Item className={classes.inputElementBox}>
                <input
                  type="number"
                  placeholder="Ticket Price"
                  className={classes.inputElements}
                />
              </ListGroup.Item>
            </ListGroup>
            <Button variant="danger" className="mb-3 mt-3">
              Create Ticket
            </Button>
            <h4 className={classes.text}>Tickets Numbers: ...</h4>
            {/* Additional ticket-related content */}
          </div>
        )}
      </Col>
    </Container>
  );
};

export default CreateEvent;
