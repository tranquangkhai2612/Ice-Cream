import React from "react"

import "../styles/Auth.css"

function ForgotPassword() {
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
          <h1 className="text-center">Forgot Password?</h1>
          <p className="text-center text-secondary w-50 align-self-center">
            We just need your registered e-mail address to send your password
            resend
          </p>
          <div className="row m-0 p-0 justify-content-start justify-content-md-center">
            <div className="col col-md-8">
              <hr />
              <form action="/code-reset-password" method="get">
                <div className="mb-3">
                  <label for="email" className="form-label">
                    E-mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="E-mail"
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#efc81a", color: "white" }}
                  >
                    Send E-mail
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

export default ForgotPassword
