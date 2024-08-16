import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import classes from "./CreateTicket.module.css";

type TicketValues = {
  ticketId: number;
  ticketName: string;
  ticketPrice: number;
  category: string;
  benefits: string;
  ticket_Limit: number;
};

const CreateTicket: React.FC = () => {
  const location = useLocation();
  const { eventid } = location.state || {};

  const [visible, setVisible] = useState<boolean>(false);
  const [ticketName, setTicketName] = useState<string>("");
  const [ticketPrice, setTicketPrice] = useState<string>("");
  const [ticketLimit, setTicketLimit] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [benefits, setBenefits] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [ticketsData, setTicketsData] = useState<TicketValues[]>([]);
  const [attendeesLimit, setAttendeesLimit] = useState<number | null>(null);
  const [modalShow, setModalShow] = useState<boolean>(false);

  useEffect(() => {
    if (eventid) {
      fetchTickets();
    }
  }, [eventid]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`https://localhost:7083/api/Event/GetEventTickets?eventId=${eventid}`);
      setTicketsData(response.data);
      await getEventAttendees();
    } catch (error: any) {
      toast.error(`Error getting the tickets: ${error.message}`);
    }
  };

  const getEventAttendees = async () => {
    await axios
      .post(`https://localhost:7083/api/Event/GetEventAttendees?eventId=${eventid}`, {
        eventId: eventid,
      })
      .then((response) => {
        setAttendeesLimit(Number(response.data)); // Convert to number
      })
      .catch((error: any) => {
        toast.error(`There has been a problem fetching the event attendees limit: ${error.status} : ${error.message}`);
      });
  };

  const inputValidation = () => {
    let valid = true;

    const handleTicketLimits = (eventAttendeesLimit: number) => {
      const ticketLimitNumber = Number(ticketLimit);
      const currentTicketLimitSum = ticketsData.reduce((sum, ticket) => sum + ticket.ticket_Limit, 0);
      const newTotalLimit = currentTicketLimitSum + ticketLimitNumber;

      if (ticketLimitNumber <= 0) {
        toast.error("Ticket limit must be greater than 0.");
        valid = false;
        return;
      }

      if (newTotalLimit > eventAttendeesLimit) {
        toast.error(
          `Sorry, the total ticket limit (${newTotalLimit}) would surpass your attendees limit (${eventAttendeesLimit}).`
        );
        valid = false;
        return;
      }
    };

    if (ticketName === "") {
      toast.error("Please fill the ticket name field.");
      valid = false;
    }

    if (ticketPrice === "") {
      toast.error("Please fill the ticket price field.");
      valid = false;
    }

    if (ticketLimit === "") {
      toast.error("Please fill the ticket limit field.");
      valid = false;
    }
    if (benefits === "") {
      toast.error("Please fill the ticket benefits field.");
      valid = false;
    }

    if (selectedCategory === "") {
      toast.error("Please select a ticket category.");
      valid = false;
    }

    const eventAttendeesLimit = attendeesLimit || 0;
    handleTicketLimits(eventAttendeesLimit);

    setIsValid(valid);
    return valid;
  };

  const handleValues = async () => {
    try {
      await axios.post("https://localhost:7083/api/Event/CreateNewTicket", {
        eventId: eventid,
        ticketName: ticketName,
        ticketPrice: parseInt(ticketPrice),
        category: selectedCategory,
        benefits: benefits,
        ticket_limit: parseInt(ticketLimit),
      });
      toast.success("Ticket created successfully!");
      fetchTickets();
      setTicketName("");
      setTicketPrice("");
      setTicketLimit("");
      setSelectedCategory("");
      setBenefits("");
      setVisible(false);
      setIsEditing(false);
      setModalShow(false)
    } catch (error: any) {
      toast.error(`Failed to create the ticket: ${error.message}`);
      setModalShow(false)
    }
  };

  const handleButtonClick = () => {
    if (!isEditing) {
      setVisible(true);
      setIsEditing(true);
    } else {
      const valid = inputValidation();
      if (valid) {
        setModalShow(true)
      }
    }
  };

 

  const handleCancelClick = () => {
    setVisible(false);
    setIsEditing(false);
    setTicketName("");
    setTicketPrice("");
    setTicketLimit("");
    setBenefits("");
  };

  const handleCloseDetails = useCallback((): void => {
    setModalShow(false);
  }, []);

  return (
    <div className={classes.allContainer}>
      {modalShow && (
        <Modal show={modalShow} onHide={handleCloseDetails}>
          <Modal.Header closeButton className="bg-dark">
            <Modal.Title>
              <p className={classes.alertText}>Are you sure?</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark">
            <div className="bg-dark">
              <p className={classes.lightText}>
                This is an irreversible action, you cannot edit your ticket after creating it!
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="outline-success" onClick={handleValues}>
              Confirm
            </Button>
            <Button variant="outline-danger" onClick={handleCloseDetails}>
              Go back
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Container className={classes.container} fluid>
        <Row>
          <h1>Manage tickets for your event</h1>
        </Row>
        <Row className={classes.rowClass}>
          <Button className={classes.createButton} variant="primary" onClick={handleButtonClick} disabled={isEditing}>
            Create Ticket
          </Button>
        </Row>
        {visible && (
          <div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="inputGroupSelect01">
                  Ticket Category
                </label>
              </div>
              <select
                className="custom-select"
                id="inputGroupSelect01"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)} // Update selected category on change
              >
                <option value="">Choose your new ticket category</option> {/* Default empty value */}
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="VVIP">VVIP</option>
              </select>
            </div>
            <Row className={classes.rowClass}>
              <Col>
                <input
                  type="text"
                  placeholder="Ticket Name"
                  value={ticketName}
                  onChange={(event) => setTicketName(event.target.value)}
                />
              </Col>
              <Col>
                <input
                  type="number"
                  placeholder="Ticket Price"
                  value={ticketPrice}
                  onChange={(event) => setTicketPrice(event.target.value)}
                />
              </Col>
              <Col>
                <input
                  type="number"
                  placeholder="How many tickets can you sell of this ticket?"
                  value={ticketLimit}
                  onChange={(event) => setTicketLimit(event.target.value)}
                />
              </Col>
              <Row>
                <Col>
                  {" "}
                  <input
                    type="text"
                    placeholder="Ticket Benefits"
                    value={benefits}
                    onChange={(event) => setBenefits(event.target.value)}
                  />
                </Col>
              </Row>
              {isEditing && (
                <div className="d-flex justify-content-around">
                  <Button className={classes.ticketsButton} variant="success" onClick={handleButtonClick}>
                    Submit Ticket
                  </Button>
                  <Button className={classes.ticketsButton} variant="danger" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </div>
              )}
            </Row>
          </div>
        )}
        <Row>
          <div>
            <h1>Here are your tickets for this event.</h1>
            <Container fluid className={classes.ticketsContainer}>
              <table className={classes.ticketTable}>
                <thead>
                  <tr>
                    <th>Ticket Id</th>
                    <th>Ticket Name</th>
                    <th>Ticket Category</th>
                    <th>Ticket Price</th>
                    <th>Ticket Benefits</th>
                    <th>Ticket Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsData.map((ticket) => (
                    <tr key={ticket.ticketId}>
                      <td>{ticket.ticketId}</td>
                      <td>{ticket.ticketName}</td>
                      <td>{ticket.category}</td>
                      <td>${ticket.ticketPrice}</td>
                      <td>{ticket.benefits}</td>
                      <td>{ticket.ticket_Limit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Container>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default CreateTicket;
