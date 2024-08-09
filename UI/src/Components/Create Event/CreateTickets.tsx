// import axios from "axios";
// import { useCallback, useRef } from "react";
// import { Button, Col } from "react-bootstrap";
// import { toast } from "react-toastify";
// import classes from "./CreateEvent.module.css";

// type ticketCredentials = {
//   ticketName: string;
//   ticketPrice: number;
// };

const CreateTickets: React.FC = () => { return <div></div>}
//   const ticketNameRef = useRef<HTMLInputElement>(null);
//   const ticketPriceRef = useRef<HTMLInputElement>(null);
//   const handleSubmit = () => {
//     let isValid: boolean = true;
//     const ticketValues: ticketCredentials = {
//       ticketName: (ticketNameRef.current?.value as string) || "",
//       ticketPrice: (ticketPriceRef.current?.value as number) || 0,
//     };
//   };
//   const handleDatabaseInjection = useCallback(
//     async (ticketValues: ticketCredentials) => {
//       setLoading(true);
//       axios
//         .post("https://localhost:7083/api/Event/CreateNewTicket", {
//           TicketName: eventValues.ticketName,
//           TicketPrice: eventValues.ticketPrice,
//         })
//         .then(() => {
//           navigate("/homescreen");
//         })
//         .catch((error) => {
//           toast.error(
//             `Failed to create new ticket. Status code: ${error.status}: ${error.message}`
//           );
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     },
//     [navigate]
//   );
//   return (
//     <div>
//       <Col className={classes.backgroundContainer}>
//         <div>
//           <h1 className={`${classes.title} display-4`}>Create Your Tickets</h1>
//           <div className={classes.inputElementBox}>
//             <input
//               type="text"
//               placeholder="Enter ticket price"
//               ref={ticketNameRef}
//               className={classes.inputElements}
//             />
//             <input
//               type="text"
//               placeholder="Enter ticket price"
//               ref={ticketNameRef}
//               className={classes.inputElements}
//             />
//           </div>
//           <Button variant="danger w-100" onClick={handleSubmit}>
//             Submit
//           </Button>
//         </div>
//       </Col>
//     </div>
//   );
// };
export default CreateTickets;
