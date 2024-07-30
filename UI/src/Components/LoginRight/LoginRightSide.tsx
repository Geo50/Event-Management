import { Container, Row, Col } from "react-bootstrap";
import eventpicture from "../../../public/event-login.png.jpg";

import classes from "./LoginRight.module.css";

const LoginRightSide: React.FC = () => {
  return (
    <div>
      <Container className={classes.container}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div></div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginRightSide;
