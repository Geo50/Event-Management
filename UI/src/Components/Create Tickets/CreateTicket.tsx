import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import classes from "./CreateTicket.module.css";

type TicketValues = {
  ticketName: string;
  ticketPrice: number;
  category: string;
  benefits: string;
  ticket_Limit: number;
};
const CreateTicket: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketValues>();
  const location = useLocation();
  const { eventid } = location.state || {};

  const [visible, setVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [ticketsData, setTicketsData] = useState<TicketValues[]>([]);
  const [attendeesLimit, setAttendeesLimit] = useState<number | null>(null);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [remainingTickets, setRemainingTickets] = useState<number>(0);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);

  useEffect(() => {
    if (eventid) {
      fetchTickets();
    }
  }, [eventid]);

  useEffect(() => {
    if (attendeesLimit !== null) {
      const currentTicketLimitSum = ticketsData.reduce((sum, ticket) => sum + ticket.ticket_Limit, 0);
      const remaining = attendeesLimit - currentTicketLimitSum;
      setRemainingTickets(remaining);
      setIsLimitReached(remaining <= 0);
    }
  }, [ticketsData, attendeesLimit]);
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
    try {
      const response = await axios.post(`https://localhost:7083/api/Event/GetEventAttendees?eventId=${eventid}`, {
        eventId: eventid,
      });
      setAttendeesLimit(Number(response.data));
    } catch (error: any) {
      toast.error(`There has been a problem fetching the event attendees limit: ${error.status} : ${error.message}`);
    }
  };

  const onSubmit: SubmitHandler<TicketValues> = async (data) => {
    try {
      await axios.post("https://localhost:7083/api/Event/CreateNewTicket", {
        eventId: eventid,
        ...data,
      });
      toast.success("Ticket created successfully!");
      fetchTickets();
      reset();
      setVisible(false);
      setIsEditing(false);
      setModalShow(false);
    } catch (error: any) {
      toast.error(`Failed to create the ticket: ${error.message}`);
      setModalShow(false);
    }
  };

  const handleButtonClick = () => {
    if (!isEditing) {
      setVisible(true);
      setIsEditing(true);
    } else {
      setModalShow(true);
    }
  };

  const handleCancelClick = () => {
    setVisible(false);
    setIsEditing(false);
    reset();
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
            <Button variant="outline-success" onClick={handleSubmit(onSubmit)}>
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
          <h2>Manage tickets for your event</h2>
        </Row>
        <Row className={classes.rowClass}>
          <Button
            className={classes.createButton}
            variant="primary"
            onClick={handleButtonClick}
            disabled={isEditing || isLimitReached}
          >
            Create Ticket
          </Button>
          {isLimitReached && (
            <h2 className={classes.warningText}>Ticket limit reached. No more tickets can be created.</h2>
          )}
        </Row>
        {visible && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="category">
                  Ticket Category
                </label>
              </div>
              <select
                id="category"
                className={errors.category ? classes.inputError : ""}
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Choose your new ticket category</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="VVIP">VVIP</option>
              </select>
            </div>
            {errors.category && <span className={classes.error}>{errors.category.message}</span>}

            <Row className={classes.rowClass}>
              <Col>
                <input
                  type="text"
                  placeholder="Ticket Name"
                  className={errors.ticketName ? classes.inputError : ""}
                  {...register("ticketName", { required: "Ticket name is required" })}
                />
                {errors.ticketName && <p className={classes.error}>{errors.ticketName.message}</p>}
              </Col>
              <Col>
                <input
                  type="number"
                  placeholder="Ticket Price"
                  className={errors.ticketPrice ? classes.inputError : ""}
                  {...register("ticketPrice", {
                    required: "Ticket price is required",
                    min: {
                      value: 10,
                      message: "Ticket price must range between $10 and $500 ",
                    },
                    max: {
                      value: 500,
                      message: "Ticket price must range between $10 and $500 ",
                    },
                  })}
                />
                {errors.ticketPrice && <p className={classes.error}>{errors.ticketPrice.message}</p>}
              </Col>
              <Col>
                <input
                  type="number"
                  placeholder="Tickets Available"
                  className={errors.ticket_Limit ? classes.inputError : ""}
                  {...register("ticket_Limit", {
                    required: "Ticket limit is required",
                    min: {
                      value: 1,
                      message: `Ticket limit must range between 1 and ${attendeesLimit}`,
                    },
                    max: {
                      value: `${attendeesLimit}`,
                      message: `Ticket limit must range between 1 and ${attendeesLimit}`,
                    },
                    validate: (value) =>
                      value <= remainingTickets ||
                      `Ticket limit (${value}) would surpass the remaining tickets (${remainingTickets})`,
                  })}
                />
                {errors.ticket_Limit && <p className={classes.error}>{errors.ticket_Limit.message}</p>}
              </Col>
              <Row>
                <Col>
                  <input
                    type="text"
                    placeholder="Ticket Benefits"
                    className={errors.benefits ? classes.inputError : ""}
                    {...register("benefits", { required: "Benefits are required" })}
                  />
                  {errors.benefits && <p className={classes.error}>{errors.benefits.message}</p>}
                </Col>
              </Row>
              {isEditing && (
                <div className="d-flex justify-content-around">
                  <Button className={classes.ticketsButton} variant="success" type="submit">
                    Submit Ticket
                  </Button>
                  <Button className={classes.ticketsButton} variant="danger" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </div>
              )}
            </Row>
          </form>
        )}
        <Row>
          <div>
            <h2>Here are your tickets for this event.</h2>
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
                  {ticketsData.map((ticket, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
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
