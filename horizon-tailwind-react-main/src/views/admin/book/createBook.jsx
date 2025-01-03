
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateBook = () => {
  const navigate = useNavigate();

  // State for all form inputs
  const [formData, setFormData] = useState({
    BookName: "",
    BookDescription: "",
    BookImage: null,
    Price:0,
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new FormData instance
      const form = new FormData();

      // Append text fields
      form.append("BookName", formData.BookName);
      form.append("BookDescription", formData.BookDescription);
      form.append("Price", formData.Price)

      // Append thumbnail file
      if (formData.BookImage) {
        form.append("BookImage", formData.BookImage);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Book`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Book created:", response.data);
      navigate(-1); // Go back on success
    } catch (error) {
      console.error("Error creating Book:", error);
      alert("Failed to create Book. Please try again.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, type } = e.target;
    
    if (type === "file") {
        if (name === "BookImage") {
        // For single file
        setFormData(prev => ({
          ...prev,
          BookImage: e.target.files[0]
        }));
      }
    } else {
      // Handle text inputs
      setFormData(prev => ({
        ...prev,
        [name]: e.target.value
      }));
    }
  };

  // Preview Images
  const [previewUrls, setPreviewUrls] = useState({
    image: null,
  });

  // Handle file selection and preview
  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    
    if (name === "BookImage" && files[0]) {
      setPreviewUrls(prev => ({
        ...prev,
        image: URL.createObjectURL(files[0])
      }));
    }
    
    handleChange(e);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        className="flex items-center mb-6"
        onClick={() => navigate(-1)}
      >
        <svg
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.70994 2.11997L2.82994 5.99997L6.70994 9.87997C7.09994 10.27 7.09994 10.9 6.70994 11.29C6.31994 11.68 5.68994 11.68 5.29994 11.29L0.709941 6.69997C0.319941 6.30997 0.319941 5.67997 0.709941 5.28997L5.29994 0.699971C5.68994 0.309971 6.31994 0.309971 6.70994 0.699971C7.08994 1.08997 7.09994 1.72997 6.70994 2.11997V2.11997Z"
            fill="#A3AED0"
          />
        </svg>
        <p className="ml-3 text-sm text-gray-600">Back</p>
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Create New Book</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Name</label>
            <input
              type="text"
              name="BookName"
              placeholder="Enter Book Name"
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.BookName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="BookDescription"
              placeholder="Enter Book Description"
              className="w-full rounded-md border border-gray-300 p-3 h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.BookDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              name="Price"
              placeholder="Enter Book Price"
              className="w-full rounded-md border border-gray-300 p-3 h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.Price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <input
              type="file"
              name="BookImage"
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded-md"
              onChange={handleFileSelect}
              required
            />
            {previewUrls.image && (
              <div className="mt-2">
                <img
                  src={previewUrls.image}
                  alt="Image preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            Create Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;