import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addAuth } from "../store/reducers/auth"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)

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
                  to="/add-recipe"
                  style={{ color: "#2e266f" }}
                >
                  Add Recipe
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
                {state?.auth ? (
                  <>
                    <Link
                      className="nav-link"
                      onClick={() => {
                        localStorage.clear()
                        dispatch(
                          addAuth({ auth: false, userData: {}, token: "" })
                        )
                        // window.location.href = "/"
                        navigate("/")
                      }}
                      style={{ color: "#2e266f" }}
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      className="nav-link"
                      to="/login"
                      style={{ color: "#2e266f" }}
                    >
                      Login
                    </Link>
                  </>
                )}
              </li>
            </ul>
            <div>
              {state?.auth ? (
                <>
                  <Link
                    onClick={() => {
                      localStorage.clear()
                      dispatch(
                        addAuth({ auth: false, userData: {}, token: "" })
                      )
                      navigate("/")
                    }}
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
