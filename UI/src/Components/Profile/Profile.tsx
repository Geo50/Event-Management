import { Button, Col, Container, Row } from "react-bootstrap";
import classes from "./Profile.module.css";
import { useEffect, useRef, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { key } from "../../App";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";

const Profile: React.FC = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [userValue, setUserValue] = useState<string>("");

  const usernameRef = useRef<HTMLInputElement>(null);

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

        console.log(decodedToken);
        console.log(`User ID: ${userId}`);
        return userId;
      } catch (error) {
        toast.error("Failed to decode token.");
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = decodeToken();
      if (userId) {
        try {
          const result = await axios.post(`https://localhost:7273/api/User/GetUserById?userId=${userId}`, {
            UserId: userId,
          });
          setUsername(result.data.userName);
          setEmail(result.data.userEmail);
          setUserValue(result.data.userName); // Set the userValue for the input field
          console.log(result.data.userName);
        } catch (error: any) {
          console.log(`Failed to get user details. Status code: ${error.response?.status}: ${error.message}`);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleEdit = async () => {
    const token: any = getToken();
    const decodedToken: any = jwtDecode(token);
    const UserId: number = parseInt(decodedToken?.unique_name, 10);

    try {
      const response = await axios.post(`https://localhost:7273/api/User/UpdateUsername`, {
        UserId: UserId,
        UserName: userValue, // Use userValue here
      });
      const result: string = response.data;
      setUsername(result);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const handleButtonClick = () => {
    if (isEditing) {
      // Save mode
      setDisabled(true);
      handleEdit();
    } else {
      // Edit mode
      setDisabled(false);
    }
    setIsEditing(!isEditing); // Toggle between edit and save modes
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserValue(event.target.value); // Update userValue on input change
  };

  return (
    <div className={`${classes.allContainer}`}>
      <Container className={classes.container}>
        <Row>
          <h1>Welcome, {username}</h1><br />
          <h1>Here are your account details</h1>
        </Row>
        <Row className="d-flex justify-content-center">
          <img src="" alt="" className={classes.userImage} />
        </Row>
        <Row className={classes.rowClass}>
          <Col md={9} lg={9}>
            <input
              type="text"
              value={userValue}
              onChange={handleInputChange}
              placeholder={username}
              disabled={disabled}
              className={classes.inputElement}
              ref={usernameRef}
            />
          </Col>
          <Col>
            <Button className={classes.editButton} onClick={handleButtonClick}>
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Col>
        </Row>
        <Row className={classes.rowClass}>
          <Col md={9} lg={9}>
            <input type="email" placeholder={email} disabled={disabled} className={classes.inputElement} />
          </Col>
          <Col>
            <Button className={classes.editButton}>Edit</Button>
          </Col>
        </Row>
        <Row className={classes.rowClass}>
          <Col md={9} lg={9}>
            <input type="password" placeholder="*********" disabled={disabled} className={classes.inputElement} />
          </Col>
          <Col>
            <Button className={classes.editButton}>Edit</Button>
          </Col>
        </Row>
        <Row className={classes.eventContainer}>
          <h1>View your bookmarked events</h1>
        </Row>
      </Container>
        
    </div>
  );
};

export default Profile;
