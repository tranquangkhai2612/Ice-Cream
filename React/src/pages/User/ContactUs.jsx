import userServices from "../../services/userServices";
import Navbar from "./components/Navbar";
import React, { useState, useEffect } from "react";
import './styles/ContactUs.css'


function ContactUs() {
  const [form, setForm] = useState({
    email: "",
    feedbackTitle: "",
    feedbackDescription: "",
    answer: ""
  });
  const [status, setStatus] = useState("");

  const apiUrl = userServices.getApiUrl() + "/feedback"; // Replace with your API URL

  const isLogin = () => {
      const user = localStorage.getItem('user');
      if(user){
          return true;
      }else {
          return false;
      }
  }

  const getUser = () => {
      return JSON.parse(localStorage.getItem("user"));
  }

  useEffect(() => {
      if(isLogin()){
          const email = getUser().email;
          setForm({
              email: email,
              feedbackTitle: "",
              feedbackDescription: "",
              answer: ""
          });
      }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus("Submitting feedback...");
      try {
          const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(form),
          });

          if (response.ok) {
              setStatus("Thank you for your feedback!");
              setForm({
                  email: isLogin? getUser().email : "",
                  feedbackTitle: "",
                  feedbackDescription: "",
                  answer: ""
              });
          } else {
              const error = await response.json();
              setStatus(error.message || "Something went wrong.");
          }
      } catch (error) {
          console.error("Error submitting feedback:", error);
          setStatus("Failed to submit feedback.");
      }
  };

  return (
    <div>
      <Navbar />
      <div className="contact-us">
      <h1 className="title">Contact Us</h1>
      <p className="description">
          If you have any feedback, please fill out the form below. We’d love to hear from you!
      </p>
      <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
              <label>Email:</label>
              <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
              />
          </div>
          <div className="form-group">
              <label>Title:</label>
              <input
                  type="text"
                  name="feedbackTitle"
                  value={form.feedbackTitle}
                  onChange={handleChange}
                  required
              />
          </div>
          <div className="form-group">
              <label>Description:</label>
              <textarea
                  name="feedbackDescription"
                  value={form.feedbackDescription}
                  onChange={handleChange}
                  required
              ></textarea>
          </div>
          <button className="submit-button" type="submit">
              Submit Feedback
          </button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
    </div>
  );
}
export default ContactUs;
