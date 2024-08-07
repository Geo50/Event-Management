import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import EventLogin from "../../assets/event-login.png.jpg"
import ModalComponent from "../Modal/Modal";
import classes from "./Login.module.css";

type UserCredentials = {
  userName: string;
  userPassword: string;
};


const key: string = "abcdefgh12345678dsadasdlsamdplmasdmpasmfa";

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [errorDisplay, setErrorDisplay] = useState<string>("");
  const [modalType, setModalType] = useState<string>("");

  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    document.body.style.backgroundImage=`url (${EventLogin})`
    document.body.style.backgroundSize = "cover";
    document.body.style.height = "100vh";
  })

  const navigate = useNavigate();

  const handleCloseDetails = useCallback((): void => {
    setModalShow(false);
  }, []);

  const handleDatabaseInjection = useCallback(
    (userValues: UserCredentials): void => {
      setLoading(true);
      axios
        .post("https://localhost:7273/api/User/VerifyLoginAccount", {
          UserName: userValues.userName,
          UserPassword: userValues.userPassword,
        })
        .then((response) => {
          toast.success("You have been logged in successfully");
          navigate("/homepage");
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
    },
    [navigate]
  );

  const inputValidation = useCallback(
    (event: React.FormEvent): void => {
      event.preventDefault();

      const userName = nameRef.current?.value || "";
      const userPassword = passwordRef.current?.value || "";
      let isValid: boolean = true;

      if (userName === "") {
        nameRef.current?.classList.add(classes.inputError);
        toast.error("Please enter a username");
        isValid = false;
      } else {
        nameRef.current?.classList.remove(classes.inputError);
      }

      if (userPassword === "") {
        passwordRef.current?.classList.add(classes.inputError);
        toast.error("Please enter a password");
        isValid = false;
      } else if (userPassword.length < 10) {
        toast.error("Please enter a password with more than 10 characters");
        passwordRef.current?.classList.add(classes.inputError);
        isValid = false;
      } else {
        passwordRef.current?.classList.remove(classes.inputError);
      }

      const userValues: UserCredentials = {
        userName,
        userPassword,
      };

      if (isValid) {
        handleDatabaseInjection(userValues);
      }
    },
    [handleDatabaseInjection]
  );

  return (
    <div>
      {loading ? (
        <div className={classes.loader}>
          <PuffLoader color="var(--login-orange)" size={130} />
        </div>
      ) : ( null)}
        <Container fluid className={classes.componentContainer}>
          
          <ToastContainer />
          <Row className={classes.rowProperties}>
            
            <Col xs={12} lg={4} xl={4} className={classes.firstColumn}>
              {modalShow && (
                <ModalComponent
                  visibility={modalShow}
                  modalType={modalType}
                  errorDisplayProp={errorDisplay}
                  handleClose={handleCloseDetails}
                />
              )}
              <form className={classes.formContainer} onSubmit={inputValidation}>
                <h1 className={`display-4 ${classes.title}`}>Catch up now! </h1>
                <br />
                <h1 className={`display-6 ${classes.subTitle}`}>Login to your account</h1>
                <br />
                <div className={classes.logoContainer}>
                  <i className="bi bi-person-circle" style={{ color: "#ffc107", fontSize: "26px" }}></i>
                  <input type="text" ref={nameRef} className={classes.inputElements} placeholder="Username" />
                </div>
                <div className={classes.logoContainer}>
                  <i className="bi bi-key-fill" style={{ color: "#ffc107", fontSize: "26px" }}></i>
                  <input type="password" ref={passwordRef} className={classes.inputElements} placeholder="Password" />
                </div>
                <Button variant="outline-warning" type="submit" className={classes.submitButton}>
                  Login
                </Button>
                <br />
                <div>
                  <Link to="/forgotpassword" className={classes.linkElement}>
                    Forgot Password?
                  </Link>
                </div>{" "}
                <br />
                <div>
                  <p className={classes.linkElement}>
                    {" "}
                    Don't have an account?
                    <Link to="/registration" className={classes.linkElement}>
                      {" "}
                      Create One
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

export default Login;
