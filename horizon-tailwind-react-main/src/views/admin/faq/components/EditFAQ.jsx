import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditFAQ.css";

const EditFAQ = () => {
  const { id } = useParams(); 
  const [faq, setFaq] = useState({ question: "", answer: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchFAQ();
  }, [id]);

  const fetchFAQ = async () => {
    try {
      const response = await axios.get(`http://localhost:5099/api/FAQ/${id}`,);
      setFaq(response.data);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
    }
  };

  const validateFAQ = (faq) => {
    const newErrors = {};
    if (!faq.question.trim()) newErrors.question = "Question cannot be empty.";
    if (!faq.answer.trim()) newErrors.answer = "Answer cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFAQ = async () => {
    if (!validateFAQ(faq)) return;

    try {
      await axios.put(`http://localhost:5099/api/FAQ/${id}`, faq);
      navigate("/admin/faq"); // Navigate to the FAQ management page after update
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  return (
    <div className="add-faq-container">
      <h2>Edit FAQ</h2>

      <div className="input-container">
        <label>Question</label>
        <input
          type="text"
          placeholder="Enter the question"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
        />
        {errors.question && <p className="error-message">{errors.question}</p>}
      </div>

      <div className="input-container">
        <label>Answer</label>
        <input
          type="text"
          placeholder="Enter the answer"
          value={faq.answer}
          onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
        />
        {errors.answer && <p className="error-message">{errors.answer}</p>}
      </div>

      <div className="button-container">
        <button className="add-button" onClick={updateFAQ}>Update FAQ</button>
        <button className="cancel-button" onClick={() => navigate("/admin/faq")}>Cancel</button>
      </div>
    </div>
  );
};

export default EditFAQ;
