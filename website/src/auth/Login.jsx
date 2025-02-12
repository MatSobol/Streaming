import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useSignIn } from "react-auth-kit";
import { Button, Container, FloatingLabel, Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { successAlert, failAlert } from "@/store/slices/alertSlice";

import { useNavigate, useLocation } from "react-router-dom";
import "./login.css";

export const Login = () => {
  const dispatch = useDispatch();
  const authUrl =
    import.meta.env.VITE_SERVER_URL +
    import.meta.env.VITE_REST_API_PORT +
    import.meta.env.VITE_AUTH_ENDPOINT;
  const navigate = useNavigate();
  const signIn = useSignIn();
  const location = useLocation();
  const fail = (e) => {
    if (e?.response?.data) {
      dispatch(failAlert(e.response.data.Response));
    } else {
      dispatch(failAlert("Problem with server"));
    }
  };

  const success = (response) => {
    dispatch(successAlert("Login succesful"));
    const accessRight = response.data.AccessRight
      ? response.data.AccessRight
      : 0;
    signIn({
      token: response.data.Token,
      tokenType: "Bearer",
      expiresIn: 1440,
      authState: { name: response.data.Name, accessRight: accessRight },
    });
    setTimeout(() => {
      if (location?.state?.from) navigate(location.state.from);
      else if (window.location.pathname === "/login") {
        navigate("/");
      }
    }, 1400);
  };

  const loginFacebook = async (accessToken) => {
    try {
      const response = await axios.post(authUrl + "/facebook", {
        accessToken: accessToken,
      });
      success(response);
    } catch (e) {
      fail(e);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const response = await axios.post(authUrl + "/google", {
          accessToken: code,
        });
        success(response);
      } catch (e) {
        fail(e);
      }
    },
    flow: "auth-code",
  });

  const login = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target),
      formDataObj = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(authUrl + "/login", {
        email: formDataObj.email,
        password: formDataObj.password,
      });
      success(response);
    } catch (e) {
      fail(e);
    }
  };

  const togglePaswordDisplay = (e) => {
    var element = e.target;
    element.classList.toggle("bi-eye");
    var password = document.getElementById("PasswordInput");
    let value = password.type === "text" ? "password" : "text";
    password.type = value;
  };

  return (
    <>
      <Container className="d-flex justify-content-center mt-4">
        <Card className="text-center" style={{ width: "19rem" }}>
          <Card.Header>Login</Card.Header>
          <Card.Body>
            <Form onSubmit={login}>
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
                  className="position-relative"
                  type="password"
                  placeholder="Password"
                  id="PasswordInput"
                  required
                />
                <i
                  className="bi bi-eye-slash position-absolute eye"
                  id="togglePassword"
                  onClick={togglePaswordDisplay}
                ></i>
              </FloatingLabel>
              <Button className="btn btn-primary w-100 mt-4" type="submit">
                Login
              </Button>
            </Form>
            <p className="d-block mt-2 mb-0">
              No account?
              <Link
                to="/register"
                state={{ from: location?.state?.from }}
                className="ms-1"
              >
                Register
              </Link>
            </p>
            <span className="d-block text-center my-3 text-muted">
              ——————— or ———————
            </span>
            <Button
              className="googleButton btn btn-danger w-100 mt-1"
              onClick={() => loginGoogle()}
            >
              <i className="googleIcon bi bi-google me-2 h10 vertical-align-middle"></i>
              Login with Google
            </Button>
            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_KEY}
              className="facebookButton btn w-100 mt-3"
              onSuccess={(response) => {
                loginFacebook(response.accessToken);
              }}
            >
              <i className="facebookIcon bi bi-facebook me-2 h10 vertical-align-middle"></i>
              Login with Facebook
            </FacebookLogin>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
