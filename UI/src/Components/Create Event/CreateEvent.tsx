import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { key } from "../../App";
import WhiteTable from "../../assets/Table-Background.jpg";
import { storage } from "../../Firebase/Firebase";
import ModalComponent from "../Modal/Modal";
import classes from "./CreateEvent.module.css";
import InputComponent, { ComponentFunctions } from "./InputComponent";

type eventCredentials = {
  eventName: string;
  eventDate: string;
  eventPlace: string;
  eventType: string;
  eventImage: string;
  eventDescription: string;
  organiser_id: number;
};


const CreateEvent: React.FC = () => {
  const eventNameRef = useRef<ComponentFunctions>(null);
  const eventDateRef = useRef<ComponentFunctions>(null);
  const eventPlaceRef = useRef<ComponentFunctions>(null);
  const eventTypeRef = useRef<ComponentFunctions>(null);
  const eventImageRef = useRef<HTMLInputElement>(null);
  const eventDescriptionRef = useRef<ComponentFunctions>(null);
  const eventDataRef = useRef<eventCredentials>({
    eventName: "",
    eventDate: "",
    eventPlace: "",
    eventImage: "",
    eventType: "",
    eventDescription: "",
    organiser_id: 0
  });

  const [imageURL, setImageURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [errorDisplay, setErrorDisplay] = useState<string>("");
  const [eventId, setEventId] = useState<number>(0);

  const [file, setFile] = useState<File | null>(null);

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

        if (decodedToken.exp < currentTime) {
          toast.error("Your session has expired. Please log in again.");
          return null;
        }
        return userId;
      } catch (error) {
        toast.error("Failed to decode token.");
        return null;
      }
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(e.target.files[0]);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (file: File) => {
    const fileRef = ref(storage, `event-images/${file.name}`);
    setLoading(true);
    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      setImageURL(downloadURL);
    } catch (uploadError: any) {
      toast.error(`Upload failed: ${uploadError.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${WhiteTable})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.height = "100vh";
    document.body.style.backdropFilter = "blur(3px)";
    decodeToken();

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.height = "";
      document.body.style.backdropFilter = "";
    };
  }, []);

  const handleAddBookmark = async (eventValues: eventCredentials) => {
    setLoading(true);
    try {
      const userId = decodeToken(); // Extract userId from token
      if (userId) {
        await axios.post("https://localhost:7083/api/Event/CreateNewBookmark", {
          UserId: userId, // UserId from the token
          EventId: eventId, // EventId from the event data
          EventName: eventValues.eventName,
        });
      }
    } catch (error: any) {
      toast.error(`An error occurred: ${error.response?.status}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const organiserID = decodeToken();
    let isValid: boolean = true;
    let today = new Date();
    const eventValues: eventCredentials = {
      eventName: (eventNameRef.current?.value as string) || "",
      eventDate: (eventDateRef.current?.value as string) || "",
      eventPlace: (eventPlaceRef.current?.value as string) || "",
      eventImage: imageURL || "",
      eventType: (eventTypeRef.current?.value as string) || "",
      eventDescription: (eventDescriptionRef.current?.value as string) || "",
      organiser_id: organiserID || 0
    };
    let inputDate: number = new Date(eventValues.eventDate).getTime();
    let todayTimestamp = today.getTime();

    if (eventValues.eventName === "") {
      eventNameRef.current?.handleAddErrorClass();
      toast.error("Please enter an event name");
      isValid = false;
    } else {
      eventNameRef.current?.handleRemoveErrorClass();
    }

    if (eventValues.eventDate === "") {
      eventDateRef.current?.handleAddErrorClass();
      toast.error("Please enter a date");
      isValid = false;
    } else if (inputDate - todayTimestamp > 30 * 24 * 60 * 60 * 1000) {
      toast.error("Please enter a date not so far in the future");
      eventDateRef.current?.handleAddErrorClass();
      isValid = false;
    } else if (inputDate - todayTimestamp < 0) {
      toast.error("Please enter a valid date");
      eventDateRef.current?.handleAddErrorClass();
      isValid = false;
    } else {
      eventDateRef.current?.handleRemoveErrorClass();
    }

    if (eventValues.eventPlace === "") {
      eventPlaceRef.current?.handleAddErrorClass();
      toast.error("Please enter a place for the event");
      isValid = false;
    } else {
      eventPlaceRef.current?.handleRemoveErrorClass();
    }

    if (eventValues.eventImage === "") {
      eventImageRef.current?.classList.add(classes.inputError);
      toast.error("Please upload an event image");
      isValid = false;
    } else {
      eventImageRef.current?.classList.remove(classes.inputError);
    }

    if (eventValues.eventType === "") {
      eventTypeRef.current?.handleAddErrorClass();
      toast.error("Please enter the type of event");
      isValid = false;
    } else {
      eventTypeRef.current?.handleRemoveErrorClass();
    }

    if (eventValues.eventDescription === "") {
      eventDescriptionRef.current?.handleAddErrorClass();
      toast.error("Please describe the event");
      isValid = false;
    } else {
      eventDescriptionRef.current?.handleRemoveErrorClass();
    }

    if (isValid) {
      handleDatabaseInjection(eventValues);
    }
  };

  const handleDatabaseInjection = useCallback(async (eventValues: eventCredentials) => {
    const organiserID = decodeToken();
    console.log(organiserID)
    setLoading(true);
    await axios
      .post("https://localhost:7083/api/Event/CreateNewEvent", {
        EventName: eventValues.eventName,
        EventDate: eventValues.eventDate,
        EventPlace: eventValues.eventPlace,
        EventType: eventValues.eventType,
        EventImage: eventValues.eventImage,
        EventDescription: eventValues.eventDescription,
        organiser_id: organiserID
      })
      .then((response) => {
        const eventId = response.data.eventId;
        setEventId(eventId);
        setModalShow(true);
        setModalType("Create Event");
        if (eventId !== 0) {
          handleAddBookmark(eventValues);
          toast.success("Successfully added to profile bookmarks.");
        } else {
          toast.error("Couldn't add to bookmark.");
        }
      })
      .catch((error) => {
        toast.error(`Failed to create event. Status code: ${error.status}: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  


  const handleCloseDetails = useCallback((): void => {
    setModalShow(false);
  }, []);

  return (
    <Container fluid className={classes.container}>
      <ModalComponent
        visibility={modalShow}
        handleClose={handleCloseDetails}
        modalType={modalType}
        errorDisplayProp=""
        eventIdProp={eventId}
      />
      <ToastContainer />
      {loading && (
        <div className={classes.loader}>
          <PuffLoader color="var(--registration-blue)" size={130} />
        </div>
      )}
      <Col xl={4} lg={6} md={8} sm={12} className={classes.backgroundContainer}>
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
                <label htmlFor="image_insertion" className={`${classes.imageInputField}`}>
                  Choose your event picture
                </label>
              </div>
            )}
            {imageURL && <img src={imageURL} alt="Event" className={classes.imagePreview} />}
            {/* <button onClick={handleUpload} disabled={loading}>
                    Upload Image
                  </button> */}
          </div>

          <div className={classes.inputElementBox}>
            <InputComponent
              ref={eventNameRef}
              inputType="text"
              inputPlaceholder="Enter your event name"
              value={eventDataRef.current.eventName}
            />
            <InputComponent
              ref={eventDescriptionRef}
              inputType="text"
              inputPlaceholder="Describe your event"
              value={eventDataRef.current.eventDescription}
            />
            <InputComponent
              ref={eventDateRef}
              inputType="datetime-local"
              inputPlaceholder="Enter your event date"
              value={eventDataRef.current.eventDate}
            />
            <InputComponent
              ref={eventPlaceRef}
              inputType="text"
              inputPlaceholder="Event Place"
              value={eventDataRef.current.eventPlace}
            />
            <InputComponent
              ref={eventTypeRef}
              inputType="text"
              inputPlaceholder="Enter your Event Type"
              value={eventDataRef.current.eventType}
            />
            <Button variant="outline-danger" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </Col>
    </Container>
  );
};

export default CreateEvent;
