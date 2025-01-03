import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

const OrderBill = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch order details from the API
  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5099/api/Payment/combined-details/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data) {
        setOrderDetails(response.data);
      } else {
        console.error("Data is undefined:", response);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!orderDetails) {
    return <div>Order not found or failed to fetch data.</div>;
  }

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Details", 105, 20, null, null, "center");

    // Order Summary
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderDetails?.orderId || "N/A"}`, 20, 40);
    doc.text(`Email: ${orderDetails?.email || "N/A"}`, 20, 50);
    doc.text(`Address: ${orderDetails?.address || "N/A"}`, 20, 60);
    doc.text(`Account ID: ${orderDetails?.accountId || "N/A", 20, 50}`);
    doc.text(`Total Amount: $${orderDetails?.totalAmount || "N/A"}`, 20, 70);
    doc.text(
      `Created At: ${
        orderDetails?.createdAt
          ? new Date(orderDetails.createdAt).toLocaleString()
          : "N/A"
      }`,
      20,
      80
    );

    // Ordered Items
    doc.text("Ordered Items", 20, 100);
    orderDetails.orderItems?.forEach((item, index) => {
      const yOffset = 110 + index * 10;
      doc.text(
        `Item: ${
          item.book ? item.book.bookName : item.subscription?.subType || "N/A"
        }`,
        20,
        yOffset
      );
      doc.text(`Quantity: ${item.quantity || "N/A"}`, 100, yOffset);
      doc.text(
        `Price: $${
          item.book ? item.book.price : item.subscription?.subPrice || "N/A"
        }`,
        160,
        yOffset
      );
    });

    // Payment Information
    doc.text("Payment Information", 20, 140);
    doc.text(`Status: ${orderDetails.paymentInfo?.status || "N/A"}`, 20, 150);
    doc.text(
      `Transaction ID: ${orderDetails.paymentInfo?.transactionId || "N/A"}`,
      20,
      160
    );
    doc.text(
      `Amount Paid: $${orderDetails.paymentInfo?.amount || "N/A"}`,
      20,
      170
    );
    doc.text(
      `Currency: ${orderDetails.paymentInfo?.currency || "N/A"}`,
      20,
      180
    );

    // Save the PDF
    doc.save("order-details.pdf");
  };

  return (
    <div className="container mt-5">
      <h2>Order Details</h2>

      {/* Order Info */}
      <div className="order-info">
        <h4>Order Summary</h4>
        <p>
          <strong>Order ID:</strong> {orderDetails?.orderId || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {orderDetails?.email || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {orderDetails?.address || "N/A"}
        </p>
        <p>
          <strong>Account ID:</strong> {orderDetails?.accountId || "N/A"}
        </p>
        <p>
          <strong>Total Amount:</strong> ${orderDetails?.totalAmount || "N/A"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {orderDetails?.createdAt
            ? new Date(orderDetails.createdAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      {/* Ordered Items */}
      <h4>Ordered Items</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.orderItems?.map((item, index) => (
            <tr key={index}>
              <td>
                {item.book
                  ? item.book.bookName
                  : item.subscription?.subType || "N/A"}
              </td>
              <td>{item.quantity || "N/A"}</td>
              <td>
                $
                {item.book
                  ? item.book.price
                  : item.subscription?.subPrice || "N/A"}
              </td>
            </tr>
          )) || (
            <tr>
              <td colSpan="3">No items found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Payment Info */}
      <h4>Payment Information</h4>
      <div className="payment-info">
        <p>
          <strong>Status:</strong> {orderDetails.paymentInfo?.status || "N/A"}
        </p>
        <p>
          <strong>Transaction ID:</strong>{" "}
          {orderDetails.paymentInfo?.transactionId || "N/A"}
        </p>
        <p>
          <strong>Amount Paid:</strong> $
          {orderDetails.paymentInfo?.amount || "N/A"}
        </p>
        <p>
          <strong>Currency:</strong>{" "}
          {orderDetails.paymentInfo?.currency || "N/A"}
        </p>
      </div>

      {/* Export PDF Button */}
      <div className="mt-4">
        <button onClick={generatePDF} className="btn btn-success">
          Export Bill as PDF
        </button>
      </div>

      {/* Back to Home Button */}
      <div className="mt-4">
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderBill;
