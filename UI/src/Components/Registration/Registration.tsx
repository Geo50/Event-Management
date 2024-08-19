import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useCallback, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";

import ModalComponent from "../Modal/Modal";
import classes from "./Registration.module.css";

const key = "abcdefgh12345678dsadasdlsamdplmasdmpasmfa";

type userCredentials = {
  userName: string;
  userPassword: string;
  emailValue: string;
  confirmPassword: string;
  adminValue: boolean;
  PassVerificationAnswer: string;
};

const Registration: React.FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm<userCredentials>();

  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [errorDisplay, setErrorDisplay] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (data: userCredentials) => {
      setLoading(true);
      axios
        .post("https://localhost:7273/api/User/CreateNewUser", {
          UserName: data.userName,
          UserEmail: data.emailValue,
          UserPassword: data.userPassword,
          IsAdmin: data.adminValue,
          PassVerificationAnswer: data.PassVerificationAnswer,
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

  const handleCloseDetails = useCallback(() => {
    setModalShow(false);
  }, []);

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
            <form className={classes.formContainer} onSubmit={handleSubmit(onSubmit)}>
              <h1 className={`display-4 ${classes.title}`}>Jump into the action</h1>
              <br />
              <h1 className={`display-6 ${classes.subTitle}`}>Sign up!</h1>
              <br />
              <div className={classes.logoContainer}>
                <i className={`bi bi-person-circle ${classes.iconClass}`}></i>
                <input
                  type="text"
                  placeholder="Username"
                  className={`${classes.inputElements} ${errors.userName ? "inputError" : ""}`}
                  {...register("userName", {
                    required: "Please enter your username",
                  })}
                />
              </div>
              {errors.userName && <p className={classes.errorMessage}>{errors.userName.message}</p>}
              <div className={classes.logoContainer}>
                <i className={`bi bi-envelope-at-fill ${classes.iconClass}`}></i>
                <input
                  type="text"
                  placeholder="Email"
                  className={`${classes.inputElements} ${errors.userName ? "inputError" : ""}`}
                  {...register("emailValue", {
                    required: "Please enter your email address",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email",
                    },
                  })}
                />
              </div>
              {errors.emailValue && <p className={classes.errorMessage}>{errors.emailValue.message}</p>}
              <div className={classes.logoContainer}>
                <i className={`bi bi-key-fill ${classes.iconClass}`}></i>
                <input
                  type="password"
                  placeholder="Password"
                  className={classes.inputElements}
                  {...register("userPassword", {
                    required: "Please enter your password",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                      message:
                        "Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character",
                    },
                  })}
                />
              </div>
              {errors.userPassword && <p className={classes.errorMessage}>{errors.userPassword.message}</p>}
              <div className={classes.logoContainer}>
                <i className={`bi bi-key-fill ${classes.iconClass}`}></i>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={classes.inputElements}
                  {...register("confirmPassword", {
                    required: "Please reenter your password",
                    validate: (value) => value === getValues("userPassword") || "Password must match",
                  })}
                />
              </div>
              {errors.confirmPassword && <p className={classes.errorMessage}>{errors.confirmPassword.message}</p>}
              <div className={classes.logoContainer}>
                <i className="bi bi-question-circle-fill" style={{ color: "#ffc107", fontSize: "26px" }}></i>
                <input
                  type="text"
                  placeholder="What is your best friend's name?"
                  className={classes.inputElements}
                  {...register("PassVerificationAnswer", {
                    required: "Please enter your verification answer",
                  })}
                />
              </div>
              {errors.PassVerificationAnswer && (
                <p className={classes.errorMessage}>{errors.PassVerificationAnswer.message}</p>
              )}
              <div className={classes.flexedElements}>
                <p className={classes.linkText}>Are you an administrator? </p>
                <Form.Check type="switch" className={classes.switch} {...register("adminValue")} />
              </div>
              <Button variant="outline-warning" type="submit" className={classes.submitButton}>
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
