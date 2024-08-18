import axios from "axios";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { key } from "../../App";
import RedBlacK from "../../assets/vector-NOV-2020-53_generated.jpg";
import EventDetailsModal from "../Event Details/EventDetailsModal";
import classes from "./Homepage.module.css";

type eventData = {
  eventId: number;
  eventName: string;
  eventImage: string;
  eventDate: string;
  eventPlace: string;
  eventType: string;
  organiserName: string;
  organiser_Id: number;
  eventAttendeesLimit: number;
  totalTicketsBought: number;
};

const Homepage: React.FC = () => {
  const [events, setEvents] = useState<eventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<string>("");
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
        const isAdmin: string = decodedToken?.role;
        const userId: number = parseInt(decodedToken?.unique_name, 10);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          toast.error("Your session has expired. Please log in again.");
          navigate("/homepage");
          secureLocalStorage.clear();
          return null;
        }
        setIsAdmin(isAdmin);
        return userId;
      } catch (error) {
        toast.error("Failed to decode token.");
      }
    }
    return null;
  };

  useEffect(() => {
    const userId = decodeToken(); // Decodes the token and checks expiration

    if (userId !== null) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  const handleEventsGeneration = useCallback(async () => {
    setLoading(true);
    try {
      const result = await axios.get("https://localhost:7083/api/Event/GetEventsInHomepage");
      const eventsWithUsernames = await Promise.all(
        result.data.map(async (event: eventData) => {
          const organiserResponse = await axios.get(
            `https://localhost:7083/api/Event/GetUsernameFromId?userid=${event.organiser_Id}`
          );
          const transactionResponse = await axios.get(
            `https://localhost:7083/api/Event/GetTransactionsPerEvent?eventid=${event.eventId}`
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
      toast.error(`Failed to fetch events. Status code: ${error.response?.status}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${RedBlacK})`;
    document.body.style.height = `100vh`;
    handleEventsGeneration();
    decodeToken();

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.height = "";
    };
  }, [handleEventsGeneration]);

  const handleCloseDetails = useCallback((): void => {
    setModalShow(false);
  }, []);

  return (
    <div>
      {loading ? (
        <div className={classes.loader}>
          <PuffLoader color="var(--registration-blue)" size={130} />
        </div>
      ) : (
        <Container fluid className={classes.eventsContainer}>
          
          <Row >
            {events.map((event) => (
              <Col key={event.eventId} xs={12} sm={6} lg={4}>
                <Card
                  className={classes.eventCard}
                  onClick={() => {
                    setModalShow(true);
                    setSelectedEventId(event.eventId);
                  }}
                >
                  <div className={classes.cardImgWrapper}>
                    <Card.Img variant="top" src={event.eventImage} className={classes.imageElement} loading="lazy" />
                  </div>

                  <Card.Body>
                    <Card.Title className={classes.title}>
                      <h3>{event.eventName}</h3>
                    </Card.Title>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className={`${classes.eventInfo} ${classes.eventType}`}>
                      {event.eventType}
                    </ListGroup.Item>
                    <ListGroup.Item className={`${classes.eventInfo} ${classes.eventType}`}>
                      {event.organiserName}
                    </ListGroup.Item>
                    <div className={`${classes.infoRow} ${classes.dateLocationBlock}`}>
                      <ListGroup.Item className={classes.eventInfo}>
                        {format(new Date(event.eventDate), "MMMM dd, yyyy, h:mm a")}
                      </ListGroup.Item>
                      <ListGroup.Item className={classes.eventInfo}>{event.eventPlace}</ListGroup.Item>
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
                    <ListGroup.Item className={classes.eventInfo}></ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            ))}
          </Row>
          <div className={classes.detailsParent}>
            <EventDetailsModal
              visibility={modalShow}
              handleClose={handleCloseDetails}
              eventId={selectedEventId || 0}
              isLoggedin={isLoggedIn}
            />
          </div>
          {isAdmin === "Admin" ? (
            <div className={classes.createEventButton}>
              <Link to="/create-event">
                <i className={`bi bi-plus ${classes.plusIcon}`}></i>
              </Link>
            </div>
          ) : null}
        </Container>
      )}
    </div>
  );
};

export default Homepage;
