import { Button, Container, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

import classes from "./Modal.module.css";

type ModalProps = {
  visibility: boolean;
  handleClose: () => void;
  modalType: string;
  errorDisplayProp: string;
};

const ModalComponent: React.FC<ModalProps> = ({ visibility, modalType, handleClose, errorDisplayProp }) => {
  return (
    <Modal show={visibility} onHide={handleClose}>
      <Modal.Header closeButton className="bg-dark">
        <Modal.Title>
          {modalType === "success" ? (
            <p className={classes.lightText}>Congratulations!</p>
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
        ) : (
          <div className="bg-dark">
            <p className={classes.lightText}> An unexpected error occurred: {errorDisplayProp}</p>
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
