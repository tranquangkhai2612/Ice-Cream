import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import userServices from "../../services/userServices";
import "./styles/Auth.css";

function ResetPassword() {
  const { email, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await userServices.resetPassword({
        email,
        token,
        newPassword,
      });

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data || "Failed to reset password.");
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
            <h1 className="text-center">Reset Password</h1>
            <div className="row m-0 p-0 justify-content-start justify-content-md-center">
              <div className="col col-md-8">
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
                <form onSubmit={handleResetPassword} noValidate>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      {isLoading ? "Resetting..." : "Reset Password"}
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
}

export default ResetPassword;
