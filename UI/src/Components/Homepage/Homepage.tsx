import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import classes from "./Homepage.module.css";
import axios from "axios";

const data = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
];

const Homepage: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEvents = () => {
    setEvents(data);
  };


  return (
    <div>
      <Button variant="outline-danger" onClick={handleEvents}>
        Generate events
      </Button>
      <Container fluid className={classes.eventsContainer}>
        <Row>
          {events.map((index) => (
            <Col key={index} xs={12} sm={6}>
              <Card className={classes.eventCard}>
                <Card.Img
                  variant="top"
                  src="holder.js/100px180?text=Image cap"
                />
                <Card.Body>
                  <Card.Title>Event Title</Card.Title>
                  <Card.Text>Event description</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>Event Date</ListGroup.Item>
                  <ListGroup.Item>Event Location</ListGroup.Item>
                  <ListGroup.Item>Tags or categories</ListGroup.Item>
                </ListGroup>
                <Card.Body>
                  <Card.Link href="#">Get Tickets</Card.Link>
                  <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Homepage;
