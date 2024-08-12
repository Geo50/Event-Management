import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import RedBlacK from "../../assets/Night-Sky.jpg";
import EventDetailsModal from "./EventDetailsModal";
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
};

const Homepage: React.FC = () => {
  const [events, setEvents] = useState<eventData[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<eventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${RedBlacK})`;
    document.body.style.height = `100vh`;

    const handleEventsGeneration = async () => {
      setLoading(true);
      try {
        const result = await axios.get("https://localhost:7083/api/Event/GetEventsInHomepage");
        const eventsWithUsernames = await Promise.all(
          result.data.map(async (event: eventData) => {
            const organiserResponse = await axios.get(
              `https://localhost:7083/api/Event/GetUsernameFromId?userid=${event.organiser_Id}`
            );
            return {
              ...event,
              organiserName: organiserResponse.data,
            };
          })
        );
        setEvents(eventsWithUsernames);
        setFeaturedEvents(eventsWithUsernames.slice(0, 3));
      } catch (error: any) {
        toast.error(`Failed to create event. Status code: ${error.response?.status}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    handleEventsGeneration();

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.height = "";
    };
  }, []);

  const handleCloseDetails = useCallback((): void => {
    setModalShow(false);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex === featuredEvents.length - 1 ? 0 : prevIndex + 1));
  }, [featuredEvents.length]);

  const handlePrevious = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? featuredEvents.length - 1 : prevIndex - 1));
  }, [featuredEvents.length]);

  return (
    <div>
      <ToastContainer />
      {loading ? (
        <div className={classes.loader}>
          <PuffLoader color="var(--registration-blue)" size={130} />
        </div>
      ) : (
        <Container fluid className={classes.eventsContainer}>
          <Row>
            <div className={classes.headerContainer}>
              <h1 className={`${classes.header}`}>Our Featured Events!</h1>
            </div>
          </Row>
          <Row>
            <div className={`${classes.carouselAllContainer}`}>
              <div id="carouselExampleIndicators" className="carousel slide">
                <ol className="carousel-indicators">
                  {featuredEvents.map((_, index) => (
                    <li
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={index === activeIndex ? "active" : ""}
                    ></li>
                  ))}
                </ol>
                <div className="carousel-inner">
                  {featuredEvents.map((event, index) => (
                    <div
                      key={event.eventId}
                      className={`carousel-item ${index === activeIndex ? "active" : ""} ${classes.carouselContainer}`}
                    >
                      <Card className={`${classes.eventCard} w-100`}>
                        <Card.Img
                          variant="top"
                          src={event.eventImage}
                          className={classes.imageElement}                          
                          onClick={() => {
                            setModalShow(true);
                            setSelectedEventId(event.eventId);
                          }}
                        />
                        <Card.Body>
                          <Card.Title className={classes.title}>{event.eventName}</Card.Title>
                        </Card.Body>

                        <ListGroup className="list-group-flush">
                          <ListGroup.Item className={classes.eventInfo}>Date: {event.eventDate}</ListGroup.Item>
                          <ListGroup.Item className={classes.eventInfo}>Place: {event.eventPlace}</ListGroup.Item>
                          <ListGroup.Item className={classes.eventInfo}>Type: {event.eventType}</ListGroup.Item>
                          <ListGroup.Item className={classes.eventInfo}>
                            Organiser: {event.organiserName}
                          </ListGroup.Item>
                          <ListGroup.Item className={classes.eventInfo}>
                            Attendees: {event.eventAttendeesLimit}
                          </ListGroup.Item>
                        </ListGroup>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className={`carousel-control-prev ${classes.navigationButton}`}
                type="button"
                onClick={handlePrevious}
              >
                <span className={`carousel-control-prev-icon ${classes.navigationIcon}`} aria-hidden="true"></span>
              </button>
              <button
                className={`carousel-control-prev ${classes.navigationButton}`}
                type="button"
                onClick={handleNext}
              >
                <span className={`carousel-control-next-icon ${classes.navigationIcon}`} aria-hidden="true"></span>
              </button>
            </div>
          </Row>
          <Row>
            <div className={classes.headerContainer}>
              <h1 className={`${classes.header}`}>Have Fun!</h1>
            </div>
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
                    loading="lazy"
                  />
                  <Card.Body>
                    <Card.Title className={classes.title}> {event.eventName}</Card.Title>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className={classes.eventInfo}>Date: {event.eventDate}</ListGroup.Item>
                    <ListGroup.Item className={classes.eventInfo}>Place: {event.eventPlace}</ListGroup.Item>
                    <ListGroup.Item className={classes.eventInfo}>Type: {event.eventType}</ListGroup.Item>
                    <ListGroup.Item className={classes.eventInfo}>Organiser: {event.organiserName}</ListGroup.Item>
                    <ListGroup.Item className={classes.eventInfo}>
                      Attendees: {event.eventAttendeesLimit}
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            ))}
          </Row>
          <div className={classes.detailsParent}>
            <EventDetailsModal visibility={modalShow} handleClose={handleCloseDetails} eventId={selectedEventId || 0} />
          </div>

          <div className={classes.createEventButton}>
            <Link to="/create-event">
              <i className={`bi bi-plus ${classes.plusIcon}`}></i>
            </Link>
          </div>
        </Container>
      )}
    </div>
  );
};

export default Homepage;
