import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { key } from "../../App";
import EventDetailsModal from "../Event Details/EventDetailsModal";
import classes from "./Profile.module.css";
import { format } from "date-fns";
import RedBlacK from "../../assets/vector-NOV-2020-53_generated.jpg";

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
  totalTicketsBought: number;
};

type boughtTicketsType = {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventPlace: string;
  ticketId: number;
  ticketName: string;
  category: string;
  benefits: string;
};

const Profile: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const createTicketsButtonRef = useRef<HTMLButtonElement>(null);
  const viewTicketsButtonRef = useRef<HTMLButtonElement>(null);

  const [disabled, setDisabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [userValue, setUserValue] = useState<string>("");
  const [events, setEvents] = useState<eventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [boughtTicketsData, setBoughtTicketsData] = useState<boughtTicketsType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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

  const checkLoggedin = () => {
    if (userId != null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleBoughtTickets = async () => {
    await axios
      .get(`https://localhost:7083/api/Event/GetBoughtTickets?UserId=${userId}`)
      .then((response) => {
        console.log("Bought tickets data:", response.data);
        setBoughtTicketsData(response.data);
      })
      .catch(() => {
        toast.error("Error while fetching tickets data");
      });
  };

  const handleRefund = async (ticketid: number, eventId: number) => {
    try {
      await axios.put(`https://localhost:7083/api/Event/IncrementTicketStatus`, {
        ticketId: ticketid,
        eventId: eventId,
      });
      await axios.delete(`https://localhost:7083/api/Event/DeleteBoughtTicket`, {
        data: {
          ticketId: ticketid,
          eventid: eventId,
          userId: userId,
        },
      });

      toast.success("Ticket refunded successfully!");
      await handleBoughtTickets();
    } catch (error) {
      console.error("Error refunding ticket:", error);
      toast.error("Failed to refund ticket. Please try again.");
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${RedBlacK})`;

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
        } catch (error: any) {}
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

        const eventsWithUsernames = await Promise.all(
          result.data.map(async (event: eventData) => {
            setSelectedEventId(event.eventid);
            const organiserResponse = await axios.get(
              `https://localhost:7083/api/Event/GetUsernameFromId?userid=${event.organiser_Id}`
            );
            const transactionResponse = await axios.get(
              `https://localhost:7083/api/Event/GetTransactionsPerEvent?eventid=${event.eventid}`
            );
            return {
              ...event,
              organiserName: organiserResponse.data,
              totalTicketsBought: transactionResponse.data,
            };
          })
        );
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
    checkLoggedin();
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

  useEffect(() => {
    const token = getToken();
    const userId = decodeToken(); // Decodes the token and checks expiration

    if (userId !== null) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

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
    navigate("/view-tickets", {
      state: {
        eventId: event.eventid,
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
      <Container className={classes.container}>
        <Row>
          {/* <h1 className={classes.header}>Welcome, {username}!</h1>
          <br /> */}
          <h1 className={classes.header}>ACCOUNT DETAILS</h1>
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
            <div className={classes.editContainer}>
              <Button className={classes.editButton} onClick={handleButtonClick}>
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </Col>
        </Row>
        {/* <Row className={classes.rowClass}>
          <Col md={9} lg={9}>
            <input type="email" placeholder={email} disabled className={classes.inputElement} />
          </Col>
          
        </Row>
        <Row className={classes.rowClass}>
          <Col md={9} lg={9}>
            <input type="password" placeholder="*********" disabled className={classes.inputElement} />
          </Col>
          
        </Row> */}
        {events.length > 0 ? (
          <div>
            <Row className={classes.eventContainer}>
              <h1 className={classes.header}>BOOKMARKED EVENTS</h1>
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
                          <Card className={classes.eventCard} onClick={() => handleImageClick(event.eventid)}>
                            <div className={classes.cardImgWrapper}>
                              <Card.Img variant="top" src={event.eventimage} className={classes.imageElement} />
                            </div>
                            <Card.Body>
                              <Card.Title className={classes.title}>
                                <h3>{event.eventname}</h3>
                              </Card.Title>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                              <ListGroup.Item className={`${classes.eventInfo} ${classes.eventType}`}>
                                {event.eventtype}
                              </ListGroup.Item>
                              <ListGroup.Item className={`${classes.eventInfo} ${classes.eventType}`}>
                                {event.organiserName}
                              </ListGroup.Item>
                              <div className={`${classes.infoRow} ${classes.dateLocationBlock}`}>
                                <ListGroup.Item className={classes.eventInfo}>
                                  {" "}
                                  {format(new Date(event.eventdate), "MMMM dd, yyyy, h:mm a")}
                                </ListGroup.Item>

                                <ListGroup.Item className={classes.eventInfo}>{event.eventplace}</ListGroup.Item>
                              </div>
                              <div className={`${classes.infoRow} ${classes.attendingEvent}`}>
                                {event.eventAttendeesLimit === event.totalTicketsBought ? (
                                  <ListGroup.Item className={classes.eventInfo}>
                                    <h3 className={classes.fullyBooked}>EVENT FULLY BOOKED</h3>
                                  </ListGroup.Item>
                                ) : (
                                  <ListGroup.Item className={classes.eventInfo}>
                                    {event.totalTicketsBought} / {event.eventAttendeesLimit}
                                    <span> Attending </span>
                                  </ListGroup.Item>
                                )}
                              </div>
                              {event.eventAttendeesLimit !== event.totalTicketsBought && (
                                <ListGroup.Item className={classes.eventInfo}>
                                  {isUserOrganizer ? (
                                    <Button
                                      variant="danger"
                                      className={classes.eventCTA}
                                      onClick={() => {
                                        handleCreateTicketNavigation(event);
                                      }}
                                    >
                                      Create Event Ticket
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="danger"
                                      className={classes.eventCTA}
                                      onClick={() => {
                                        handleViewTicketsNavigation(event);
                                      }}
                                    >
                                      View Event Tickets
                                    </Button>
                                  )}
                                </ListGroup.Item>
                              )}
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
                    isLoggedin={isLoggedIn}
                  />
                </Container>
              )}
            </div>
          </div>
        ) : (
          <h1 className={classes.header}>You haven't bookmarked any events.</h1>
        )}
        {boughtTicketsData.length > 0 ? (
          <Row>
            <h1 className={classes.header}>Here are your bought tickets!</h1>
            <Col className={classes.columnClass}>
              {" "}
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
                    <th>Refund your ticket</th>
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
                      <td>{format(new Date(ticket.eventDate), "MMMM dd, yyyy, h:mm a")}</td>
                      <td>{ticket.eventPlace}</td>
                      <td>
                        <Button
                          variant="success"
                          onClick={() => handleRefund(ticket.ticketId, ticket.eventId)}
                          className={classes.refundTicket}
                        >
                          Refund Ticket
                        </Button>
                        <br />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        ) : (
          <h1 className={classes.ticketsEmpty}>Looks like you haven't bought any tickets yet.</h1>
        )}
      </Container>
    </div>
  );
};

export default Profile;
