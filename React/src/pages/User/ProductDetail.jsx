import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const API_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/Recipe/${id}`);
        setRecipe(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, API_URL]);

  const getImageArray = (recipeData) => {
    const images = [];
    if (recipeData.recipeThumbnail) {
      images.push(recipeData.recipeThumbnail);
    }
    if (recipeData.recipeImage) {
      images.push(...recipeData.recipeImage.split(',').filter(Boolean));
    }
    return images;
  };

  const handleNextImage = () => {
    if (!recipe) return;
    const images = getImageArray(recipe);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (!recipe) return;
    const images = getImageArray(recipe);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-600">Recipe not found</p>
      </div>
    );
  }

  const images = getImageArray(recipe);

  return (
    <div>
      <Navbar />
      <div className="container mt-5 mb-5">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="ml-2">Back</span>
        </button>

        <div className="row">
          {/* Image Gallery */}
          <div className="col-md-6 mb-4">
            <div className="position-relative">
              <img
                src={`${API_URL}/${images[currentImageIndex]}`}
                alt={recipe.recipeName}
                className="img-fluid rounded-lg shadow-lg"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle ms-2"
                  >
                    ❮
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle me-2"
                  >
                    ❯
                  </button>
                </>
              )}
            </div>
            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="d-flex gap-2 mt-3 overflow-auto">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={`${API_URL}/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className={`cursor-pointer rounded ${
                      currentImageIndex === index ? "border border-warning" : ""
                    }`}
                    style={{ width: "80px", height: "60px", objectFit: "cover" }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recipe Details */}
          <div className="col-md-6">
            <h1 className="display-4 mb-3" style={{ color: "#2e266f" }}>
              {recipe.recipeName}
            </h1>
            {recipe.recipeDate && (
              <p className="text-muted mb-3">
                Posted on: {new Date(recipe.recipeDate).toLocaleDateString()}
              </p>
            )}
            {recipe.recipeRequireSubscription && (
              <span className="badge bg-warning mb-3">Premium Recipe</span>
            )}
            <div className="mb-4">
              <h5 className="text-secondary">Description</h5>
              <p>{recipe.recipeDescription}</p>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="row mt-5">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#2e266f" }}>
                  Ingredients
                </h5>
                <ul className="list-unstyled">
                  {recipe.recipeIngredient.split('\n').map((ingredient, index) => (
                    <li key={index} className="mb-2">
                      • {ingredient.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#2e266f" }}>
                  Steps
                </h5>
                <ol className="ps-3">
                  {recipe.recipeSteps.split('\n').map((step, index) => (
                    <li key={index} className="mb-2">
                      {step.trim()}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#2e266f" }}>
                  Procedures
                </h5>
                <ol className="ps-3">
                  {recipe.recipeProcedures.split('\n').map((procedure, index) => (
                    <li key={index} className="mb-2">
                      {procedure.trim()}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;