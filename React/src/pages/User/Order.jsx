import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OrderPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [orderItem, setOrderItem] = useState({
    email: "",
    contactDetails: "",
    address: "",
    subscriptionId: null,
    subscriptionPrice: 0,
    accountId: "",
    bookQuantities: {},
    orderPrice: 0,
  });

  const [subscriptions, setSubscriptions] = useState([]);
  const [books, setBooks] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      const subscriptionResponse = await axios.get(
        "http://localhost:5099/api/Subscription"
      );
      setSubscriptions(subscriptionResponse.data);

      const bookResponse = await axios.get("http://localhost:5099/api/Book");
      setBooks(bookResponse.data);

      const initialQuantities = bookResponse.data.reduce((acc, book) => {
        acc[book.id] = 0;
        return acc;
      }, {});
      setOrderItem((prevState) => ({
        ...prevState,
        bookQuantities: initialQuantities,
      }));
    };

    fetchData();
  }, []);

  const handleSubscriptionSelect = (e) => {
    const id = e.target.value;
    const selectedSubscription = subscriptions.find(
      (sub) => sub.id === parseInt(id)
    );

    setOrderItem((prevData) => {
      const newOrderPrice = calculateTotalPrice(
        prevData.bookQuantities,
        selectedSubscription
      );

      return {
        ...prevData,
        subscriptionId: selectedSubscription ? selectedSubscription.id : null,
        subscriptionPrice: selectedSubscription
          ? selectedSubscription.subPrice
          : 0,
        orderPrice: newOrderPrice,
      };
    });
  };

  const calculateTotalPrice = (bookQuantities, selectedSubscription) => {
    const bookTotal = Object.keys(bookQuantities || {}).reduce(
      (total, bookId) => {
        const book = books.find((b) => b.id === parseInt(bookId));
        if (book && bookQuantities[bookId] > 0) {
          total += book.price * bookQuantities[bookId];
        }
        return total;
      },
      0
    );

    const subscriptionTotal = selectedSubscription
      ? parseFloat(selectedSubscription.subPrice) || 0
      : 0;

    return bookTotal + subscriptionTotal;
  };

  const handleBookQuantityChange = (id, quantity) => {
    if (isNaN(quantity) || quantity < 0) return;

    setOrderItem((prevData) => {
      const updatedQuantities = { ...prevData.bookQuantities, [id]: quantity };


      const newOrderPrice = calculateTotalPrice(
        updatedQuantities,
        prevData.subscriptionId
          ? subscriptions.find((sub) => sub.id === prevData.subscriptionId)
          : null
      );

      return {
        ...prevData,
        bookQuantities: updatedQuantities,
        orderPrice: newOrderPrice,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderItem((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const orderItems = [];
    if (orderItem.subscriptionId) {
      orderItems.push({
        subscriptionId: orderItem.subscriptionId,
        bookId: null,
        quantity: 1,
      });
    }

    books.forEach((book) => {
      if (orderItem.bookQuantities[book.id] > 0) {
        orderItems.push({
          subscriptionId: null,
          bookId: book.id,
          quantity: orderItem.bookQuantities[book.id],
        });
      }
    });
      if (orderItems.length === 0) {
        alert(
          "You must select at least one book or subscription to place an order."
        );
        return;
      }


    const orderData = {
      email: orderItem.email,
      contactDetails: orderItem.contactDetails,
      address: orderItem.address,
      createdAt: new Date().toISOString(),
      accountId: user.id,
      orderItems: orderItems,
    };

    try {
      const orderResponse = await axios.post(
        "http://localhost:5099/api/Orders",
        orderData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Order Response:", orderResponse.data);
      const paymentResponse = await axios.post(
        `http://localhost:5099/api/payment/create-payment?currency=USD&orderId=${orderResponse.data.id}`,
        {
          orderId: orderResponse.data.id,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (paymentResponse.data && paymentResponse.data.approvalUrl) {
        window.location.href = paymentResponse.data.approvalUrl;
      }
    } catch (error) {
      console.error("Error submitting order or payment:", error);
    }
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
            Fill in the details to continue your purchase!
          </p>

          <form onSubmit={handleSubmit}>
            {/* <div className="mb-3">
              <input
                type="accountId"
                className="accountId"
                id="accountId"
                name="accountId"
                placeholder="accountId"
                value={user.id}
                onChange={handleChange}
                required
                hidden
              />
            </div> */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Email"
                value={orderItem.email}
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
                name="contactDetails"
                placeholder="Contact Details"
                value={orderItem.contactDetails}
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
                name="address"
                placeholder="Address"
                value={orderItem.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subscription" className="form-label">
                Subscription
              </label>
              <select
                className="form-select"
                onChange={handleSubscriptionSelect}
              >
                <option value="">Select Subscription</option>
                {subscriptions.map((sub) => (
                  <option
                    key={sub.id}
                    value={sub.id}
                  >{`Subscribe to ${sub.subType} ($${sub.subPrice})`}</option>
                ))}
              </select>
            </div>
            <div
              className="mb-3"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              <label htmlFor="books" className="form-label">
                Books
              </label>
              <div className="form-check" style={{ marginTop: "10px" }}>
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="book-item"
                    style={{ marginBottom: "10px" }}
                  >
                    <label
                      htmlFor={`book-${book.id}`}
                      className="form-check-label"
                    >
                      {`${book.bookName} ($${book.price || 0})`}
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={orderItem.bookQuantities[book.id] || 0}
                      onChange={(e) =>
                        handleBookQuantityChange(
                          book.id,
                          parseInt(e.target.value)
                        )
                      }
                      id={`book-${book.id}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="orderPrice" className="form-label">
                Total Order Price: ${orderItem.orderPrice.toFixed(2)}
              </label>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "#efc81a", color: "white" }}
              >
                Place an order
              </button>
            </div>
          </form>

          <p className="text-center mt-3">
            Need assistance?{" "}
            <Link
              to="/contact"
              className="text-decoration-none"
              style={{ color: "#efc81a" }}
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
