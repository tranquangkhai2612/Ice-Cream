import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddFAQ.css";  // Importing the CSS for styling

const AddFAQ = () => {
  const [newFAQ, setNewFAQ] = useState({ question: "", answer: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate the FAQ input
  const validateFAQ = (faq) => {
    const newErrors = {};
    if (!faq.question.trim()) newErrors.question = "Question cannot be empty.";
    if (!faq.answer.trim()) newErrors.answer = "Answer cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle the addition of a new FAQ
  const addFAQ = async () => {
    if (!validateFAQ(newFAQ)) return;

    try {
      // Send the new FAQ to the server
      await axios.post("http://localhost:5099/api/FAQ", newFAQ);
      navigate("/"); // Redirect back to the homepage or FAQ list
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  return (
    <div className="add-faq-container">
      <h2>Add New FAQ</h2>

      <div className="input-container">
        <label>Question</label>
        <input
          type="text"
          placeholder="Enter your question"
          value={newFAQ.question}
          onChange={(e) => {
            const value = e.target.value;
            setNewFAQ({ ...newFAQ, question: value });
            setErrors({ ...errors, question: "" }); // Clear error message
          }}
        />
        {errors.question && <p className="error-message">{errors.question}</p>}
      </div>

      <div className="input-container">
        <label>Answer</label>
        <input
          type="text"
          placeholder="Enter the answer"
          value={newFAQ.answer}
          onChange={(e) => {
            const value = e.target.value;
            setNewFAQ({ ...newFAQ, answer: value });
            setErrors({ ...errors, answer: "" }); // Clear error message
          }}
        />
        {errors.answer && <p className="error-message">{errors.answer}</p>}
      </div>

      <button className="add-button" onClick={addFAQ}>Add FAQ</button>
    </div>
  );
};

export default AddFAQ;