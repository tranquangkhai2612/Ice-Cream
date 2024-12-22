import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userServices from "./../../services/userServices"; 
import { Link } from "react-router-dom";
import './styles/Auth.css'

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [usernameErr, setUsernameErr] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validUsername = /^[A-Za-z0-9]{2,18}$/;
  const validPassword = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/;

  const validateInputs = () => {
    let isValid = true;

    if (!validUsername.test(username)) {
      setUsernameErr("Username must be 2-18 alphanumeric characters.");
      isValid = false;
    } else {
      setUsernameErr("");
    }

    if (!validPassword.test(password)) {
      setPwdError(
        "Password must be at least 6 characters, including letters and numbers."
      );
      isValid = false;
    } else {
      setPwdError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await userServices.login({ username, password });
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "Admin") {
        navigate("/index");
      } else {
        navigate("/profile", { state: { userId: user.id } });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      if (message === "Invalid username or password!") {
        setErrorMessage("Invalid username or password!");
      } else if (message === "Account is either inactive or blocked!") {
        setErrorMessage("Account is either inactive or blocked!");
      } else {
        setErrorMessage(message);
      }
    }
  };

  return (
    <div >

      <div className="overflow-hidden">
        <div className="row flex-column flex-md-row">
          <Link
            to="/"
            className="col p-4 vh-100 left-col d-flex justify-content-center align-items-center"
          >
            <img
              className="image-fluid w-25 animate__animated animate__fadeInUp"
              src="./img/Group-697.webp"
              alt="Mama-Recipe-Logo"
            />
          </Link>
          <div className="col p-4 d-flex flex-column justify-content-center m-0 animate__animated animate__fadeInDown">
            <h1 className="text-center">Welcome</h1>
            <div className="row m-0 p-0 justify-content-start justify-content-md-center">
              <div className="col col-md-8">
                <hr />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                  noValidate
                >
                  {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        usernameErr ? "is-invalid" : ""
                      }`}
                      id="username"
                      name="username"
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={() => validateInputs()}
                    />
                    {usernameErr && (
                      <div className="invalid-feedback">{usernameErr}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${pwdError ? "is-invalid" : ""}`}
                      id="password"
                      name="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => validateInputs()}
                    />
                    {pwdError && (
                      <div className="invalid-feedback">{pwdError}</div>
                    )}
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn"
                      style={{ backgroundColor: "#efc81a", color: "white" }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Submit"}
                    </button>
                  </div>

                  <p className="text-end fs-6 fw-medium mt-3">
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none text-black text-body-secondary"
                    >
                      Forgot Password?
                    </Link>
                  </p>
                </form>
              </div>
            </div>
            <p className="text-center mt-3">
              Don't have an account?
              <Link
                to="/register"
                className="text-decoration-none"
                style={{ color: "#efc81a" }}
              >
                {" "}
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
