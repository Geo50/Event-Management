import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useCallback, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ModalComponent from "../Modal/Modal";
import classes from "./Registration.module.css";

const key = "abcdefgh12345678dsadasdlsamdplmasdmpasmfa";

type userCredentials = {
  userName: string;
  emailValue: string;
  userPassword: string;
  adminValue: boolean;
  PassVerificationAnswer: string;
};

const Registration: React.FC = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const adminRef = useRef<HTMLInputElement>(null);
  const verifyRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [errorDisplay, setErrorDisplay] = useState<string>("");
  const navigate = useNavigate();

  const validationUserInfo = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    const userName = nameRef.current?.value || "";
    const emailValue = emailRef.current?.value || "";
    const userPassword = passwordRef.current?.value || "";
    const adminValue = adminRef.current?.checked || false;
    const PassVerificationAnswer = verifyRef.current?.value || "";

    let isValid = true;

    if (userName === "") {
      nameRef.current?.classList.add(classes.inputError);
      toast.error("Please enter a valid username ");
      isValid = false;
    } else {
      nameRef.current?.classList.remove(classes.inputError);
    }

    if (!emailRegex.test(emailValue)) {
      emailRef.current?.classList.add(classes.inputError);
      toast.error("Please enter a valid email address");
      isValid = false;
    } else if (emailValue === "") {
      toast.error("Please enter an email address");
      isValid = false;
    } else {
      emailRef.current?.classList.remove(classes.inputError);
    }

    if (userPassword === "") {
      passwordRef.current?.classList.add(classes.inputError);
      toast.error("Please enter a password");
      isValid = false;
    } else if (userPassword.length < 10) {
      passwordRef.current?.classList.add(classes.inputError);
      toast.error("Please enter a password with more than 10 characters");
      isValid = false;
    } else {
      passwordRef.current?.classList.remove(classes.inputError);
    }

    if (PassVerificationAnswer === "") {
      verifyRef.current?.classList.add(classes.inputError);
      toast.error("Please enter a verification answer");
      isValid = false;
    } else {
      verifyRef.current?.classList.remove(classes.inputError);
    }

    const userValues: userCredentials = {
      userName,
      emailValue,
      userPassword,
      adminValue,
      PassVerificationAnswer,
    };

    if (isValid) {
      handleDatabaseInjection(userValues);
    }
  }, []);

  const handleCloseDetails = useCallback(() => {
    setModalShow(false);
  }, []);

  const handleDatabaseInjection = useCallback(
    async (userValues: userCredentials) => {
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
          secureLocalStorage.setItem(key, response.data.token);
          navigate("/homepage");
        })
        .catch((error) => {
          if (error.response && error.response.data.includes("User already exists.")) {
            toast.error("Your account already exists.");
          } else {
            setErrorDisplay(error.message);
            setModalType("error");
            setModalShow(true);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [navigate]
  );

  return (
    <div>
      
      <Container fluid className={classes.componentContainer}>
        {loading && (
        <div className={classes.loader}>
          <PuffLoader color="var(--registration-blue)" size={130} />
        </div>
      )}
        <Row className={classes.rowProperties}>
          <Col xs={12} lg={4} xl={4} className={classes.firstColumn}>
            {modalShow && (
              <ModalComponent
                visibility={modalShow}
                modalType={modalType}
                errorDisplayProp={errorDisplay}
                handleClose={handleCloseDetails}
                eventIdProp={0}
              />
            )}
            <form className={classes.formContainer} onSubmit={validationUserInfo}>
              <h1 className={`display-4 ${classes.title}`}>Jump into the action</h1>
              <br />
              <h1 className={`display-6 ${classes.subTitle}`}>Sign up!</h1>
              <br />
              <div className={classes.logoContainer}>
                <i className={`bi bi-person-circle ${classes.iconClass}`}></i>
                <input type="text" ref={nameRef} placeholder="Username" className={classes.inputElements} />
              </div>
              <div className={classes.logoContainer}>
                <i className={`bi bi-envelope-at-fill ${classes.iconClass}`}></i>
                <input type="text" ref={emailRef} placeholder="Email" className={classes.inputElements} />
              </div>
              <div className={classes.logoContainer}>
                <i className={`bi bi-key-fill ${classes.iconClass}`}></i>
                <input type="password" ref={passwordRef} placeholder="Password" className={classes.inputElements} />
              </div>
              <div className={classes.logoContainer}>
                <i className={`${classes.iconClass} bi bi-incognito`}></i>
                <input
                  type="text"
                  ref={verifyRef}
                  placeholder="What is your best friend's name?"
                  className={classes.inputElements}
                />
              </div>
              <div className={classes.flexedElements}>
                <p className={classes.linkText}>Are you an administrator? </p>
                <Form.Check type="switch" ref={adminRef} className={classes.switch} />
              </div>
              <Button variant="outline-primary" type="submit" className={classes.submitButton}>
                Register
              </Button>
              <div>
                <p className={classes.linkText}>
                  Already have an account?
                  <Link to="/login" className={classes.linkElement}>
                    {" "}
                    Login Now
                  </Link>
                </p>
              </div>
            </form>
          </Col>
          <Col xs={0} lg={8} xl={8} className={`d-none d-lg-block ${classes.rightSide}`}></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Registration;
