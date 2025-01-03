import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./styles/FAQDetail.module.css";

import Navbar from "./components/Navbar";

const FAQDetail = () => {
  const { id } = useParams();
  const [faq, setFaq] = useState(null);
  const [newComment, setNewComment] = useState({ description: "" });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const commentsPerPage = 5; // Number of comments per page
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchFAQDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5099/api/FAQ/${id}`
        );
        setFaq(response.data);
      } catch (error) {
        console.error("Error fetching FAQ details:", error);
      }
    };

    fetchFAQDetails();
  }, [id]);

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

const handleCommentSubmit = async (e) => {
  e.preventDefault();

  if (!newComment.description) {
    setError("mô tả.");
    return;
  }

  if (!user) {
    setError("no login.");
    return;
  }

  console.log("new comment:", newComment);
  try {
    const response = await axios.post(`http://localhost:5099/api/Comment`, {
      title: "",
      accountId: user.id,
      description: newComment.description,
      faqId: id,
      
    });
    console.log("comment add:", response.data);

    setFaq((prevFaq) => {
      const updatedComments = [...prevFaq.comments, response.data];
      const totalComments = updatedComments.length;
      setCurrentPage(Math.ceil(totalComments / commentsPerPage));
      return { ...prevFaq, comments: updatedComments };
    });

    setNewComment({ description: "" });
    setError("");
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    setError("Không thể thêm bình luận. Vui lòng thử lại.");
  }
};

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate displayed comments based on current page
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments =
    faq && faq.comments.slice(indexOfFirstComment, indexOfLastComment);

  const totalPages = faq ? Math.ceil(faq.comments.length / commentsPerPage) : 0;

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        {faq ? (
          <div>
            <h1 className={styles.title}>{faq.question}</h1>
            <p className={styles.answer}>{faq.answer}</p>
            <div className={styles.addComment}>
              <h3>Add a Comment</h3>
              {error && <p className={styles.error}>{error}</p>}
              <form onSubmit={handleCommentSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newComment.description}
                    onChange={handleCommentChange}
                    className={styles.textarea}
                  />
                </div>
                <button type="submit" className={styles.button}>
                  Add Comment
                </button>
              </form>
            </div>
            <h2>Comments</h2>
            <ul className={styles.comments}>
              {currentComments.map((comment) => (
                <li key={comment.id}>
                  <strong>User: {comment.accountId}</strong>
                  <p>{comment.description}</p>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page + 1)}
                    className={
                      currentPage === page + 1
                        ? styles.activePage
                        : styles.pageButton
                    }
                  >
                    {page + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>Loading FAQ details...</p>
        )}
      </div>
    </div>
  );
};

export default FAQDetail;