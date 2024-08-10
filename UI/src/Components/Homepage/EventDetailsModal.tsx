import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, ListGroup, Modal, ToastBody } from "react-bootstrap";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { key } from "../../App";
import classes from "./EventDetailsModal.module.css";
import { Navigate, useNavigate } from "react-router-dom";

type inputProps = {
  visibility: boolean;
  handleClose: () => void;
  eventId: number;
};

type eventData = {
  eventId: number;
  eventName: string;
  eventImage: string;
  eventDate: string;
  eventPlace: string;
  eventType: string;
  eventDescription: string;
};

const EventDetailsModal: React.FC<inputProps> = ({ visibility, handleClose, eventId }) => {
  const [events, setEvents] = useState<eventData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleEventsGeneration = async () => {
    try {
      const result = await axios.post(`https://localhost:7083/api/Event/GetEventInDetails?eventId=${eventId}`, {
        eventId: eventId,
      });
      setEvents(result.data[0]);
    } catch (error: any) {
      toast.error(`Failed to generate events. Status code: ${error.response?.status}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
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
          return null;
        }

        console.log(decodedToken);
        return userId;
      } catch (error) {
        toast.error("Failed to decode token.");
        return null;
      }
    }
    return null;
  };
  const fetchUserDetails = async () => {
    const userId = decodeToken();
    if (userId) {
      try {
        const result = await axios.post(`https://localhost:7273/api/User/GetUserById?userId=${userId}`, {
          userId: userId,
        });
        return result.data;
      } catch (error: any) {
        console.log(`Failed to get user details. Status code: ${error.response?.status}: ${error.message}`);
      }
    }
  };

  const handleAddBookmark = async () => {
    setLoading(true);
    const userId = decodeToken(); // Extract userId from token
    if (userId) {
      const userDetailsResponse = await fetchUserDetails(); // Fetch user details to get the username
      if (userDetailsResponse) {
        await axios.post("https://localhost:7083/api/Event/CreateNewBookmark", {
          UserId: userId, // UserId from the token
          EventId: eventId, // EventId from the event data in map
          EventName: events?.eventName, // EventName from the event data in map
        });
        toast.success("Successfully added to bookmarks", {
          autoClose: 3000,
        });
      }
    } else {
      toast.error("You need to be logged in to bookmark events")
      navigate("/login");
    }
  };
  useEffect(() => {
    if (visibility && eventId) {
      handleEventsGeneration();
    }
  }, [visibility, eventId]);

  return (
    <Container fluid className={classes.modalContainer}>
      <Modal show={visibility} onHide={handleClose} className={classes.eventModal}>
        {loading && (
          <div className={classes.loader}>
            <PuffLoader color="var(--registration-blue)" size={130} />
          </div>
        )}
        <Modal.Body>
          <ToastBody />
          <Card className={classes.eventCard}>
            <div className={classes.parentContainer}>
              <Card.Img variant="top" src={events?.eventImage} className={classes.imageElement} />
              <div className={classes.bookmarkPosition}>
                <Button variant="outline-danger" onClick={() => handleAddBookmark()}>
                  <i className="bi bi-bookmarks-fill"></i>
                </Button>
              </div>
            </div>
            <Modal.Header closeButton>
              <Modal.Title >
                <p className={classes.title}>{events?.eventName}</p>
              </Modal.Title>
            </Modal.Header>
            <Card.Body>
              <Card.Title><p className={classes.eventDescription}>{events?.eventDescription}</p></Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item className={classes.eventInfo}>Date: {events?.eventDate}</ListGroup.Item>
              <ListGroup.Item className={classes.eventInfo}>Type: {events?.eventType}</ListGroup.Item>
              <ListGroup.Item className={classes.eventInfo}>Place: {events?.eventPlace}</ListGroup.Item>
            </ListGroup>
            <Card.Body>
              <Button variant="danger w-100">Get Tickets</Button>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EventDetailsModal;
