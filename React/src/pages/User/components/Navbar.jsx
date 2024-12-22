import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); 
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg pt-4 animate__animated animate__fadeInDown">
        <div className="container container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-4 fw-semibold text-center">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  to="/"
                  style={{ color: "#2e266f" }}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/product"
                  style={{ color: "#2e266f" }}
                >
                  Product
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/about-us"
                  style={{ color: "#2e266f" }}
                >
                  About-Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/contact-us"
                  style={{ color: "#2e266f" }}
                >
                  Contact Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/order"
                  style={{ color: "#2e266f" }}
                >
                  Order
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/profile"
                  style={{ color: "#2e266f" }}
                >
                  Profile
                </Link>
              </li>
              <li className="nav-item d-lg-none d-block">
                {isAuthenticated ? (
                  <Link
                    className="nav-link"
                    onClick={handleLogout}
                    style={{ color: "#2e266f" }}
                  >
                    Logout
                  </Link>
                ) : (
                  <Link
                    className="nav-link"
                    to="/login"
                    style={{ color: "#2e266f" }}
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
            <div>
              {isAuthenticated ? (
                <Link
                  onClick={handleLogout}
                  className="text-decoration-none d-flex justify-content-end align-items-center gap-3 d-lg-flex d-none fw-semibold"
                  style={{ color: "#2e266f" }}
                >
                  <img
                    src="./img/user-icon.webp"
                    alt="user-icon"
                    style={{ width: "15%" }}
                  />
                  Logout
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-decoration-none d-flex justify-content-end align-items-center gap-3 d-lg-flex d-none fw-semibold"
                  style={{ color: "#2e266f" }}
                >
                  <img
                    src="./img/user-icon.webp"
                    alt="user-icon"
                    style={{ width: "15%" }}
                  />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
