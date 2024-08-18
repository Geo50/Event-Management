import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { PuffLoader } from "react-spinners";
import { key } from "../../App";
import EventLogin from "../../assets/event-login.png.jpg";
import ModalComponent from "../Modal/Modal";
import classes from "./Login.module.css";

type UserCredentials = {
  userName: string;
  userPassword: string;
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [errorDisplay, setErrorDisplay] = useState<string>("");
  const [modalType, setModalType] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserCredentials>();

  const onSubmit = async (data: UserCredentials) => {
    setLoading(true);
    try {
      const response = await axios.post("https://localhost:7273/api/User/VerifyLoginAccount", {
        UserName: data.userName,
        UserPassword: data.userPassword,
      });
      navigate("/homepage");
      secureLocalStorage.setItem(key, response.data.token);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setModalType("account-not-exist");
      } else {
        setErrorDisplay(error.message);
        setModalType("error");
      }
      setModalShow(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url (${EventLogin})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.height = "100vh";
  });

  const navigate = useNavigate();

  const handleCloseDetails = useCallback((): void => {
    setModalShow(false);
  }, []);

  return (
    <div>
      {loading ? (
        <div className={classes.loader}>
          <PuffLoader color="var(--login-orange)" size={130} />
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
              <h1 className={`display-4 ${classes.title}`}>Catch up now! </h1>
              <br />
              <h1 className={`display-6 ${classes.subTitle}`}>Login to your account</h1>
              <br />
              <div className={classes.logoContainer}>
                <i className="bi bi-person-circle" style={{ color: "#ffc107", fontSize: "26px" }}></i>
                <input
                  type="text"
                  className={classes.inputElements}
                  placeholder="Username"
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
                  placeholder="Password"
                  {...register("userPassword", {
                    required: "Please enter your password",
                    // pattern: {
                    //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    //   message:
                    //     "Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character",
                    // },
                  })}
                />
              </div>
              {errors.userPassword && <p className={classes.errorMessage}>{errors.userPassword.message}</p>}
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
                <p className={classes.linkText}>
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
