import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { key } from "../../App";
import EventDetailsModal from "../Event Details/EventDetailsModal";
import classes from "./Profile.module.css";

type eventData = {
  eventid: number;
  eventname: string;
  eventimage: string;
  eventdate: string;
  eventplace: string;
  eventtype: string;
  organiserName: string;
  organiser_Id: number;
  eventAttendeesLimit: number;
};

type boughtTicketsType = {
  eventName: string;
  eventDate: string;
  eventPlace: string;
  ticketId: number;
  ticketName: string;
  category: string;
  benefits: string;
};

const Profile: React.FC = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [userValue, setUserValue] = useState<string>("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const createTicketsButtonRef = useRef<HTMLButtonElement>(null);
  const viewTicketsButtonRef = useRef<HTMLButtonElement>(null);
  const [events, setEvents] = useState<eventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [boughtTicketsData, setBoughtTicketsData] = useState<boughtTicketsType[]>([]);

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

        return userId;
      } catch (error) {
        toast.error("Failed to decode token.");
        return null;
      }
    }
    return null;
  };

  const userId = decodeToken();

  const handleBoughtTickets = async () => {
    const response = await axios
      .get(`https://localhost:7083/api/Event/GetBoughtTickets?UserId=${userId}`)
      .then((response) => {
        setBoughtTicketsData(response.data);
      })
      .catch((error: any) => {
        toast.error("Error while fetching tickets data");
      });
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
          setUserValue(result.data.userName);
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
        console.log("Result data" + result.data[0]);

        const eventsWithUsernames = await Promise.all(
          result.data.map(async (event: eventData) => {
            console.log("EventId in map " + event);
            setSelectedEventId(event.eventid);
            const organiserResponse = await axios.get(
              `https://localhost:7083/api/Event/GetUsernameFromId?userid=${event.organiser_Id}`
            );
            return {
              ...event,
              organiserName: organiserResponse.data,
            };
          })
        );
        console.log(`This is the selected event id outside map ${selectedEventId}`);
        setEvents(eventsWithUsernames);
      } catch (error: any) {
        toast.error(`Failed to create event. Status code: ${error.response?.status}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
    handleEventsGeneration();
    handleBoughtTickets();
  }, []);

  useEffect(() => {
    events.forEach((event) => {
      userOrganizerDistinguisher(event);
    });
  }, [events]);

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
      toast.success("Successfully updated your username!");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const navigate = useNavigate();
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

  const handleViewTicketsNavigation = (event: eventData) => {
    console.log(`From navigation ${event.eventid}`);
    navigate("/view-tickets", {
      state: {
        eventid: event.eventid,
      },
    });
  };
  
  const handleCreateTicketNavigation = (event: eventData) => {
    navigate("/create-ticket", {
      state: {
        eventid: event.eventid,
      },
    });
  };

  const handleImageClick = (eventid: number) => {
    setModalShow(true);
    setSelectedEventId(eventid);
    console.log(selectedEventId); // Ensure eventId is correctly passed
    console.log(eventid);
  };
  const userOrganizerDistinguisher = (events: eventData) => {
    const organizer = events.organiser_Id;
    const user = decodeToken();
    if (organizer != user) {
      createTicketsButtonRef.current?.classList.add(classes.hiddenElement);
    } else {
      viewTicketsButtonRef.current?.classList.add(classes.hiddenElement);
    }
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
                    {events.map((event) => {
                      const isUserOrganizer = event.organiser_Id === userId;

                      return (
                        <Col key={event.eventid} xs={12} sm={6} lg={4}>
                          <Card className={classes.eventCard}>
                            <Card.Img
                              onClick={() => handleImageClick(event.eventid)} // Use the handler function
                              variant="top"
                              src={event.eventimage}
                              className={classes.imageElement}
                            />
                            <Card.Body>
                              <Card.Title className={classes.title}>Name: {event.eventname}</Card.Title>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                              <ListGroup.Item className={classes.eventInfo}>Date: {event.eventdate}</ListGroup.Item>
                              <ListGroup.Item className={classes.eventInfo}>Type: {event.eventtype}</ListGroup.Item>
                              <ListGroup.Item className={classes.eventInfo}>Place: {event.eventplace}</ListGroup.Item>
                              <ListGroup.Item className={classes.eventInfo}>
                                Attendees: {event.eventAttendeesLimit}
                              </ListGroup.Item>
                              <ListGroup.Item className={classes.eventInfo}>
                                Organiser: {event.organiserName}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                {isUserOrganizer ? (
                                  <Button
                                    variant="outline-danger"
                                    onClick={() => {
                                      handleCreateTicketNavigation(event);
                                    }}
                                  >
                                    Create Event Ticket
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline-danger"
                                    onClick={() => {
                                      handleViewTicketsNavigation(event);
                                      console.log(`After render: ${event.eventid}`);
                                    }}
                                  >
                                    View Event Tickets
                                  </Button>
                                )}
                              </ListGroup.Item>
                            </ListGroup>
                          </Card>
                        </Col>
                      );
                    })}
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
      <Container fluid>
        <div>
          <h1>And here are your bought tickets!</h1>
          {boughtTicketsData.length > 0 ? (
            <table className={classes.ticketTable}>
              <thead>
                <tr>
                  <th>Ticket Id</th>
                  <th>Ticket Name</th>
                  <th>Ticket Category</th>
                  <th>Ticket Benefits</th>
                  <th>Event Name</th>
                  <th>Event Date</th>
                  <th>Event Place</th>
                </tr>
              </thead>
              <tbody>
                {boughtTicketsData.map((ticket) => (
                  <tr key={ticket.ticketId}>
                    <td>{ticket.ticketId}</td>
                    <td>{ticket.ticketName}</td>
                    <td>{ticket.category}</td>
                    <td>{ticket.benefits}</td>
                    <td>{ticket.eventName}</td>
                    <td>{ticket.eventDate}</td>
                    <td>{ticket.eventPlace}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : 
          <h1>It seems like you haven't bought any ticket yet..</h1>}
        </div>
      </Container>
    </div>
  );
};

export default Profile;
