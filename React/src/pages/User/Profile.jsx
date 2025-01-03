import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userServices from "../../services/userServices";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    setProfile(user);
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await userServices.resetPassword({
        username: profile.username,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      setMessage("Password changed successfully! Redirecting to login...");
      setError(null);

      // Redirect to login page after a short delay
      setTimeout(() => {
        localStorage.removeItem("user");
        navigate("/login");
      }, 3000);
    } catch (err) {
      setMessage(null);
      setError(err.response?.data || "Failed to change password.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5 mb-5">
        <div className="row justify-content-center pb-5">
          <div className="col text-center">
            <h3>{profile?.username || "User"}</h3>
            <p>Email: {profile?.email}</p>
            <p>Address: {profile?.address}</p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <hr />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <button
              className="btn btn-secondary mb-3"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              {showChangePassword ? "Cancel" : "Change Password"}
            </button>
          </div>
        </div>
        {showChangePassword && (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <h4>Change Password</h4>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label htmlFor="oldPassword" className="form-label">
                    Old Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="oldPassword"
                    placeholder="Enter Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
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
                    placeholder="Enter New Password"
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
                    placeholder="Enter Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
