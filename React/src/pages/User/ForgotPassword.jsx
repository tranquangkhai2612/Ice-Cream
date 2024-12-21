import React, { useState } from "react";
import userServices from "../../services/userServices";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSendToken = async (e) => {
    e.preventDefault();
    try {
      const response = await userServices.forgotPassword(email);
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
    </div>
  );
}

export default ForgotPassword;
