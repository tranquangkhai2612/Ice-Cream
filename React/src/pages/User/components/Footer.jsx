import React from "react";
import { Link } from "react-router-dom";

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
        <p className="fs-6 mb-4">Share your best recipe by uploading here!</p>
        <br />
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
          <div className="text-center text-md-start">
            <h3 className="fs-4" style={{ color: "#3f3a3a" }}>
              Become a Member Today!
            </h3>
            <p className="mb-2" style={{ color: "#3f3a3a" }}>
              Subscribe for full access to all recipes.
            </p>
          </div>
          <Link
            to="/order"
            className="btn btn-lg"
            style={{ backgroundColor: "#de3750", color: "#fff" }}
          >
            Subscribe Now!
          </Link>
        </div>
      </footer>
    </>
  );
}

export default Footer;
