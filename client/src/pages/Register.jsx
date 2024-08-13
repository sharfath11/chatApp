import { Button, Col, Row, Stack, Form, Alert } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
const Register = () => {
  const {
    registerInfo,
    updateRegistretionInfo,
    isRegisterLoading,
    registerError,
    registerUser,
  } = useContext(AuthContext);
  return (
    <Form onSubmit={registerUser}>
      <Row
        style={{
          height: "100vh",
          justifyContent: "center",
          paddingTop: "10%",
        }}
      >
        <Col xs={6}>
          <Stack gap={3}>
            <h2 style={{color:"white"}}>Register</h2>
            {/* <h2>{user.name}</h2> */}
            <Form.Group controlId="formName">
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  updateRegistretionInfo({
                    ...registerInfo,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updateRegistretionInfo({
                    ...registerInfo,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updateRegistretionInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isRegisterLoading ? "Creating your account" : "Register"}
            </Button>
            {registerError?.error && (
              <Alert variant="danger">
                <p>{registerError?.message}</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Register;
