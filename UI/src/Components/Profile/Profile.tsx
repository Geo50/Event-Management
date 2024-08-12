import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import classes from "./Profile.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { key } from "../../App";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import EventDetailsModal from "../Homepage/EventDetailsModal";

type eventData = {
  eventId: number;
  eventName: string;
  eventImage: string;
  eventDate: string;
  eventPlace: string;
  eventType: string;
};

const Profile: React.FC = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [userValue, setUserValue] = useState<string>("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const [events, setEvents] = useState<eventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

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
          navigate("/homepage");
          return null;
        }
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
            UserId: userId,
          });
          setUsername(result.data.userName);
          setEmail(result.data.userEmail);
          setUserValue(result.data.userName); // Set the userValue for the input field
        } catch (error: any) {
          console.log(`Failed to get user details. Status code: ${error.response?.status}: ${error.message}`);
        }
      }
    };
    const token: any = getToken();
    const decodedToken: any = jwtDecode(token);
    const userId: number = parseInt(decodedToken?.unique_name, 10);
    const handleEventsGeneration = async () => {
      setLoading(true);
      try {
        const result = await axios.post(`https://localhost:7083/api/Event/GetEventsInProfile?UserId=${userId}`, {
          UserId: userId,
        });
        setEvents(result.data);
      } catch (error: any) {
        toast.error(`Failed to create event. Status code: ${error.response?.status}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
    handleEventsGeneration();
  }, []);

  const handleEdit = async () => {
    const token: any = getToken();
    const decodedToken: any = jwtDecode(token);
    const UserId: number = parseInt(decodedToken?.unique_name, 10);

    try {
      const response = await axios.post(`https://localhost:7273/api/User/UpdateUsername`, {
        UserId: UserId,
        UserName: userValue,
      });
      const result: string = response.data;
      setUsername(result);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const navigate = useNavigate()
  const handleButtonClick = () => {
    if (isEditing) {
      // Save mode
      setDisabled(true);
      handleEdit();
    } else {
      // Edit mode
      setDisabled(false);
    }
    setIsEditing(!isEditing); // Toggle between edit and save modes
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserValue(event.target.value); // Update userValue on input change
  };

  const handleCloseDetails = useCallback((): void => {
    setModalShow(false);
  }, []);

  const handleNavigation = (event: eventData) => {
    navigate("/view-tickets", {
      state: {
        eventId: event.eventId
      },
    });
  };

  return (
    <div className={`${classes.allContainer}`}>
      <ToastContainer />
      <Container className={classes.container}>
        <Row>
          <h1>Welcome, {username}!</h1>
          <br />
          <h1>Here are your account details</h1>
        </Row>
        <Row className={classes.rowClass}>
          <Col md={9} lg={9}>
            <input
              type="text"
              value={userValue}
              onChange={handleInputChange}
              placeholder={username}
              disabled={disabled}
              className={classes.inputElement}
              ref={usernameRef}
            />
          </Col>
          <Col>
            <Button className={classes.editButton} onClick={handleButtonClick}>
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Col>
        </Row>
        <Row className={classes.rowClass}>
          <Col md={9} lg={9}>
            <input type="email" placeholder={email} disabled={disabled} className={classes.inputElement} />
          </Col>
          <Col>
            <Button className={classes.editButton}>Edit</Button>
          </Col>
        </Row>
        <Row className={classes.rowClass}>
          <Col md={9} lg={9}>
            <input type="password" placeholder="*********" disabled={disabled} className={classes.inputElement} />
          </Col>
          <Col>
            <Button className={classes.editButton}>Edit</Button>
          </Col>
        </Row>
        {events.length > 0 ? (
          <div>
            <Row className={classes.eventContainer}>
              <h1>View your bookmarked events</h1>
            </Row>
            <div>
              {loading ? (
                <div className={classes.loader}>
                  <PuffLoader color="var(--registration-blue)" size={130} />
                </div>
              ) : (
                <Container fluid className={classes.eventsContainer}>
                  <Row>
                    <div className={classes.headerContainer}></div>
                  </Row>
                  <Row>
                    {events.map((event) => (
                      <Col key={event.eventId} xs={12} sm={6} lg={4}>
                        <Card className={classes.eventCard}>
                          <Card.Img
                            onClick={() => {
                              setModalShow(true);
                              setSelectedEventId(event.eventId);
                            }}
                            variant="top"
                            src={event.eventImage}
                            className={classes.imageElement}
                          />
                          <Card.Body>
                            <Card.Title className={classes.title}>Name: {event.eventName}</Card.Title>
                          </Card.Body>
                          <ListGroup className="list-group-flush">
                            <ListGroup.Item className={classes.eventInfo}>Date: {event.eventDate}</ListGroup.Item>
                            <ListGroup.Item className={classes.eventInfo}>Type: {event.eventType}</ListGroup.Item>
                            <ListGroup.Item className={classes.eventInfo}>Place: {event.eventPlace}</ListGroup.Item>
                            <ListGroup.Item><Button variant="outline-danger" onClick={() => {handleNavigation(event)}}>View Event Tickets</Button></ListGroup.Item>
                          </ListGroup>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <EventDetailsModal
                    visibility={modalShow}
                    handleClose={handleCloseDetails}
                    eventId={selectedEventId || 0}
                  />
                </Container>
              )}
            </div>
          </div>
        ) : (
          <h1>Oops, you haven't bookmarked any events yet...</h1>
        )}
      </Container>
    </div>
  );
};

export default Profile;
