import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./FAQ.css"; 
const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchFAQs();
  }, [currentPage]);

  useEffect(() => {
    handleSearch();
  }, [searchText, faqs]);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get("http://localhost:5099/api/FAQ", {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
        },
      });
      setFaqs(response.data);
      setFilteredFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const handleSearch = () => {
    if (!searchText) {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
  };

  const handleEditClick = (faqId) => {
    navigate(`/edit-faq/${faqId}`);
  };

  const deleteFAQ = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this FAQ?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5099/api/FAQ/${id}`);
      setFaqs(faqs.filter((faq) => faq.id !== id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex w-full flex-col gap-5">
    <div className="faq-container">
      
<Link to="../add-faq" className="inline-block">
          <button className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Create New FAQ
          </button>
        </Link>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by question or answer"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <table className="faq-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFaqs.map((faq) => (
<tr>
              <td>{faq.question}</td>
              <td>{faq.answer}</td>
              <td className="actions">
                {/* <button className="edit-button" onClick={() => handleEditClick(faq.id)}>Edit</button> */}
                <td className="actions">
  <Link to={`/admin/edit-faq/${faq.id}`}>
    <button className="edit-button">
      Edit
    </button>
  </Link>
  <button className="delete-button" onClick={() => deleteFAQ(faq.id)}>
    Delete
  </button>
</td>
             </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button className="pagination-button" onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button className="pagination-button" onClick={nextPage}>
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default FAQ;