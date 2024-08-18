import { Button, Col, Container, Row, ToastContainer } from "react-bootstrap";
import classes from "./Login.module.css";
import React, { useEffect, useRef, useState } from "react";
import NightCity from "../../assets/NightCity.jpg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ModalComponent from "../Modal/Modal";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

type resetValuesTemplate = {
  userName: string;
  userPassword: string;
  confirmPassword: string;
  passVerificationAnswer: string;
};

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<resetValuesTemplate>();
  const usernameRef = useRef<HTMLInputElement>(null);
  const verificationRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [errorDisplay, setErrorDisplay] = useState<string>("");

  useEffect(() => {
    document.body.style.backgroundImage = `url(${NightCity})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.height = "100vh";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.height = "";
    };
  }, []);

  const navigate = useNavigate();

  const handleCloseDetails = () => {
    setModalShow(false);
  };

  const onSubmit = (data: resetValuesTemplate) => {
    setLoading(true);
    axios
      .post("https://localhost:7273/api/User/UpdatingPassword", {
        UserName: data.userName,
        UserPassword: data.userPassword,
        PassVerificationAnswer: data.passVerificationAnswer,
      })
      .then((response) => {
        if (response.status === 200) {
          navigate("/homepage");
          toast.success("You have successfully reset your password. Welcome to your account.");
        }
        
      })
      .catch((error) => {        
        setErrorDisplay("Wrong verification answer.");
        setModalType("error");
        setModalShow(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      {loading ? (
        <div className={classes.loader}>
          <HashLoader color="#a80e0e" size={100} speedMultiplier={1.3} />
        </div>
      ) : null}
      <Container fluid className={classes.componentContainer}>
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
              <h1 className={`display-4 ${classes.title}`}>Reset your password!</h1>
              <br />
              <div className={classes.logoContainer}>
                <i className="bi bi-person-circle" style={{ color: "#ffc107", fontSize: "26px" }}></i>
                <input
                  type="text"
                  className={classes.inputElements}
                  placeholder="Enter your username"
                  {...register("userName", {
                    required: "Please enter your username",
                  })}
                />
              </div>
              {errors.userName && <p className={classes.errorMessage}>{errors.userName.message}</p>}
              <div className={classes.logoContainer}>
                <i className="bi bi-key-fill" style={{ color: "#ffc107", fontSize: "26px" }}></i>
                <input
                  type="password"
                  className={classes.inputElements}
                  placeholder="Enter your new password"
                  {...register("userPassword", {
                    required: "Please enter your new password",
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
                <i className="bi bi-key-fill" style={{ color: "#ffc107", fontSize: "26px" }}></i>
                <input
                  type="password"
                  className={classes.inputElements}
                  placeholder="Re-enter your new password"
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
                  className={`${classes.inputElements} ${errors.userPassword ? 'inputError' : ''}`}
                  placeholder="What was your best friend's first name?"
                  {...register("passVerificationAnswer", {
                    required: "Please enter your verification answer",
                  })}
                />
              </div>
              {errors.passVerificationAnswer && (
                <p className={classes.errorMessage}>{errors.passVerificationAnswer.message}</p>
              )}
              <Button variant="outline-warning" type="submit" className={classes.submitButton}>
                Reset Password
              </Button>
              <br />
              <div>
                <Link to="/login" className={classes.linkElement}>
                  Back to Login
                </Link>
              </div>
            </form>
          </Col>
          <Col xs={0} lg={8} xl={8} className={`d-none d-lg-block ${classes.rightSide}`}></Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
