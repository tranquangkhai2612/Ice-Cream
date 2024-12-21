import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userServices from "../../services/userServices";

function ResetPassword() {
  const { email, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await userServices.resetPassword({
        email,
        token,
        newPassword,
      });

      setMessage(response);
      setError(null);

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage(null);
      setError(err.response?.data || "Failed to reset password.");
    }
  };

  return (
    <div>
      <h3>Create New Password</h3>
      <div>
        <div className="row flex-column flex-md-row">
          <div className="col p-4 vh-100 left-col d-flex justify-content-center align-items-center">
            <img
              className="image-fluid w-25 animate__animated animate__fadeInUp"
              src="./img/Group-697.webp"
              alt="Mama-Recipe-Logo"
            />
          </div>
          <div className="col p-4 d-flex flex-column justify-content-center m-0 animate__animated animate__fadeInDown">
            <div className="row m-0 p-0 justify-content-start justify-content-md-center">
              <div className="col col-md-8">
                {message && (
                  <div className="alert alert-success">{message}</div>
                )}
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Reset Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
