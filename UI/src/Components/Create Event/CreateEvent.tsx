import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Winetable from "../../assets/Table-Background.jpg";
import { storage } from "../../Firebase/Firebase"; // Import your firebase config
import classes from "./CreateEvent.module.css";
import { PuffLoader } from "react-spinners";

type eventCredentials = {
  eventName: string;
  eventDate: string;
  eventPlace: string;
  eventType: string;
  eventImage: string;
  eventDescription: string;
  eventAttendees: number;
  ticketName: string;
  ticketPrice: number;
};

const CreateEvent: React.FC = () => {

  const eventNameRef = useRef<HTMLInputElement>(null);
  const eventDateRef = useRef<HTMLInputElement>(null);
  const eventPlaceRef = useRef<HTMLInputElement>(null);
  const eventTypeRef = useRef<HTMLInputElement>(null);
  const eventImageRef = useRef<HTMLInputElement>(null);
  const eventDescriptionRef = useRef<HTMLInputElement>(null);
  const ticketNameRef = useRef<HTMLInputElement>(null);
  const ticketPriceRef = useRef<HTMLInputElement>(null);
  const eventAttendeesRef = useRef<HTMLInputElement>(null);

  const [imageURL, setImageURL] = useState<string>("");
  const [view, setView] = useState<string>("details");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [errorDisplay, setErrorDisplay] = useState<string>("");
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      handleUpload();
    }
  };
  const handleUpload = async () => {
    if (file) {
      const fileRef = ref(storage, `event-images/${file.name}`);
      setLoading(true);
      try {
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        setImageURL(downloadURL);
      } catch (uploadError) {
        console.error('Upload failed:', uploadError);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    document.body.style.backgroundImage = `url(${Winetable})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.height = "100%";
    document.body.style.overflow = "";
    document.body.style.backdropFilter = "blur(3px)";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = () => {
    let isValid: boolean = true;
    let today = new Date();
    const eventValues: eventCredentials = {
      eventName: eventNameRef.current?.value || "",
      eventDate: eventDateRef.current?.value || "",
      eventPlace: eventPlaceRef.current?.value || "",
      eventImage: imageURL || "",
      eventType: eventTypeRef.current?.value || "",
      eventDescription: eventDescriptionRef.current?.value || "",
      eventAttendees: parseInt(eventAttendeesRef.current?.value || "0"),
      ticketName: ticketNameRef.current?.value || "",
      ticketPrice: parseFloat(ticketPriceRef.current?.value || "0"),

    };
    let inputDate: number = new Date(eventValues.eventDate).getTime();
    let todayTimestamp = today.getTime();

    if (eventValues.eventName === "") {
      eventNameRef.current?.classList.add(classes.inputError);
      toast.error("Please enter an event name");
      isValid = false;
    } else {
      eventNameRef.current?.classList.remove(classes.inputError);
    }

    if (eventValues.eventDate === "") {
      eventDateRef.current?.classList.add(classes.inputError);
      toast.error("Please enter a date");
      isValid = false;
    } else if (inputDate - todayTimestamp > 30 * 24 * 60 * 60 * 1000) { // 10 days in milliseconds
      toast.error("Please enter a date not so far in the future");
      eventDateRef.current?.classList.add(classes.inputError);
      isValid = false;
    } else if (inputDate - todayTimestamp < 0) {
      toast.error("Please enter a valid date");
      eventDateRef.current?.classList.add(classes.inputError);
      isValid = false;
    } else {
      eventDateRef.current?.classList.remove(classes.inputError);
    }

    if (eventValues.eventPlace === "") {
      eventPlaceRef.current?.classList.add(classes.inputError);
      toast.error("Please enter a place for the event");
      isValid = false;
    } else {
      eventPlaceRef.current?.classList.remove(classes.inputError);
    }

    if (eventValues.eventImage === "") {
      eventImageRef.current?.classList.add(classes.inputError);
      toast.error("Please upload an event image");
      isValid = false;
    } else {
      eventImageRef.current?.classList.remove(classes.inputError);
    }

    if (eventValues.eventType === "") {
      eventTypeRef.current?.classList.add(classes.inputError);
      toast.error("Please enter the type of event");
      isValid = false;
    } else {
      eventTypeRef.current?.classList.remove(classes.inputError);
    }

    if (eventValues.eventDescription === "") {
      eventDescriptionRef.current?.classList.add(classes.inputError);
      toast.error("Please describe the event");
      isValid = false;
    } else {
      eventDescriptionRef.current?.classList.remove(classes.inputError);
    }

    if (eventValues.ticketName === "") {
      ticketNameRef.current?.classList.add(classes.inputError);
      toast.error("Please enter a ticket name");
      isValid = false;
    } else {
      ticketNameRef.current?.classList.remove(classes.inputError);
    }

    if (eventValues.ticketPrice <= 0 || eventValues.ticketPrice > 1000) {
      ticketPriceRef.current?.classList.add(classes.inputError);
      toast.error("Please enter a valid ticket price");
      isValid = false;
    } else {
      ticketPriceRef.current?.classList.remove(classes.inputError);
    }

    if (eventValues.eventAttendees < 0 || eventValues.eventAttendees > 1000) {
      eventAttendeesRef.current?.classList.add(classes.inputError)
      toast.error("Please enter a valid number of maximum attendees")
    }

    if (isValid) {
      handleDatabaseInjection(eventValues);
    }
  };

  const handleDatabaseInjection = useCallback(
    async (eventValues: eventCredentials) => {
      setLoading(true);
      axios
        .post("https://localhost:7083/api/Event/CreateNewEvent", {
          EventName: eventValues.eventName,
          EventDate: eventValues.eventDate,
          EventPlace: eventValues.eventPlace,
          EventType: eventValues.eventType,
          EventImage: eventValues.eventImage,
          EventDescription: eventValues.eventDescription,
          TicketName: eventValues.ticketName,
          TicketPrice: eventValues.ticketPrice,
        })
        .then(() => {
          navigate("/homescreen");
        })
        .catch((error) => {
          toast.error(`Failed to create event. Status code: ${error.status}: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [navigate]
  );

  const handleNavbarShow = (selectedKey: string | null) => {
    if (selectedKey) {
      setView(selectedKey);
    }
  };

  return (
    <Container fluid className={classes.container}>
      <ToastContainer />
      {loading && (
            <div className={classes.loader}>
              <PuffLoader color="var(--registration-blue)" size={130} />
            </div>
          )}
      <Col xl={4} lg={6} md={8} sm={12} className={classes.backgroundContainer}>
        <Nav
          variant="tabs"
          activeKey={view}
          onSelect={handleNavbarShow}
          className="mb-5"
        >
          <Nav.Item>
            <Nav.Link eventKey="details" className={classes.navbarItem}>
              <p className={classes.text}> Event Details</p>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="tickets" className={classes.navbarItem}>
              <p className={classes.text}>Tickets</p>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* {view === "details" && ( */}
        <div>
          <h1 className={`${classes.title} display-4`}>Set Up Your Event</h1>
          <div className={classes.hiddenElement}>
            <input
              type="file"
              name="image_insertion"
              id="image_insertion"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              ref={eventImageRef}
            />
          </div>
          <div className={classes.imageContainer}>
            {!imageURL && (
              <div>
                 <label
                htmlFor="image_insertion"
                className={`${classes.imageInputField}`}
              >
                Choose your event picture
              </label>
               <button onClick={handleUpload} disabled={loading}>Upload Image
             </button>
              </div>
             
            )}

            {imageURL && (
              <img
                src={imageURL}
                alt="Event"
                className={classes.imagePreview}
              />
            )}
          </div>
          <div>
            <div className={classes.inputElementBox}>
              <div className={classes.inputElementBox}>
                <input
                  type="text"
                  placeholder="Enter event name"
                  className={classes.inputElements}
                  ref={eventNameRef}
                />
              </div>
              <div className={classes.inputElementBox}>
                <input
                  type="text"
                  placeholder="Describe your event"
                  className={classes.inputElements}
                  ref={eventDescriptionRef}
                />
              </div>
              <div className={classes.inputElementBox}>
                <input
                  type="datetime-local"
                  className={classes.inputElements}
                  ref={eventDateRef}
                />
              </div>
              <div className={classes.inputElementBox}>
                <input
                  type="text"
                  placeholder="Event Place"
                  className={classes.inputElements}
                  ref={eventPlaceRef}
                />
              </div>
              <div className={classes.inputElementBox}>
                <input
                  type="text"
                  placeholder="Event Type (concert...)"
                  className={classes.inputElements}
                  ref={eventTypeRef}
                />
              </div>
              <div className={classes.inputElementBox}>
                <input
                  type="number"
                  placeholder="Event Attendees"
                  className={classes.inputElements}
                  ref={eventAttendeesRef}
                />
              </div>
            </div>
          </div>
        </div>
        {/* )} */}
        {/* {view === "tickets" && ( */}
        <div>
          <h1 className={`${classes.title} display-4`}>Create Your Tickets</h1>
          <Button className={classes.addTicket} variant="danger">
            Add New Ticket
          </Button>
          <div className={classes.inputElementBox}>
            <div className={classes.inputElementBox}>
              <input
                type="text"
                placeholder="Ticket Name"
                className={classes.inputElements}
                ref={ticketNameRef}
              />
            </div>
            <div className={classes.inputElementBox}>
              <input
                type="number"
                placeholder="Ticket Price"
                className={classes.inputElements}
                ref={ticketPriceRef}
              />
            </div>
          </div>
          <Button variant="danger" className="mb-3 mt-3">
            Create Ticket
          </Button>
          <Button variant="warning w-100" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
        {/* )} */}
      </Col>
    </Container>
  );
};

export default CreateEvent;
