import { useRef, useState } from "react";
import LoginRightSide from "../LoginRight/LoginRightSide";
import classes from "./Login.module.css";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { Link } from "react-router-dom";
import ModalComponent from "../Modal/Modal";

import passwordLogo from "../../assets/password.png";
import userLogo from "../../assets/user.png";

type userCredentials = {
  userName: string;
  userPassword: string;
};

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
      .then(() => {
        setAlert({
          type: "success",
          message: "You have been logged in successfully",
        });
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
    <Container>
      {loading ? (
        <div className={classes.loader}>
          <HashLoader color="#a80e0e" size={100} speedMultiplier={1.3} />{" "}
        </div>
      ) : (
        <div>
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
          <Row className="justify-content-start mt-5">
            <Col md={7} lg={4} className={classes.formsContainer}>
              <Form className={classes.formPosition} onSubmit={inputValidation}>
                <Form.Group className={classes.formGroup}>
                <div className={classes.logoContainer}><img src={userLogo} alt="user_logo" className={classes.minimisedLogo}/></div>                  
                  <Form.Control type="text" ref={nameRef} className={classes.inputElements} placeholder="Username"/>
                </Form.Group>
                <Form.Group className={classes.formGroup}>
                <div className={classes.logoContainer}><img src={passwordLogo} alt="password_logo" className={classes.minimisedLogo}/></div>
                  <Form.Control type="password" ref={passwordRef} className={classes.inputElements} placeholder="Password" />
                </Form.Group>
                  <Button
                    variant="outline-primary"
                    type="submit"
                    className={classes.buttonRegister}
                  >
                    Login
                  </Button>
                  <Container className={classes.flexedElements}>
                  <h5 className={classes.text}>Don't have an account yet?</h5>
                  <Link to="/registration">
                  <Button
                    variant="outline-primary"
                    type="submit"
                    className={classes.buttonRegister}
                  >
                    Create One Now
                  </Button></Link>
                  </Container>
                  
              </Form>
            </Col>
            <Col md={6} className="d-none d-md-block">
              <LoginRightSide />
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default Login;
