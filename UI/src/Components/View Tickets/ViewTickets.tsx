import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { key } from "../../App";
import classes from "./ViewTickets.module.css";

const stripePromise = loadStripe(
  "pk_test_51PmetxA1r4JzFYYK0XD849mE49mTyhW0lXtJSCAmd1o3MCREZmL7rZDNic0URFa4SnC86DXWgVigdFxRuZl40tbo00vYAkkny4"
);

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
  const navigate = useNavigate();

  const [ticketsData, setTicketsData] = useState<TicketValues[]>([]);

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

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`https://localhost:7083/api/Event/GetEventTickets?eventId=${eventId}`);
      setTicketsData(response.data);
    } catch (error: any) {
      toast.error(`Error getting the tickets: ${error.message}`);
    }
  };

  const handleBuyTicket = async (singleTicket: TicketValues) => {
    const userId = decodeToken();
    try {
      const response = await axios.post("https://localhost:7083/api/Stripe/create-checkout-session", {
        amount: singleTicket.ticketPrice * 100, // Convert to cents
        ticketId: singleTicket.ticketId,
        eventId: eventId,
        userId: userId,
      });

      const { id } = response.data;

      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: id,
        });

        if (error) {
          toast.error(`Error redirecting to checkout: ${error.message}`);
        }
      }
    } catch (error: any) {
      toast.error(`Error initiating payment: ${error.message}`);
    }
  };

  const handlePaymentSuccess = async (SessionId: string) => {
    console.log("Received sessionId:", SessionId);
    try {
      const response = await axios.post(`https://localhost:7083/api/Stripe/payment-success?SessionId=${SessionId}`);
      console.log(`response of payment success:`, response.data);
      toast.success("Payment successful! Your ticket has been purchased.");
      // Optionally, refresh the ticket list or navigate to a confirmation page
    } catch (error: any) {
      console.error("Error confirming payment:", error.response ? error.response.data : error.message);
      toast.error("Error confirming payment. Please contact support.");
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchTickets();
    }
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");
    const ticketId = query.get("ticket_id");

    if (sessionId && ticketId) {
      handlePaymentSuccess(sessionId);
    }
  }, [location]);

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
                  <td>
                    {ticket.ticket_Limit === 0 ? (
                      <Button variant="danger" disabled>
                      Sold out!
                    </Button>
                    ):(
                      <Button variant="danger" onClick={() => handleBuyTicket(ticket)}>
                      Buy Ticket!
                    </Button>
                    )}
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="d-flex justify-content-center">
            <p className={classes.noTicketsFound}>There are no tickets for this event..</p>
          </div>
        )}
      </Container>
      
    </div>
  );
};

export default ViewTickets;
