import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OrderPage() {
  const navigate = useNavigate();

  // State for all form inputs
  const [formData, setFormData] = useState({
    email: "",
    contactDetails: "",
    address: "",
    orderType: "",
    orderAmount: "",
    orderPrice: "",
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "http://localhost:5099/api/Orders",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    console.log("Order created:", data);
    navigate(-1); // Go back on success
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <div className="overflow-hidden">
      <div className="row flex-column flex-md-row">
        <Link
          to="/"
          className="col p-4 vh-100 left-col d-flex justify-content-center align-items-center"
        >
          <img
            className="image-fluid w-25 animate__animated animate__fadeInUp"
            src="./img/Group-697.webp"
            alt="Mama-Recipe-Logo"
          />
        </Link>
        <div className="col p-4 d-flex flex-column justify-content-center m-0 animate__animated animate__fadeInDown">
          <h1 className="text-center">Place Your Order</h1>
          <p className="text-center text-secondary">
            Fill in the details to continue purchase!
          </p>
          <div className="row m-0 p-0 justify-content-start justify-content-md-center">
            <div className="col col-md-8">
              <hr />
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contactDetails" className="form-label">
                    Contact Details
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="contactDetails"
                    placeholder="Contact Details"
                    value={formData.contactDetails}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="orderType" className="form-label">
                    Order Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="orderType"
                    placeholder="Order Type"
                    value={formData.orderType}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="orderAmount" className="form-label">
                    Order Amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="orderAmount"
                    placeholder="Order Amount"
                    value={formData.orderAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="orderPrice" className="form-label">
                    Order Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="orderPrice"
                    placeholder="Order Price"
                    value={formData.orderPrice}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#efc81a", color: "white" }}
                  >
                    Submit Information
                  </button>
                </div>
              </form>
            </div>
          </div>
          <p className="text-center mt-3">
            Need assistance?
            <Link
              to="/contact"
              className="text-decoration-none"
              style={{ color: "#efc81a" }}
            >
              {" "}
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
