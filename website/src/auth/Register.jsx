import { useNavigate } from "react-router-dom";
import { Button, Container, FloatingLabel, Form, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSignIn } from "react-auth-kit";

import { useDispatch } from "react-redux";
import { successAlert, failAlert } from "@/store/slices/alertSlice";

import axios from "axios";
import "./register.css";

export const Register = () => {
  const authUrl =
    import.meta.env.VITE_SERVER_URL +
    import.meta.env.VITE_REST_API_PORT +
    import.meta.env.VITE_AUTH_ENDPOINT;
  const navigate = useNavigate();
  const signIn = useSignIn();
  const location = useLocation();
  const dispatch = useDispatch();

  const register = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target),
      formDataObj = Object.fromEntries(formData.entries());

    if (formDataObj.password !== formDataObj.repeat_password) {
      dispatch(failAlert("Passwords aren't the same"));
      return;
    }

    try {
      const response = await axios.post(authUrl + "/register", {
        username: formDataObj.username,
        email: formDataObj.email,
        password: formDataObj.password,
        repeat_password: formDataObj.repeat_password,
      });

      signIn({
        token: response.data.Token,
        tokenType: "Bearer",
        expiresIn: 1440,
        authState: { name: response.data.Name, accessRight: 0 },
      });

      dispatch(successAlert("Registration successfull"));
      setTimeout(() => {
        if (location?.state?.from) navigate(location.state.from);
        else navigate("/");
      }, 1400);
    } catch (e) {
      if (e?.response?.data) {
        dispatch(failAlert(e.response.data.Response));
      } else {
        dispatch(failAlert("Problem with server"));
      }
    }
  };

  const togglePaswordDisplay = () => {
    var password = document.getElementById("PasswordInput");
    var repeatPassword = document.getElementById("RepeatPasswordInput");
    let value = password.type === "text" ? "password" : "text";
    password.type = value;
    repeatPassword.type = value;
  };

  return (
    <>
      <Container className="d-flex justify-content-center mt-4 z-1">
        <Card className="text-center" style={{ width: "19rem" }}>
          <Card.Header>Register</Card.Header>
          <Card.Body>
            <Form onSubmit={register}>
              <FloatingLabel
                controlId="floatingInputName"
                label="Username"
                className="mb-3"
              >
                <Form.Control
                  name="username"
                  type="text"
                  placeholder="name"
                  required
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label="Email adress"
                className="mb-3"
              >
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </FloatingLabel>
              <FloatingLabel label="Password">
                <Form.Control
                  name="password"
                  className="position-relative mb-3"
                  type="password"
                  placeholder="Password"
                  id="PasswordInput"
                  required
                />
              </FloatingLabel>
              <FloatingLabel label="Repeated password">
                <Form.Control
                  name="repeat_password"
                  className="position-relative"
                  type="password"
                  placeholder="Password"
                  id="RepeatPasswordInput"
                  required
                />
              </FloatingLabel>
              <div className="d-flex justify-content-start mt-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                  onClick={togglePaswordDisplay}
                />
                <label class="form-check-label ms-2" for="flexCheckDefault">
                  Show password
                </label>
              </div>
              <Button className="btn btn-primary w-100 mt-3" type="submit">
                Register
              </Button>
            </Form>
            <p className="d-block mt-2 mb-0">
              Have an account
              <Link
                to="/login"
                state={{ from: location?.state?.from }}
                className="ms-1"
              >
                Login
              </Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
