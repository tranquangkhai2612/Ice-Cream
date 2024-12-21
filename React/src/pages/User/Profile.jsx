import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userServices from "../../services/userServices";
import "./styles/Profile.css"
function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
      setMessage(response); 
      setError(null);
    } catch (err) {
      setMessage(null);
      setError(err.message); 
    }    
  };

  return (
    <div className="container py-5 mb-5">
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
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
