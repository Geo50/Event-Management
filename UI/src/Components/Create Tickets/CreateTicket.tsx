import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import classes from "./CreateTicket.module.css";

type TicketValues = {
  ticketId: number;
  ticketName: string;
  ticketPrice: number;
  category: string;
  benefits: string;
};

const CreateTicket: React.FC = () => {
  const location = useLocation();
  const { eventId } = location.state || {};

  const [visible, setVisible] = useState<boolean>(false);
  const [ticketName, setTicketName] = useState<string>("");
  const [ticketPrice, setTicketPrice] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [benefits, setBenefits] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [ticketsData, setTicketsData] = useState<TicketValues[]>([]);

  useEffect(() => {
    if (eventId) {
      fetchTickets();
    }
  }, [eventId]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`https://localhost:7083/api/Event/GetEventTickets?eventId=${eventId}`);
      setTicketsData(response.data);
    } catch (error: any) {
      toast.error(`Error getting the tickets: ${error.message}`);
    }
  };

  const inputValidation = () => {
    let valid = true;

    if (ticketName === "") {
      toast.error("Please fill the ticket name field.");
      valid = false;
    }

    if (ticketPrice === "") {
      toast.error("Please fill the ticket price field.");
      valid = false;
    }

    if (selectedCategory === "") {
      // Check if a category is selected
      toast.error("Please select a ticket category.");
      valid = false;
    }

    setIsValid(valid);
    return valid;
  };

  const handleValues = async () => {
    try {
      await axios.post("https://localhost:7083/api/Event/CreateNewTicket", {
        eventId: eventId,
        ticketName: ticketName,
        ticketPrice: parseFloat(ticketPrice),
        category: selectedCategory,
        benefits: benefits,
      });
      toast.success("Ticket created successfully!");
      fetchTickets();
      setTicketName("");
      setTicketPrice("");
      setSelectedCategory("");
      setBenefits("");
      setVisible(false);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(`Failed to create the ticket: ${error.message}`);
    }
  };

  const handleButtonClick = () => {
    if (!isEditing) {
      setVisible(true);
      setIsEditing(true);
    } else {
      const valid = inputValidation();
      if (valid) {
        handleValues();
      }
    }
  };

  const handleCancelClick = () => {
    setVisible(false);
    setIsEditing(false);
    setTicketName("");
    setTicketPrice("");
  };

  return (
    <div className={classes.allContainer}>
      <ToastContainer />
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
                onChange={(event) =>  setSelectedCategory(event.target.value)} // Update selected category on change
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
                  onChange={(event) =>  setTicketName(event.target.value)}
                />
              </Col>
              <Col>
                <input
                  type="number"
                  placeholder="Ticket Price"
                  value={ticketPrice}
                  onChange={(event) =>  setTicketPrice(event.target.value)}
                />
              </Col>
              <Row>
                <Col>
                  {" "}
                  <input
                    type="text"
                    placeholder="Ticket Benefits"
                    value={benefits}
                    onChange={(event) =>  setBenefits(event.target.value)}
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
                  </tr>
                </thead>
                <tbody>
                  {ticketsData.map((ticket) => (
                    <tr key={ticket.ticketId}>
                      <td>{ticket.ticketId}</td>
                      <td>{ticket.ticketName}</td>
                      <td>{ticket.category}</td>
                      <td>{ticket.ticketPrice}</td>
                      <td>{ticket.benefits}</td>
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
