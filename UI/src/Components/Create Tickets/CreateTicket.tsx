import { Button, Container, Row } from "react-bootstrap";
import classes from "./CreateTicket.module.css";
import { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";

type TicketValues = {
  TicketName: string;
  TicketPrice: number;
};


const CreateTicket: React.FC = () => {
    const location = useLocation()
    const { eventId } = location.state || {};

  const [visible, setVisible] = useState<boolean>(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [tickets, setTickets] = useState<TicketValues[]>([]);

  const inputValidation = () => {
    let valid = true;
    const name: string = nameRef?.current ? nameRef.current.value : "";
    const priceString = priceRef?.current ? priceRef.current.value : "";

    if (name === "") {
      toast.error("Please fill the ticket name field.");
      nameRef.current?.classList.add(classes.inputError);
      valid = false;
    } else {
      nameRef.current?.classList.remove(classes.inputError);
    }

    if (priceString === "") {
      toast.error("Please fill the ticket price field.");
      priceRef.current?.classList.add(classes.inputError);
      valid = false;
    } else {
      priceRef.current?.classList.remove(classes.inputError);
    }

    setIsValid(valid);
    return valid;
  };

  const handleValues = async () => {
    try {
      // Send a request to create a new ticket
      await axios.post("https://localhost:7083/api/Event/CreateNewTicket", {
        eventId: eventId,
        ticketName: nameRef.current?.value,
        ticketPrice: parseFloat(priceRef.current?.value || "0")
      });
      // Notify the user about successful ticket creation
      toast.success("Ticket created successfully!");
  
      // Fetch all tickets for the event
      try {
        const response = await axios.get(`https://localhost:7083/api/Event/GetEventTickets?eventId=${eventId}`);
        const tickets = response.data; 
        setTickets(tickets);
        console.log("Response is " + response)
        console.log("State var is " + tickets)
        console.log("First element is " + tickets[0])
      } catch (fetchError: any) {
        toast.error(`Error getting the tickets. Status code: ${fetchError.response?.status} : ${fetchError.message}`);
      }
    } catch (error: any) {
      toast.error(`Failed to create the ticket. Status code: ${error.response?.status} : ${error.message}`);
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
        setIsEditing(false); // Optionally toggle editing off after saving
      }
    }
  };

  return (
    <div className={classes.allContainer}>
      <ToastContainer />
      <Container className={classes.container}>
        <Row>
          <h1>Manage tickets for your event</h1>
        </Row>
        <Row className={classes.rowClass}>
          <Button className={classes.editButton} onClick={handleButtonClick}>
            {isEditing ? "Submit Ticket" : "Create Ticket"}
          </Button>
        </Row>
        {visible && (
          <div>
            <Row className={classes.rowClass}>
              <input type="text" placeholder="Ticket Name" ref={nameRef} />
            </Row>
            <Row className={classes.rowClass}>
              <input type="text" placeholder="Ticket Price" ref={priceRef} />
            </Row>
            <Row>
              <div>
                <h1>Here are your tickets for this event.</h1>
                {/* Render tickets here */}
              </div>
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
};

export default CreateTicket;
