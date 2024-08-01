import { Container, Row, Col, Alert, Form, Button } from "react-bootstrap";

import classes from "./Registration.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import ModalComponent from "../Modal/Modal";
import secureLocalStorage from "react-secure-storage";

import LoginRightSide from "../LoginRight/LoginRightSide";
import axios from "axios";
import { HashLoader } from "react-spinners";
import passwordLogo from "../../assets/password.png";
import emailLogo from "../../assets/email.png";
import userLogo from "../../assets/user.png";
import { Link } from "react-router-dom";
import NightCity from "../../assets/NightCity.jpg";

const key = "abcdefgh12345678dsadasdlsamdplmasdmpasmfa";

type userCredentials = {
  userName: string;
  emailValue: string;
  userPassword: string;
  adminValue: boolean;
  PassVerificationAnswer: string; // Updated field name to match backend
};

const Login: React.FC = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const adminRef = useRef<HTMLInputElement>(null);
  const verifyRef = useRef<HTMLInputElement>(null);

  const [alert, setAlert] = useState<{ type: string; message: string } | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [errorDisplay, setErrorDisplay] = useState<string>("");

  const validationUserInfo = (event: React.FormEvent) => {
    event.preventDefault();

    const userName = nameRef.current?.value || "";
    const emailValue = emailRef.current?.value || "";
    const userPassword = passwordRef.current?.value || "";
    const adminValue = adminRef.current?.checked || false;
    const PassVerificationAnswer = verifyRef.current?.value || "";

    const userValues: userCredentials = {
      userName,
      emailValue,
      userPassword,
      adminValue,
      PassVerificationAnswer,
    };

    if (userName === "" || emailValue === "" || userPassword === "") {
      let message = "Please fill out the following fields: ";
      if (userName === "") message += "Name ";
      if (emailValue === "") message += "Email ";
      if (userPassword === "") message += "Password ";
      if (PassVerificationAnswer === "") message += "Verification ";
      setAlert({ type: "danger", message: message.trim() });
      return;
    }

    if (!emailRegex.test(emailValue)) {
      setAlert({ type: "danger", message: "Invalid email format" });
      return;
    }

    if (userPassword.length < 3) {
      setAlert({
        type: "danger",
        message: "Enter a password with more than 10 characters",
      });
      return;
    }

    if (nameRef.current) nameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
    if (verifyRef.current) verifyRef.current.value = "";
    handleDatabaseInjection(userValues);
    setAlert(null);
  };

  const handleCloseDetails = () => {
    setModalShow(false);
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${NightCity})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.height = "";
    };
  }, []);

  const handleDatabaseInjection = async (userValues: userCredentials) => {
    setLoading(true);
    axios
      .post("https://localhost:7273/api/User/CreateNewUser", {
        UserName: userValues.userName,
        UserEmail: userValues.emailValue,
        UserPassword: userValues.userPassword,
        IsAdmin: userValues.adminValue,
        PassVerificationAnswer: userValues.PassVerificationAnswer,
      })
      .then((response) => {
        setModalType("success");
        setModalShow(true);
        secureLocalStorage.setItem(key, response.data.token);
        console.log(response.data.token);
      })
      .catch((error) => {
        setErrorDisplay(error.message);
        setModalType("error");
        setModalShow(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Container className={classes.container}>
      {loading && (
        <div className={classes.loader}>
          <HashLoader color="#a80e0e" size={100} speedMultiplier={1.3} />{" "}
        </div>
      )}
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
        <Row className="justify-content-start align-items-center mt-5">
          <Col md={7} lg={4} className={classes.formsContainer}>
            <Form
              className={classes.formPosition}
              onSubmit={validationUserInfo}
            >
              <Form.Group className={classes.formGroup}>
                <div className={classes.logoContainer}>
                  <img
                    src={userLogo}
                    alt="user_logo"
                    className={classes.minimisedLogo}
                  />
                </div>
                <Form.Control
                  type="text"
                  ref={nameRef}
                  placeholder="Username"
                  className={classes.inputElements}
                />
              </Form.Group>
              <Form.Group className={classes.formGroup}>
                <div className={classes.logoContainer}>
                  <img
                    src={emailLogo}
                    alt="email_logo"
                    className={classes.minimisedLogo}
                  />
                </div>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  placeholder="Email"
                  className={classes.inputElements}
                />
              </Form.Group>
              <Form.Group className={classes.formGroup}>
                <div className={classes.logoContainer}>
                  <img
                    src={passwordLogo}
                    alt="password_logo"
                    className={classes.minimisedLogo}
                  />
                </div>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Password"
                  className={classes.inputElements}
                />
              </Form.Group>
              <Form.Group className={classes.formGroup}>
                <div className={classes.logoContainer}>
                  <img
                    src={passwordLogo}
                    alt="password_logo"
                    className={classes.minimisedLogo}
                  />
                </div>
                <Form.Control
                  type="text"
                  ref={verifyRef}
                  placeholder="What is your best friend's first name?"
                  className={classes.inputElements}
                />
              </Form.Group>
              <Form.Check
                type="switch"
                label="Are you an administrator?"
                ref={adminRef}
                className={classes.switch}
              />
              <br />
              <Button
                variant="primary"
                type="submit"
                className={classes.buttonRegister}
              >
                Register
              </Button>
              <br />
              <div className={classes.flexedElements}>
                <h5 className={classes.text}>Already have an account?</h5>
                <Link to="/">
                  <Button
                    variant="primary"
                    type="submit"
                    className={classes.buttonRegister}
                  >
                    Login Now
                  </Button>
                </Link>
              </div>
            </Form>
          </Col>
          <Col md={6} className="d-none d-md-block">
            <LoginRightSide />
          </Col>
        </Row>
      </div>
    </Container>
  );
};
export default Login;
