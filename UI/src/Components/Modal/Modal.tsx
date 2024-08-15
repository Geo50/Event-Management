import { Button, Container, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import classes from "./Modal.module.css";

type ModalProps = {
  visibility: boolean;
  handleClose: () => void;
  modalType: string;
  errorDisplayProp: string;
  eventIdProp: number;
};


const ModalComponent: React.FC<ModalProps> = ({
  visibility,
  modalType,
  handleClose,
  errorDisplayProp,
  eventIdProp,
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/create-ticket", {
      state: {
        eventid: eventIdProp
      },
    });
  };

  const multipleFunctions = () => {
    handleNavigation();
    console.log("Event ID in Modal:", eventIdProp);
  };

  return (
    <Modal show={visibility} onHide={handleClose}>
      <Modal.Header closeButton className="bg-dark">
      <Modal.Title>
        {modalType === "success" ? (
          <p className={classes.lightText}>Congratulations!</p>
        ) : modalType === "Create Event" ? (
          <p className={classes.lightText}>Success!</p>
        ) : modalType === "Confirmation" ? (
          <p className={classes.lightText}>Are you sure?</p>
        ) : (
          <p className={classes.lightText}>Sorry</p>
        )}
      </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark">
      {modalType === "success" ? (
        <div>
          You have been successfully registered to your favorite event management website.
          <Modal.Footer>
            <Button variant="success" onClick={handleClose}>
              Explore Events
            </Button>
          </Modal.Footer>
        </div>
      ) : modalType === "account-not-exist" ? (
        <div className="bg-dark">
          <p className={classes.lightText}>
            Your account does not exist, please check your credentials or create a new account.
          </p>
        </div>
      ) : modalType === "Create Event" ? (
        <div>
          <p className={classes.lightText}>
            You have successfully created your new event. Would you like to create tickets for it?
          </p>
          <Modal.Footer>
            <Button variant="success" onClick={multipleFunctions}>
              Yes
            </Button>
            <Link to="/homepage">
              <Button variant="primary">Go to homepage</Button>
            </Link>
          </Modal.Footer>
        </div>
      ) : modalType === "Confirmation" ? (
        <div className="bg-dark">
          <p className={classes.lightText}>This is an irreversible action, you cannot edit your tickets after creating it! {errorDisplayProp}</p>
          <Modal.Footer>
            <Button variant="outline-success" onClick={handleClose}>
              Confirm
            </Button>
            <Button variant="outline-danger" onClick={handleClose}>
              Go back
            </Button>
          </Modal.Footer>
        </div>
      ) : (
        <div className="bg-dark">
          <p className={classes.lightText}>An unexpected error occurred: {errorDisplayProp}</p>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={handleClose}>
              Try Again
            </Button>
          </Modal.Footer>
        </div>
      )}
    </Modal.Body>
      {modalType === "account-not-exist" && (
        <Modal.Footer className="bg-dark">
          <Container>
            <div className={classes.flexContainer}>
              <Link to="/registration">
                <Button variant="outline-primary" onClick={handleClose}>
                  Create Account
                </Button>
              </Link>
              <Button variant="outline-danger" onClick={handleClose}>
                Try Again
              </Button>
            </div>
          </Container>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ModalComponent;
