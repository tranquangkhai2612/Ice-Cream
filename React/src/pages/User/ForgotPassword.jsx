import React, { useState } from "react";
import userServices from "../../services/userServices";
import "./styles/Auth.css"
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isStep1, setIsStep1] = useState(true);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSendToken = async (e) => {
    e.preventDefault();
    try {
      const response = await userServices.forgotPassword(email);
      setMessage(response);
      setError(null);
      setIsStep1(false); 
    } catch (err) {
      setMessage(null);
      setError(err.message);
    }
  };

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
    } catch (err) {
      setMessage(null);
      setError(err.message);
    }
  };

  return (
    <div>
      <h3>Forgot Password</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {isStep1 ? (
        <form onSubmit={handleSendToken}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Send Reset Link
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label htmlFor="token" className="form-label">
              Token
            </label>
            <input
              type="text"
              className="form-control"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
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
      )}
    </div>
  );
}

export default ForgotPassword;
