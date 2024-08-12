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
  organiser_id: number;
  organiserName: string;
  eventAttendeesLimit: number
}

const EventDetailsModal: React.FC<inputProps> = ({ visibility, handleClose, eventId }) => {
  const [events, setEvents] = useState<eventData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleEventsGeneration = async () => {
    try {
      const result = await axios.post(`https://localhost:7083/api/Event/GetEventInDetails?eventId=${eventId}`, {
        eventId: eventId,
      });
      const eventData = result.data[0];
      const organiserResponse = await axios.get(
        `https://localhost:7083/api/Event/GetUsernameFromId?userid=${eventData.organiser_id}`
      );

      setEvents({
        ...eventData,
        organiserName: organiserResponse.data,
      });
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
        toast.error(`Failed to get user details. Status code: ${error.response?.status}: ${error.message}`);
      }
    }
  };

  const handleAddBookmark = async () => {
    setLoading(true);
    const userId = decodeToken(); // Extract userId from token
    if (userId) {
      const userDetailsResponse = await fetchUserDetails(); // Fetch user details to get the username
      if (userDetailsResponse) {
        await axios
          .post("https://localhost:7083/api/Event/CreateNewBookmark", {
            UserId: userId, // UserId from the token
            EventId: eventId, // EventId from the event data in map
            EventName: events?.eventName, // EventName from the event data in map
          })
          .then(() => {
            toast.success("Successfully added to bookmarks", {
              autoClose: 3000,
            });
          })
          .catch((error: any) => {
            if (error.response && error.response.data.includes("Bookmark already exists")) {
              toast.error("Bookmark already exists");
            } else {
              toast.error(
                `Something went wrong while bookmarking the event. Status Code: ${error.response?.status}, ${error.message}`
              );
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      toast.error("You need to be logged in to bookmark events");
      navigate("/login");
    }
  };
  useEffect(() => {
    if (visibility && eventId) {
      handleEventsGeneration();
    }
  }, [visibility, eventId]);

  const handleViewTickets = () => {
    navigate("/view-tickets", {
      state: {
        eventId: eventId, // Using events?.eventId instead of eventId
      },
    });
  };
  
  return (
    <div>
      {loading && (
        <div className={classes.loader}>
          <PuffLoader color="var(--registration-blue)" size={130} />
        </div>
      )}
      <Container fluid className={classes.modalContainer}>
        <Modal show={visibility} onHide={handleClose} className={`${classes.eventModal}`}>
          <Modal.Body className={`bg-dark ${classes.modalBody}`}>
            <ToastBody />
            <Card className={`bg-dark ${classes.eventCard}`}>
              <div className={classes.parentContainer}>
                <Card.Img variant="top" src={events?.eventImage} className={classes.imageElement} />
                <div className={classes.bookmarkPosition}>
                  <Button variant="outline-danger" onClick={() => handleAddBookmark()}>
                    <i className="bi bi-bookmarks-fill"></i>
                  </Button>
                </div>
              </div>
              <Modal.Header closeButton>
                <Modal.Title>
                  <p className={classes.title}>{events?.eventName}</p>
                </Modal.Title>
              </Modal.Header>
              <Card.Body>
                <Card.Title>
                  <p className={classes.eventDescription}>{events?.eventDescription}</p>
                </Card.Title>
              </Card.Body>
              <ListGroup className=" list-group-flush">
                <ListGroup.Item className={`bg-dark ${classes.eventInfo}`}>Date: {events?.eventDate}</ListGroup.Item>
                <ListGroup.Item className={`bg-dark ${classes.eventInfo}`}>Type: {events?.eventType}</ListGroup.Item>
                <ListGroup.Item className={`bg-dark ${classes.eventInfo}`}>Place: {events?.eventPlace}</ListGroup.Item>
                <ListGroup.Item className={`bg-dark ${classes.eventInfo}`}>Organizer: {events?.organiserName}</ListGroup.Item>
                <ListGroup.Item className={`bg-dark ${classes.eventInfo}`}>Attendees: {events?.eventAttendeesLimit}</ListGroup.Item>
              </ListGroup>
              <Card.Body>
                {events  && (
                  <Button variant="danger w-100" onClick={handleViewTickets}>View Tickets</Button>
                )}
                
              </Card.Body>
            </Card> 
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};


export default EventDetailsModal;
function InvalidOperationException(reason: any): PromiseLike<never> {
  throw new Error("Function not implemented.");
}
