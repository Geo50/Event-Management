import { Button, Container, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import classes from "./Modal.module.css";

type ModalProps = {
  visibility: boolean;
  handleClose: () => void;
  modalType: string;
  errorDisplayProp: string;
};

const ModalComponent: React.FC<ModalProps> = ({
  visibility,
  modalType,
  handleClose,
  errorDisplayProp,
}) => {
  return (
    <Modal show={visibility} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalType === "success" ? "Congratulations!" : "Sorry!"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalType === "success" ? (
          <div>
            You have been successfully registered to your favorite event
            management website.
            <Modal.Footer>
              <Button variant="success" onClick={handleClose}>
                Explore Events
              </Button>
            </Modal.Footer>
          </div>
        ) : modalType === "account-not-exist" ? (
          <div>
            Your account does not exist, please check your credentials or
            create a new account.
          </div>
        ) : (
          <div>
            An unexpected error occurred: {errorDisplayProp}
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Try Again
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {modalType === "account-not-exist" && (
          <Container>
            <div className={classes.flexContainer}>
              <Link to="/registration">
                <Button variant="primary" onClick={handleClose}>
                  Create Account
                </Button>
              </Link>
              <Button variant="danger" onClick={handleClose}>
                Try Again
              </Button>
            </div>
          </Container>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
