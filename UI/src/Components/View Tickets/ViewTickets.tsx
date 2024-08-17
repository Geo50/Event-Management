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
  const [ticketsBoughtNumber, setTicketsBoughtNumber] = useState<number>(0);
  const [maximumTicketsPerUser, setMaximumTicketsPerUser] = useState<number>(1);
  const [overMaximum, setOverMaximum] = useState<boolean>(false);

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
    try {
      const response = await axios.post(`https://localhost:7083/api/Stripe/payment-success?SessionId=${SessionId}`);

      toast.success("Payment successful! Your ticket has been purchased.");
    } catch (error: any) {
      console.error("Error confirming payment:", error.response ? error.response.data : error.message);
      toast.error("Error confirming payment. Please contact support.");
    }
  };

  const getTicketLimitPerUser = async () => {
    try {
      const transactionNumberResponse = await axios.post(
        `https://localhost:7083/api/Event/GetTransactionsPerUserEvent`,
        {
          eventid: eventId,
          UserId: userId,
        }
      );

      const maxTicketsResponse = await axios.post(
        `https://localhost:7083/api/Event/GetEventMaxTicketsPerUser?eventid=${eventId}`
      );

      return {
        ticketsBought: transactionNumberResponse.data,
        maxTickets: maxTicketsResponse.data,
      };
    } catch (error: any) {
      toast.error(`An error occurred. Status code ${error.response?.status}: ${error.message}`);
      return null;
    }
  };

  const handleTicketLimitPerUser = async () => {
    const result = await getTicketLimitPerUser();
    if (result) {
      setTicketsBoughtNumber(result.ticketsBought);
      setMaximumTicketsPerUser(result.maxTickets);
      setOverMaximum(result.ticketsBought >= result.maxTickets);
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

  useEffect(() => {
    if (eventId && userId) {
      handleTicketLimitPerUser();
    }
  }, [eventId, userId]);

  return (
    <div>
      <Container fluid className={classes.ticketsContainer}>
        <h1>
          Please keep in mind that you can buy a maximum of {maximumTicketsPerUser} tickets for this event, as per the
          limit set by the organiser of the event.
        </h1>
        <br />

        {ticketsData.length > 0 ? (
          <table className={classes.ticketTable}>
            <thead>
              <tr>
                <th>Ticket Id</th>
                <th>Ticket Name</th>
                <th>Ticket Category</th>
                <th>Ticket Price</th>
                <th>Ticket Benefits</th>
                <th>Tickets Available</th>
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
                  <td>
                    <div className={classes.buttonContainer}>
                      {ticket.ticket_Limit === 0 ? (
                        <Button variant="danger" disabled>
                          Sold out!
                        </Button>
                      ) : (
                        <div>
                          {overMaximum ? (
                            <Button variant="danger" disabled className={classes.buyButton}>
                              Sorry, you cannot buy any more tickets for this event!
                            </Button>
                          ) : (
                            <Button variant="danger" onClick={() => handleBuyTicket(ticket)}>
                              Buy Ticket!
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
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
