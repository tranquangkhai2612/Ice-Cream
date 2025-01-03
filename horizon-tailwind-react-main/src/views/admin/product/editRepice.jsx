
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    recipeName: "",
    recipeDescription: "",
    recipeIngredient: "",
    recipeSteps: "",
    recipeProcedures: "",
    recipeImage: null,
    recipeThumbnail: null,
    recipeRequireSubscription: false
  });

  // State for image previews
  const [previewUrls, setPreviewUrls] = useState({
    thumbnail: null,
    images: []
  });

  // State to track existing images
  const [existingImages, setExistingImages] = useState({
    thumbnail: null,
    images: []
  });

  // Fetch existing recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/Recipe/${id}`
        );
        const recipe = response.data;
        
        setFormData({
          recipeName: recipe.recipeName,
          recipeDescription: recipe.recipeDescription,
          recipeIngredient: recipe.recipeIngredient,
          recipeSteps: recipe.recipeSteps,
          recipeProcedures: recipe.recipeProcedures,
          recipeImage: null,
          recipeThumbnail: null,
          recipeRequireSubscription: recipe.recipeRequireSubscription
        });

        // Set existing images
        setExistingImages({
          thumbnail: recipe.recipeThumbnail,
          images: recipe.recipeImage ? recipe.recipeImage.split(',') : []
        });

        setPreviewUrls({
          thumbnail: recipe.recipeThumbnail,
          images: recipe.recipeImage ? recipe.recipeImage.split(',') : []
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch recipe");
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      // Append basic fields
      form.append("id", id);
      form.append("recipeName", formData.recipeName);
      form.append("recipeDescription", formData.recipeDescription);
      form.append("recipeIngredient", formData.recipeIngredient);
      form.append("recipeSteps", formData.recipeSteps);
      form.append("recipeProcedures", formData.recipeProcedures);
      form.append("recipeRequireSubscription", formData.recipeRequireSubscription);

      // Append new thumbnail if selected
      if (formData.recipeThumbnail) {
        form.append("recipeThumbnail", formData.recipeThumbnail);
      }

      // Append new images if selected
      if (formData.recipeImage) {
        for (let i = 0; i < formData.recipeImage.length; i++) {
          form.append("recipeImage", formData.recipeImage[i]);
        }
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/Recipe/${id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Recipe updated:", response.data);
      navigate(-1);
    } catch (err) {
      setError("Failed to update recipe");
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        recipeRequireSubscription: e.target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.value
      }));
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    
    if (name === "recipeThumbnail" && files[0]) {
      setFormData(prev => ({
        ...prev,
        recipeThumbnail: files[0]
      }));
      setPreviewUrls(prev => ({
        ...prev,
        thumbnail: URL.createObjectURL(files[0])
      }));
    }
    
    if (name === "recipeImage" && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        recipeImage: files
      }));
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => ({
        ...prev,
        images: urls
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
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Recipe</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name</label>
            <input
              type="text"
              name="recipeName"
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.recipeName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="recipeDescription"
              className="w-full rounded-md border border-gray-300 p-3 h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.recipeDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
            <textarea
              name="recipeIngredient"
              className="w-full rounded-md border border-gray-300 p-3 h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.recipeIngredient}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
            <textarea
              name="recipeSteps"
              className="w-full rounded-md border border-gray-300 p-3 h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.recipeSteps}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Procedures</label>
            <textarea
              name="recipeProcedures"
              className="w-full rounded-md border border-gray-300 p-3 h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.recipeProcedures}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail {existingImages.thumbnail && "(Current)"}
            </label>
            {existingImages.thumbnail && (
              <img
                src={`${process.env.REACT_APP_BASE_URL}${existingImages.thumbnail}`} // Replace with your backend URLexistingImages.thumbnail}
                alt="Current thumbnail"
                className="w-32 h-32 object-cover rounded-md mb-2"
              />
            )}
            <input
              type="file"
              name="recipeThumbnail"
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded-md"
              onChange={handleFileSelect}
            />
            {previewUrls.thumbnail && previewUrls.thumbnail !== existingImages.thumbnail && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">New thumbnail:</p>
                <img
                  src={previewUrls.thumbnail}
                  alt="New thumbnail preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Images {existingImages.images.length > 0 && "(Current)"}
            </label>
            {existingImages.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                {existingImages.images.map((url, index) => (
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_BASE_URL}${url}`}
                    alt={`Current-image ${index + 1} `}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
            <input
              type="file"
              multiple
              name="recipeImage"
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded-md"
              onChange={handleFileSelect}
            />
            {previewUrls.images.length > 0 && 
             JSON.stringify(previewUrls.images) !== JSON.stringify(existingImages.images) && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">New images:</p>
                <div className="grid grid-cols-4 gap-2">
                  {previewUrls.images.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`New preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recipeRequireSubscription"
              name="recipeRequireSubscription"
              checked={formData.recipeRequireSubscription}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label 
              htmlFor="recipeRequireSubscription" 
              className="text-sm font-medium text-gray-700"
            >
              Require Subscription to View Recipe
            </label>
          </div>

          {formData.recipeRequireSubscription && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div>
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This recipe will only be visible to subscribed users.
                    {existingImages.thumbnail && " Current images and content will remain subscription-only."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Recipe"}
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

export default EditRecipe;