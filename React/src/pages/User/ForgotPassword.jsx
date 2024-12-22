import React, { useState } from "react";
import userServices from "../../services/userServices";
import { Link } from "react-router-dom";
import "./styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendToken = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await userServices.forgotPassword(email);
      setMessage("A reset link has been sent to your email.");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send reset link.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
            <h1 className="text-center">Forgot Password</h1>
            <p className="text-center text-secondary">
              Enter your email to reset your password.
            </p>
            <div className="row m-0 p-0 justify-content-start justify-content-md-center">
              <div className="col col-md-8">
                <hr />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendToken();
                  }}
                  noValidate
                >
                  {message && (
                    <div className="alert alert-success" role="alert">
                      {message}
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn"
                      style={{ backgroundColor: "#efc81a", color: "white" }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <p className="text-center mt-3">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="text-decoration-none"
                style={{ color: "#efc81a" }}
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
