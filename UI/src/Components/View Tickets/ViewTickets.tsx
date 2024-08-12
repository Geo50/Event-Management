import axios from "axios";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import classes from "./ViewTickets.module.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type TicketValues = {
  ticketId: number;
  ticketName: string;
  ticketPrice: number;
  category: string;
  benefits: string;
  ticket_Limit: number;
};

const ViewTickets: React.FC = () => {
  const location = useLocation();
  const { eventId } = location.state || {};

  const [ticketsData, setTicketsData] = useState<TicketValues[]>([]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`https://localhost:7083/api/Event/GetEventTickets?eventId=${eventId}`);
      setTicketsData(response.data);
    } catch (error: any) {
      toast.error(`Error getting the tickets: ${error.message}`);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchTickets();
    }
  }, []);

  return (
    <div>
      <Container fluid className={classes.ticketsContainer}>
        {ticketsData.length > 0 ? (
          <table className={classes.ticketTable}>
            <thead>
              <tr>
                <th>Ticket Id</th>
                <th>Ticket Name</th>
                <th>Ticket Category</th>
                <th>Ticket Price</th>
                <th>Ticket Benefits</th>
                <th>Ticket Limit</th>
                <th>Buy Ticket</th>
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
                  <td><Button variant="danger">Buy Ticket</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tickets found for this event.</p>
        )}
      </Container>
    </div>
  );
};

export default ViewTickets;
