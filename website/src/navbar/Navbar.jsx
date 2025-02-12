import React from "react";
import { useState, useRef, useEffect } from "react";
import { Button, Navbar, Container, Nav } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useIsAuthenticated, useSignOut, useAuthUser } from "react-auth-kit";
import "bootstrap";
import "bootstrap/dist/js/bootstrap.min.js";
import "./navbar.css";

export const MyNavbar = () => {
  const auth = useIsAuthenticated();
  const signout = useSignOut();
  const navigate = useNavigate();
  const navbar = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  const logOut = () => {
    signout();
    navigate("/");
  };
  const handleClickOutside = (event) => {
    if (navbar.current && !navbar.current.contains(event.target)) {
      setCollapsed(false);
    }
  };
  const changeCollapse = () => {
    setCollapsed(!collapsed);
  };
  const hide = () => {
    setCollapsed(false);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Navbar
      fixed="top"
      expand="lg"
      className="bg-body-tertiary"
      ref={navbar}
      expanded={collapsed}
      style={{ position: "relative" }}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" onClick={hide}>
          BlogHub
        </Navbar.Brand>
        <div className="d-flex justify-content-center">
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={changeCollapse}
          />
        </div>

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="me-auto d-lg-flex">
            <Nav className="mx-2">
              <Nav.Link as={NavLink} to="/" onClick={hide}>
                Home
              </Nav.Link>
            </Nav>
            <Nav className="mx-2">
              <Nav.Link as={NavLink} to="/browse" onClick={hide}>
                Browse
              </Nav.Link>
            </Nav>
            <Nav className="mx-2">
              <Nav.Link as={NavLink} to="/stream" onClick={hide}>
                Stream
              </Nav.Link>
            </Nav>
            <Nav className="mx-2">
              <Nav.Link as={NavLink} to="/account" onClick={hide}>
                Account
              </Nav.Link>
            </Nav>
          </div>
          <Nav className="me-right ">
            <div className="d-flex justify-content-center">
              {!auth() ? (
                <Link
                  to="/login"
                  className="text-decoration-none"
                  onClick={hide}
                >
                  <Button
                    variant="outline-primary ms-0 ms-lg-2 rounded"
                    id="buttonLogin"
                  >
                    Login
                  </Button>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-decoration-none"
                  onClick={hide}
                >
                  <Button
                    variant="outline-primary ms-0 ms-lg-2 rounded"
                    id="buttonLogin"
                    onClick={logOut}
                  >
                    Logout
                  </Button>
                </Link>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
