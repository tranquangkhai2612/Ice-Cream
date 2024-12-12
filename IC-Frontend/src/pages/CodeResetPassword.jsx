import React from "react"

import "../styles/Auth.css"

function CodeResetPassword() {
  return (
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
              <form action="/reset-password" method="get">
                <div className="mb-3">
                  <label for="code" className="form-label">
                    Code 6 Digit
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="code"
                    name="code"
                    placeholder="Code"
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#efc81a", color: "white" }}
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeResetPassword
