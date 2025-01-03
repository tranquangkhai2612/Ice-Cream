import React, { useState, useEffect } from "react";
import '../../../styles/Feedback.css';
import userService from "../default/userService";

const ProfileOverview = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [answer, setAnswer] = useState("");
    const [status, setStatus] = useState("");

    const apiUrl = userService.getApiUrl() + "/feedback"; // Replace with your API URL

    // Fetch all feedbacks
    const fetchFeedbacks = async () => {
        setStatus("Loading feedbacks...");
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                setFeedbacks(data);
                setStatus("");
            } else {
                setStatus("Failed to fetch feedbacks.");
            }
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setStatus("Error fetching feedbacks.");
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Handle selecting a feedback card
    const handleSelectFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setAnswer(feedback.answer || ""); // Prefill the answer box if an answer already exists
    };

    // Handle submitting the answer
    const handleSubmitAnswer = async () => {
        if (!selectedFeedback) return;

        try {
            const response = await fetch(`${apiUrl}/${selectedFeedback.id}/answer`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(answer),
            });

            if (response.ok) {
                setStatus("Answer submitted successfully!");
                fetchFeedbacks(); // Refresh the feedback list
            } else {
                setStatus("Failed to submit the answer.");
            }
        } catch (error) {
            console.error("Error submitting the answer:", error);
            setStatus("Error submitting the answer.");
        }
    };

    // Handle deleting a feedback
    const handleDeleteFeedback = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setStatus("Feedback deleted successfully.");
                fetchFeedbacks(); // Refresh the feedback list
                if (selectedFeedback?.id === id) {
                    setSelectedFeedback(null); // Clear the selected feedback if it's deleted
                }
            } else {
                setStatus("Failed to delete feedback.");
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
            setStatus("Error deleting feedback.");
        }
    };

    return (
        <div className="feedback-page">
            <div className="feedback-list">
                <h2 className="section-title">Feedbacks</h2>
                {status && <p className="feedback-status">{status}</p>}
                {feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                        <div
                            key={feedback.id}
                            className={`feedback-card ${selectedFeedback?.id === feedback.id ? "selected" : ""} ${
                                feedback.answer ? "answered" : "not-answered"
                            }`}
                            onClick={() => handleSelectFeedback(feedback)}
                        >
                            <h3 className="feedback-card-title">{feedback.feedbackTitle}</h3>
                            <p className="feedback-card-date">
                                {new Date(feedback.feedbackDate).toLocaleString()}
                            </p>
                            <button
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering feedback selection
                                    handleDeleteFeedback(feedback.id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="feedback-empty">No feedbacks available.</p>
                )}
            </div>
            <div className="feedback-detail">
                {selectedFeedback ? (
                    <>
                        <h2 className="section-title">Feedback Details</h2>
                        <p><strong>Title:</strong> {selectedFeedback.feedbackTitle}</p>
                        <p><strong>Description:</strong> {selectedFeedback.feedbackDescription}</p>
                        <p><strong>Answer:</strong> {selectedFeedback.answer || "No Answer"}</p>
                        <div className="answer-section">
                            <label htmlFor="answer">Your Answer:</label>
                            <textarea
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                rows="5"
                                placeholder="Write your answer here..."
                            ></textarea>
                            <button onClick={handleSubmitAnswer} className="submit-button">
                                Submit Answer
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="feedback-empty">Select a feedback to view details.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileOverview;
