import React from "react"

function Footer() {
  return (
    <>
      <footer
        style={{ height: "60vh", backgroundColor: "#efc81a", color: "#2e266f" }}
        className="d-flex flex-column justify-content-center align-items-center animate__animated animate__fadeIn"
      >
        <h1 className="fs-1" style={{ color: "#2e266f" }}>
          Eat, Cook, Repeat
        </h1>
        <p className="fs-6">Share your best recipe by uploading here!</p>
        <ul className="navbar-nav d-flex flex-md-row gap-md-4 fs-6 text-center">
          <li className="nav-item">
            <a className="nav-link" href="/">
              Product
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">
              Company
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">
              Learn More
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">
              Get In Touch
            </a>
          </li>
        </ul>
      </footer>
    </>
  )
}

export default Footer
