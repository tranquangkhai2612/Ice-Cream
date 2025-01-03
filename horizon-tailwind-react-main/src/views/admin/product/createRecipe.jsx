
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateRecipe = () => {
  const navigate = useNavigate();

  // State for all form inputs
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new FormData instance
      const form = new FormData();

      // Append text fields
      form.append("recipeName", formData.recipeName);
      form.append("recipeDescription", formData.recipeDescription);
      form.append("recipeIngredient", formData.recipeIngredient);
      form.append("recipeSteps", formData.recipeSteps);
      form.append("recipeProcedures", formData.recipeProcedures);
      form.append("recipeRequireSubscription", formData.recipeRequireSubscription);

      // Append thumbnail file
      if (formData.recipeThumbnail) {
        form.append("recipeThumbnail", formData.recipeThumbnail);
      }

      // Append multiple images
      if (formData.recipeImage) {
        for (let i = 0; i < formData.recipeImage.length; i++) {
          form.append("RecipeImage", formData.recipeImage[i]);
        }
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/Recipe`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Recipe created:", response.data);
      navigate(-1); // Go back on success
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("Failed to create recipe. Please try again.");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, type } = e.target;
    
    if (type === "file") {
      // Handle file inputs
      if (name === "recipeImage") {
        // For multiple files
        setFormData(prev => ({
          ...prev,
          recipeImage: e.target.files
        }));
      } else if (name === "recipeThumbnail") {
        // For single file
        setFormData(prev => ({
          ...prev,
          recipeThumbnail: e.target.files[0]
        }));
      }
    }else if (type === "checkbox") {  // Add this condition
      setFormData(prev => ({
        ...prev,
        recipeRequireSubscription: e.target.checked
      }));
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
    thumbnail: null,
    images: []
  });

  // Handle file selection and preview
  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    
    if (name === "recipeThumbnail" && files[0]) {
      setPreviewUrls(prev => ({
        ...prev,
        thumbnail: URL.createObjectURL(files[0])
      }));
    }
    
    if (name === "recipeImage" && files.length > 0) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => ({
        ...prev,
        images: urls
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
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Create New Recipe</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name</label>
            <input
              type="text"
              name="recipeName"
              placeholder="Enter Recipe Name"
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
              placeholder="Enter Recipe Description"
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
              placeholder="Enter Recipe Ingredients"
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
              placeholder="Enter Recipe Steps"
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
              placeholder="Enter Recipe Procedures"
              className="w-full rounded-md border border-gray-300 p-3 h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formData.recipeProcedures}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
            <input
              type="file"
              name="recipeThumbnail"
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded-md"
              onChange={handleFileSelect}
              required
            />
            {previewUrls.thumbnail && (
              <div className="mt-2">
                <img
                  src={previewUrls.thumbnail}
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Images</label>
            <input
              type="file"
              multiple
              name="recipeImage"
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded-md"
              onChange={handleFileSelect}
              required
            />
            {previewUrls.images.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {previewUrls.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>
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
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This recipe will only be visible to subscribed users.
                </p>
              </div>
            </div>
          </div>
        )}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            Create Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;