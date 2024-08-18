import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, ListGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { key } from "../../App";
import classes from "./EventDetailsModal.module.css";
import { format } from "date-fns";

type inputProps = {
  visibility: boolean;
  handleClose: () => void;
  eventId: number;
  isLoggedin: boolean;
};

type eventData = {
  eventid: number;
  eventName: string;
  eventImage: string;
  eventDate: string;
  eventPlace: string;
  eventType: string;
  organiser_id: number;
  organiserName: string;
  eventAttendeesLimit: number;
  eventDescription: string;
  totalTicketsBought: number;
};

const EventDetailsModal: React.FC<inputProps> = ({ visibility, handleClose, eventId, isLoggedin }) => {
  const [events, setEvents] = useState<eventData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>();
  const [isOrganizer, setIsOrganizer] = useState<boolean>(false);

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
      const transactionResponse = await axios.get(
        `https://localhost:7083/api/Event/GetTransactionsPerEvent?eventid=${eventId}`
      );

      setEvents({
        ...eventData,
        organiserName: organiserResponse.data,
        totalTicketsBought: transactionResponse.data,
      });
      const currentUserId = decodeToken();
      setIsOrganizer(currentUserId === eventData.organiser_id);
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

        return userId;
      } catch (error) {
        toast.error("Failed to decode token.");
        return null;
      }
    }
    return null;
  };

  const userId = decodeToken();
  
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

  const handleDeleteBookmark = async () => {
    await axios.delete(`https://localhost:7083/api/Event/DeleteBookmark`, {
      data: {
        userId: userId,
        eventId: eventId,
      },
    });
    setIsBookmarked(false);
    toast.error(`Event removed from bookmarks`, {
      autoClose: 2000,
    });
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
            setIsBookmarked(true);
            toast.success("Successfully added to bookmarks", {
              autoClose: 2000,
            });
          })
          .catch((error: any) => {
            if (error.response && error.response.data.includes("Bookmark already exists")) {
              handleDeleteBookmark();
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
      toast.error("You need to be logged in to bookmark events" , {
        autoClose: 2000
      });
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
        eventId: eventId,
      },
    });
  };

  const handleCreateTickets = () => {
    navigate("/create-ticket", {
      state: {
        eventid: eventId,
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
            <Card className={`bg-dark ${classes.eventCard}`}>
              <div className={classes.parentContainer}>
                <div className={classes.cardImgWrapper}>
                  <Card.Img variant="top" src={events?.eventImage} className={classes.imageElement} />
                </div>
                <div className={classes.bookmarkPosition}>
                  {isBookmarked ? (
                    <Button variant="outline-danger" onClick={handleDeleteBookmark}>
                      <i className="bi bi-bookmark-x-fill"></i>
                    </Button>
                  ) : (
                    <Button variant="outline-warning" onClick={handleAddBookmark}>
                      <i className="bi bi-bookmarks-fill"></i>
                    </Button>
                  )}
                </div>
              </div>

              <Modal.Header closeButton>
                <Modal.Title>
                  <h3 className={classes.title}>{events?.eventName}</h3>
                </Modal.Title>
              </Modal.Header>
              <Card.Body>
                <p className={classes.eventDescription}>{events?.eventDescription}</p>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item className={`${classes.eventInfo} ${classes.eventType}`}>
                  {events?.eventType}
                </ListGroup.Item>
                <ListGroup.Item className={`${classes.eventInfo} ${classes.eventType}`}>
                  {events?.organiserName}
                </ListGroup.Item>
                <div className={`${classes.infoRow} ${classes.dateLocationBlock}`}>
                  <ListGroup.Item className={classes.eventInfo}>
                    {events?.eventDate
                      ? format(new Date(events.eventDate), "MMMM dd, yyyy, h:mm a")
                      : "Date not available"}
                  </ListGroup.Item>
                  <ListGroup.Item className={classes.eventInfo}>{events?.eventPlace}</ListGroup.Item>
                </div>
                <div className={`${classes.infoRow} ${classes.attendingEvent}`}>
                  <ListGroup.Item className={classes.eventInfo}>
                    {events?.totalTicketsBought} / {events?.eventAttendeesLimit}
                    <span> Attending </span>
                  </ListGroup.Item>
                </div>
              </ListGroup>
              <Card.Body>
                {isLoggedin ? (
                  isOrganizer ? (
                    <Button variant="danger" className={`w-100 ${classes.eventCTA}`} onClick={handleCreateTickets}>
                      Create Tickets
                    </Button>
                  ) : (
                    <Button variant="danger" className={`w-100 ${classes.eventCTA}`} onClick={handleViewTickets}>
                      View Tickets
                    </Button>
                  )
                ) : (
                  <Button variant="secondary" className={`w-100 ${classes.eventCTA}`} disabled>
                    Login to View Tickets
                  </Button>
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
