import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditOrderForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming the order ID is passed via the URL
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    contactDetails: "",
    address: "",
    orderType: "",
    orderAmount: "",
    orderPrice: "",
    createdAt: "",
  });

  // Fetch the order data to edit
  useEffect(() => {
    const fetchOrderData = async () => {
        const response = await axios.get(
          `http://localhost:5099/api/Orders/${id}`,
          {
            headers: {
              "Content-Type": "application/json", // Add Content-Type header here
            },
          }
        );
        setFormData(response.data);
    };

    fetchOrderData();
  }, [id]);

  // Handle form submission (update the order)
  const handleSubmit = async (e) => {
    e.preventDefault();
      const response = await axios.put(
        `http://localhost:5099/api/Orders/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order updated:", response.data);
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
    <div className="p-6">
      <button
        className="flex items-center"
        onClick={() => navigate(-1)} // Go back to the previous page
      >
        <svg
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z"
            fill="#A3AED0"
          />
        </svg>
        <p className="ml-3 text-sm text-gray-600">Back</p>
      </button>

      <h2 className="mb-4 text-xl font-bold">Edit Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          placeholder="ID"
          className="mb-4 w-full border bg-gray-100 p-2"
          value={formData.id}
          readOnly
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-4 w-full border p-2"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contactDetails"
          placeholder="Contact Details"
          className="mb-4 w-full border p-2"
          value={formData.contactDetails}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="mb-4 w-full border p-2"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="orderType"
          placeholder="Order Type"
          className="mb-4 w-full border p-2"
          value={formData.orderType}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="orderAmount"
          placeholder="Order Amount"
          className="mb-4 w-full border p-2"
          value={formData.orderAmount}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="orderPrice"
          placeholder="Order Price"
          className="mb-4 w-full border p-2"
          value={formData.orderPrice}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="createdAt"
          placeholder="Created At"
          className="mb-4 w-full border bg-gray-100 p-2"
          value={new Date(formData.createdAt).toLocaleString()} // Format date
          readOnly
        />
        <button
          type="submit"
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Update Order
        </button>
      </form>
    </div>
  );
}

export default EditOrderForm;
