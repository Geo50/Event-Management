import "bootstrap-icons/font/bootstrap-icons.css";

import axios from "axios";
import { useRef, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { HashLoader } from "react-spinners";

import passwordLogo from "../../assets/password_yellow.png";
import userLogo from "../../assets/user_yellow_2.png";
import LoginRightSide from "../LoginRight/LoginRightSide";
import ModalComponent from "../Modal/Modal";
import classes from "./Login.module.css";

type userCredentials = {
  userName: string;
  userPassword: string;
};

const key = "abcdefgh12345678dsadasdlsamdplmasdmpasmfa";

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [errorDisplay, setErrorDisplay] = useState<string>("");
  const [modalType, setModalType] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(
    null
  );

  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleCloseDetails = () => {
    setModalShow(false);
  };

  const inputValidation = (event: React.FormEvent) => {
    event.preventDefault();

    const userName = nameRef.current?.value || "";
    const userPassword = passwordRef.current?.value || "";

    if (userName === "" || userPassword === "") {
      let message = "Please fill out the following fields: ";
      if (userName === "") message += "Name ";
      if (userPassword === "") message += "Password ";
      setAlert({ type: "danger", message: message.trim() });
      return;
    }

    if (userPassword.length < 3) {
      setAlert({
        type: "danger",
        message: "Enter a password with more than 3 characters",
      });
      return;
    }

    const userValues: userCredentials = {
      userName,
      userPassword,
    };

    handleDatabaseInjection(userValues);
    setAlert(null);
  };

  const handleDatabaseInjection = (userValues: userCredentials) => {
    setLoading(true);
    axios
      .post("https://localhost:7273/api/User/VerifyLoginAccount", {
        UserName: userValues.userName,
        UserPassword: userValues.userPassword,
      })
      .then((response) => {
        setAlert({
          type: "success",
          message: "You have been logged in successfully",
        });
        secureLocalStorage.setItem(key, response.data.token);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setModalType("account-not-exist");
        } else {
          setErrorDisplay(error.message);
          setModalType("error");
        }
        setModalShow(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container fluid className={classes.componentContainer}>
      {/* //START OF ROW */}
      <Row className={classes.rowProperties}>
        <Col xs={12} lg={4} xl={4} className={classes.firstColumn}>
          {loading && (
            <div className={classes.loader}>
              <HashLoader color="#a80e0e" size={100} speedMultiplier={1.3} />{" "}
            </div>
          )}
          {modalShow && (
            <ModalComponent
              visibility={modalShow}
              modalType={modalType}
              errorDisplayProp={errorDisplay}
              handleClose={handleCloseDetails}
            />
          )}
          {alert && (
            <Alert
              variant={alert.type}
              dismissible
              onClose={() => setAlert(null)}
            >
              {alert.message}
            </Alert>
          )}
          <form className={classes.formContainer} onSubmit={inputValidation}>
            <h1 className={`display-4 ${classes.title}`}>Catch up now! </h1>
            <br />
            <h1 className={`display-6 ${classes.subTitle}`}>
              Login to your account
            </h1>
            <br />
            <div className={classes.logoContainer}>
              <i
                className="bi bi-person-circle"
                style={{ color: "#ffc107", fontSize: "26px" }}
              ></i>
              <input
                type="text"
                ref={nameRef}
                className={classes.inputElements}
                placeholder="Username"
              />
            </div>
            <div className={classes.logoContainer}>
              <i
                className="bi bi-key-fill"
                style={{ color: "#ffc107", fontSize: "26px" }}
              ></i>
              <input
                type="password"
                ref={passwordRef}
                className={classes.inputElements}
                placeholder="Password"
              />
            </div>
            <Button
              variant="outline-warning"
              type="submit"
              className={classes.submitButton}
            >
              Login
            </Button>
            <br />
            <div>
              <Link to="/forgotpassword" className={classes.linkElement}>
                Forgot Password?
              </Link>
            </div> <br />
            <div>
              <p className={classes.linkElement}> Don't have an account? 
              <Link to="/registration" className={classes.linkElement}> Create One</Link></p>
            </div>
          </form>
        </Col>
        <Col
          xs={0}
          lg={8}
          xl={8}
          className={`d-none d-lg-block ${classes.rightSide}`}
        >
          <LoginRightSide />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
