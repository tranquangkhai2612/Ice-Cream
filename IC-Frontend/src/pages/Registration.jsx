import React from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"

import "../styles/Auth.css"

function Registration() {
  const navigate = useNavigate()

  const [email, setEmail] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleRegistration = () => {
    setIsLoading(true)
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/users`, {
        email: email,
        fullname: fullName,
        phoneNumber: phoneNumber,
        password: password,
      })
      .then((response) => {
        Swal.fire({
          title: "Registration Success!",
          text: "Registration Success! Please Login",
          icon: "success",
        }).then(() => {
          navigate("/login")
        })
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message ?? "Something wrong in our App!",
          icon: "error",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="overflow-x-hidden">
      <div className="row flex-column flex-md-row vh-100">
        <Link
          to="/"
          className="col p-4 left-col d-flex justify-content-center align-items-center"
        >
          <img
            className="image-fluid w-25 animate__animated animate__fadeInUp"
            src="./img/Group-697.webp"
            alt="Mama-Recipe-Logo"
          />
        </Link>
        <div className="col p-4 d-flex flex-column justify-content-center m-0 py-5 animate__animated animate__fadeInDown">
          <h1 className="text-center">Let's Get Started!</h1>
          <p className="text-center text-secondary">
            Create new account to access all features
          </p>
          <div className="row m-0 p-0 justify-content-start justify-content-md-center">
            <div className="col col-md-8">
              <hr />
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label for="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Name"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label for="email" className="form-label">
                    E-mail Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter email address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label for="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="08xxxxxxxxxx"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label for="createNewPassword" className="form-label">
                    Create New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="createNewPassword"
                    name="createNewPassword"
                    placeholder="Create New Password"
                  />
                </div>
                <div className="mb-4">
                  <label for="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {/* <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms-conditions"
                    name="terms-conditions"
                  />
                  <label className="form-check-label" for="terms-conditions">
                    I agree to terms & conditions
                  </label>
                </div> */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#efc81a", color: "white" }}
                    onClick={handleRegistration}
                  >
                    {isLoading ? "Loading..." : "Register Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <p className="text-center mt-3">
            Already have account?
            <Link
              to="/login"
              className="text-decoration-none"
              style={{ color: "#efc81a" }}
            >
              {" "}
              Log in Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Registration
