import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from './styles/FAQ.module.css';
import {useNavigate}  from "react-router-dom"
import Navbar from "./components/Navbar"


const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();


  const contentRefs = useRef({});

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get("http://localhost:5099/api/FAQ");
      setFaqs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const handleFAQClick = (id) => {
    navigate(`/faq/${id}`);
  };

  return (
    <div>
        <Navbar/>
        <div className={styles.container}>
      <h1 className={styles.title}>FAQ</h1>
      {faqs.length === 0 ? (
        <p className={styles.noFAQs}>No FAQs available at the moment.</p>
      ) : (
        <ul className={styles.faqList}>
          {faqs.map((faq) => (
            <li key={faq.id} className={styles.faqItem}>
              <div
                className={styles.questionSection}
                onClick={() => handleFAQClick(faq.id)}
              >
                <div className={styles.questionStyle}>
                  <div className={styles.questionAlign}>
                    <div className={styles.questionText}>{faq.question}</div>
                    <div className={styles.questionIcon} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};
export default FAQ;
