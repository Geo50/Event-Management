import axios from "axios";
import { differenceInDays, isBefore } from "date-fns";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { key } from "../../App";
import WhiteTable from "../../assets/Table-Background.jpg";
import { storage } from "../../Firebase/Firebase";
import ModalComponent from "../Modal/Modal";
import classes from "./CreateEvent.module.css";
import InputComponent from "./InputComponent";

type EventCredentials = {
  eventName: string;
  eventDate: string;
  eventPlace: string;
  eventType: string;
  eventDescription: string;
  eventAttendeesLimit: number;
  ticket_limit_per_user: number;
};

const CreateEvent: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventCredentials>();

  const [imageURL, setImageURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [eventId, setEventId] = useState<number>(0);

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

  const handleAddBookmark = async (eventName: string, newEventId: number) => {
    setLoading(true);
    try {
      const userId = decodeToken();
      if (userId) {
        await axios.post("https://localhost:7083/api/Event/CreateNewBookmark", {
          UserId: userId,
          EventId: newEventId,
          EventName: eventName,
        });
        toast.success("Successfully added to profile bookmarks.");
      } else {
        toast.error("User ID not found. Please log in again.");
      }
    } catch (error: any) {
      toast.error(`Failed to add bookmark: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit: SubmitHandler<EventCredentials> = async (data) => {
    if (!imageURL) {
      toast.error("Please upload an event image");
      return;
    }

    const organiserID = decodeToken();
    setLoading(true);
    try {
      const response = await axios.post("https://localhost:7083/api/Event/CreateNewEvent", {
        EventName: data.eventName,
        EventDate: data.eventDate,
        EventPlace: data.eventPlace,
        EventType: data.eventType,
        EventImage: imageURL,
        EventDescription: data.eventDescription,
        organiser_id: organiserID,
        eventAttendeesLimit: data.eventAttendeesLimit,
        ticket_limit_per_user: data.ticket_limit_per_user,
      });

      const newEventId = response.data.eventId;
      setEventId(newEventId);
      setModalShow(true);
      setModalType("Create Event");

      if (newEventId) {
        await handleAddBookmark(data.eventName, newEventId);
      } else {
        toast.error("Couldn't add to bookmark: Event ID not received from server.");
      }
    } catch (error: any) {
      toast.error(`Failed to create event: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={classes.inputElementBox}>
            <InputComponent
              inputType="text"
              inputPlaceholder="Enter your event name"
              register={register("eventName", { required: "Event name is required" })}
              error={errors.eventName}
            />
            <InputComponent
              inputType="text"
              inputPlaceholder="Describe your event"
              register={register("eventDescription", { required: "Event description is required" })}
              error={errors.eventDescription}
            />
            <InputComponent
              inputType="datetime-local"
              inputPlaceholder="Enter your event date"
              register={register("eventDate", {
                required: "Event date is required",
                validate: {
                  notPastDate: (value) => {
                    const selectedDate = new Date(value);
                    const currentDate = new Date();
                    return !isBefore(selectedDate, currentDate) || "Event date cannot be in the past";
                  },
                  withinOneMonth: (value) => {
                    const selectedDate = new Date(value);
                    const currentDate = new Date();
                    return (
                      differenceInDays(selectedDate, currentDate) <= 30 ||
                      "Event date cannot be more than one month in the future"
                    );
                  },
                },
              })}
              error={errors.eventDate}
            />
            <InputComponent
              inputType="text"
              inputPlaceholder="Event Place"
              register={register("eventPlace", { required: "Event place is required" })}
              error={errors.eventPlace}
            />
            <InputComponent
              inputType="text"
              inputPlaceholder="Enter your Event Type"
              register={register("eventType", { required: "Event type is required" })}
              error={errors.eventType}
            />
            <InputComponent
              inputType="number"
              inputPlaceholder="How many people can your event have?"
              register={register("eventAttendeesLimit", {
                required: "Attendees limit is required",
                min: { value: 1, message: "Attendees limit must be at least 1" },
              })}
              error={errors.eventAttendeesLimit}
            />
            <InputComponent
              inputType="number"
              inputPlaceholder="What is the maximum amount of tickets a single user can buy?"
              register={register("ticket_limit_per_user", {
                required: "Ticket limit per user is required",
                min: { value: 1, message: "Ticket limit must be at least 1" },
              })}
              error={errors.ticket_limit_per_user}
            />
            <Button type="submit" variant="danger" className={classes.submitButton}>
              Submit
            </Button>
          </form>
        </div>
      </Col>
    </Container>
  );
};

export default CreateEvent;
