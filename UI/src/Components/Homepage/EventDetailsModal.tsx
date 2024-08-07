import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Container, ListGroup, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import classes from "./EventDetailsModal.module.css";
import { PuffLoader } from "react-spinners";

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
  ticketName: string;
  ticketPrice: number;
};

const EventDetailsModal: React.FC<inputProps> = ({ visibility, handleClose, eventId }) => {
  const [events, setEvents] = useState<eventData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEventsGeneration = async () => {
    try {
      const result = await axios.post(`https://localhost:7083/api/Event/GetEventInDetails?eventId=${eventId}`, {
        eventId: eventId,
      });
      console.log(result);
      setEvents(result.data[0]);
    } catch (error: any) {
      toast.error(`Failed to generate events. Status code: ${error.response?.status}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visibility && eventId) {
      handleEventsGeneration();
    }
  }, [visibility, eventId]);

  return (
    <Container fluid className={classes.modalContainer}>
      <Modal show={visibility} onHide={handleClose}>
        {loading && (
          <div className={classes.loader}>
            <PuffLoader color="var(--registration-blue)" size={130} />
          </div>
        )}
        <Modal.Body >
          <Card className={classes.eventCard}>
            <Card.Img variant="top" src={events?.eventImage} />
            <Modal.Header closeButton>
              <Modal.Title className={classes.title}>
                <p> Name: {events?.eventName}</p>
              </Modal.Title>
            </Modal.Header>
            <Card.Body>
              <Card.Title className={classes.title}>Description: {events?.eventDescription}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item className={classes.eventInfo}>Date: {events?.eventDate}</ListGroup.Item>
              <ListGroup.Item className={classes.eventInfo}>Type: {events?.eventType}</ListGroup.Item>
              <ListGroup.Item className={classes.eventInfo}>Ticket Name: {events?.ticketName}</ListGroup.Item>
              <ListGroup.Item className={classes.eventInfo}>Ticket Price: {events?.ticketPrice}</ListGroup.Item>
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
