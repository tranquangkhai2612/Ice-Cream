
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    BookName: "",
    BookDescription: "",
    Price: 0,
    BookImage: null,
  });

  // State for image previews
  const [previewUrls, setPreviewUrls] = useState({
    image: null,
  });

  // State to track existing images
  const [existingImages, setExistingImages] = useState({
    image: null,
  });

  // Fetch existing Book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/Book/${id}`
        );
        const Book = response.data;
        setFormData({
          BookName: Book.bookName,
          BookDescription: Book.bookDescription,
          Price : Book.price,
          BookImage: null,
        });

        // Set existing images
        setExistingImages({
          image: Book.bookImage
        });

        setPreviewUrls({
          image: Book.bookImage
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Book");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      // Append basic fields
      form.append("id", id);
      form.append("BookName", formData.BookName);
      form.append("BookDescription", formData.BookDescription);
      form.append("Price", formData.Price)

      // Append new image if selected
      if (formData.BookImage) {
        form.append("BookImage", formData.BookImage);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/Book/${id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Book updated:", response.data);
      navigate(-1);
    } catch (err) {
      setError("Failed to update Book");
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    
    if (name === "BookImage" && files[0]) {
      setFormData(prev => ({
        ...prev,
        BookImage: files[0]
      }));
      setPreviewUrls(prev => ({
        ...prev,
        image: URL.createObjectURL(files[0])
      }));
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

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
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Book</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Name</label>
            <input
              type="text"
              name="BookName"
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
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.Price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image {existingImages.image && "(Current)"}
            </label>
            {existingImages.image && (
              <img
                src={`${process.env.REACT_APP_BASE_URL}${existingImages.image}`} // Replace with your backend URLexistingImages.thumbnail}
                alt="Current-image"
                className="w-32 h-32 object-cover rounded-md mb-2"
              />
            )}
            <input
              type="file"
              name="BookImage"
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded-md"
              onChange={handleFileSelect}
            />
            {previewUrls.image && previewUrls.image !== existingImages.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">New Image:</p>
                <img
                  src={previewUrls.image}
                  alt="New-image preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>


          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Book"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;