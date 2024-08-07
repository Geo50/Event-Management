import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Modal, Row } from "react-bootstrap";
import classes from "./Homepage.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EventDetailsModal from "./EventDetailsModal";
import RedBlacK from "../../assets/Firecrackers.jpg";
import { PuffLoader } from "react-spinners";

type eventData = {
  eventId: number;
  eventName: string;
  eventImage: string;
  eventDate: string;
  eventPlace: string;
  eventType: string;
};

const Homepage: React.FC = () => {
  const [events, setEvents] = useState<eventData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundImage = `url(${RedBlacK})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.height = "100vh";

    const handleEventsGeneration = async () => {
      setLoading(true);
      try {
        const result = await axios.get("https://localhost:7083/api/Event/GetEventsInHomepage");
        console.log(result);
        setEvents(result.data);
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
  }, [navigate]);

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
          <Row>
            <div className={classes.headerContainer}>
              {" "}
              <h1 className={`${classes.header} display-4 `}>Explore Your Community Events</h1>
            </div>
          </Row>
          <Row>
            {events.map((events) => (
              <Col key={events.eventId} xs={12} sm={6} lg={4}>
                <Card className={classes.eventCard}>
                  <Card.Img
                    onClick={() => {
                      setModalShow(true);
                      setSelectedEventId(events.eventId);
                    }}
                    variant="top"
                    src={events!.eventImage}
                    className={classes.imageElement}
                  />
                  <Card.Body>
                    <Card.Title className={classes.title}>Name : {events.eventName}</Card.Title>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className={classes.eventInfo}>Date : {events.eventDate}</ListGroup.Item>
                    <ListGroup.Item className={classes.eventInfo}>Type : {events.eventType}</ListGroup.Item>
                    <ListGroup.Item className={classes.eventInfo}>Place : {events.eventPlace}</ListGroup.Item>
                  </ListGroup>
                  <Card.Body>
                    <Link to={"/create-event"}>Get Tickets</Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <EventDetailsModal visibility={modalShow} handleClose={handleCloseDetails} eventId={selectedEventId || 0} />

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
