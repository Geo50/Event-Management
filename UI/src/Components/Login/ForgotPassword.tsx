import { Button, Container, Row } from "react-bootstrap";
import classes from "./Login.module.css";
import React, { useEffect, useRef, useState } from "react";
import NightCity from "../../assets/NightCity.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../Modal/Modal";
import { HashLoader } from "react-spinners";

type resetValuesTemplate = {
  UserName: string;
  UserPassword: string;
  PassVerificationAnswer: string;
};

const ForgotPassword: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const verificationRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [errorDisplay, setErrorDisplay] = useState<string>("");

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

  const UserName = usernameRef.current?.value || "";
  const UserPassword = passwordRef.current?.value || "";
  const PassVerificationAnswer = passwordRef.current?.value || "";

  const resetValues: resetValuesTemplate = {
    UserName,
    UserPassword,
    PassVerificationAnswer,
  };
  const navigate = useNavigate();

  const handleCloseDetails = () => {
    setModalShow(false);
  };

  const handleDatabaseInjection = (resetValues: resetValuesTemplate) => {
    setLoading(true);
    axios
      .post("https://localhost:7273/api/User/UpdatingPassword", {
        UserName: resetValues.UserName,
        UserPassword: resetValues.UserPassword,
        PassVerificationAnswer: resetValues.PassVerificationAnswer
      })
      .then((response) => {
        if (response.status === 200) {
          navigate("/homescreen");
        }
      })
      .catch((error) => {
        debugger;
        setErrorDisplay(error.message);
        setModalType("error");
        setModalShow(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleDatabaseInjection(resetValues);
  };

  return (
    <Container fluid className={classes.componentContainer_centered}>
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
      <div className={classes.formBackground}>
        <form className={classes.formContainer} onSubmit={handleSubmit}>
          <h1 className={`display-4 ${classes.title}`}>Reset your password!</h1>
          <Row>
            <div className={classes.logoContainer}>
              <input
                type="text"
                className={classes.inputElements}
                placeholder="Enter your username"
                ref={usernameRef}
              />
            </div>
          </Row>
          <Row>
            <div className={classes.logoContainer}>
              <input
                type="password"
                className={classes.inputElements}
                placeholder="Enter your new password"
                ref={passwordRef}
              />
            </div>
          </Row>
          <Row>
            <div className={classes.logoContainer}>
              <input
                type="password"
                className={classes.inputElements}
                placeholder="Re-enter your new password"
              />
            </div>
          </Row>
          <Row>
            <div className={classes.logoContainer}>
              <input
                type="text"
                className={classes.inputElements}
                placeholder="What was your best friend's first name?"
                ref={verificationRef}
              />
            </div>
          </Row>
          <Row>
            <div>
              <Button
                variant="outline-danger"
                className={classes.resetPassword}
                type="submit"
              >
                Reset Password
              </Button>
            </div>
          </Row>
        </form>
      </div>
    </Container>
  );
};

export default ForgotPassword;
