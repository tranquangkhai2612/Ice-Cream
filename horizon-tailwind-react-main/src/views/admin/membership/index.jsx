import React, { useState, useEffect } from "react";
import "../../../styles/Subscription.css";
import userService from "../default/userService";

const SubscriptionManagement = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [form, setForm] = useState({
        subType: "",
        subDescription: "",
        subPrice: "",
    });
    const [status, setStatus] = useState("");
    const apiUrl = userService.getApiUrl() + "/subscription";

    // Fetch all subscriptions
    const fetchSubscriptions = async () => {
        setStatus("Loading subscriptions...");
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setSubscriptions(data);
                setStatus("");
            } else {
                setStatus("Failed to fetch subscriptions.");
            }
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            setStatus("Error fetching subscriptions.");
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    // Handle input changes for the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Handle form submission to create a subscription
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.subType || !form.subDescription || !form.subPrice) {
            setStatus("All fields are required.");
            return;
        }

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                setStatus("Subscription created successfully!");
                setForm({ subType: "", subDescription: "", subPrice: "" });
                fetchSubscriptions(); // Refresh the list
            } else {
                setStatus("Failed to create subscription.");
            }
        } catch (error) {
            console.error("Error creating subscription:", error);
            setStatus("Error creating subscription.");
        }
    };

    // Handle deleting a subscription
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subscription?")) return;

        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setStatus("Subscription deleted successfully.");
                fetchSubscriptions(); // Refresh the list
            } else {
                setStatus("Failed to delete subscription.");
            }
        } catch (error) {
            console.error("Error deleting subscription:", error);
            setStatus("Error deleting subscription.");
        }
    };

    return (
        <div className="subscription-management">
            <h1 className="title">Subscription Management</h1>

            {status && <p className="status">{status}</p>}

            <div className="form-container">
                <h2>Create Subscription</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Type:</label>
                        <input
                            type="text"
                            name="subType"
                            value={form.subType}
                            onChange={handleChange}
                            placeholder="Subscription Type"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <input
                            type="text"
                            name="subDescription"
                            value={form.subDescription}
                            onChange={handleChange}
                            placeholder="Subscription Description"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input
                            type="text"
                            name="subPrice"
                            value={form.subPrice}
                            onChange={handleChange}
                            placeholder="Subscription Price"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Create</button>
                </form>
            </div>

            <div className="subscription-list">
                <h2>All Subscriptions</h2>
                {subscriptions.length > 0 ? (
                    subscriptions.map((subscription) => (
                        <div key={subscription.id} className="subscription-card">
                            <p><strong>Type:</strong> {subscription.subType}</p>
                            <p><strong>Description:</strong> {subscription.subDescription}</p>
                            <p><strong>Price:</strong> {subscription.subPrice}</p>
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(subscription.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No subscriptions available.</p>
                )}
            </div>
        </div>
    );
};

export default SubscriptionManagement;
