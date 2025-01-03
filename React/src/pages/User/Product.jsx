import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Link } from "react-router-dom"
import axios from "axios"
import "./styles/Home.css"

const Product = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const API_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    fetchRecipes();
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      // Get token from localStorage or your auth management
      const token = JSON.parse(localStorage.getItem("user")).subscriptionId;
      if (!token) {
        console.log("Token not found");
        setIsSubscribed(false);
        return;
      }
      console.log(JSON.parse(localStorage.getItem("user")));
      const response = await axios.get(`${API_URL}/api/Account/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      setIsSubscribed(true);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsSubscribed(false);
    }
  };
  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Recipe`);
      const allRecipes = response.data;
      
      // Set all recipes
      setRecipes(allRecipes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }finally{
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    let filtered = recipes.filter(recipe =>
      recipe.recipeName.toLowerCase().includes(query.toLowerCase()) ||
      recipe.recipeDescription.toLowerCase().includes(query.toLowerCase())
    );

    // Filter out subscription-required recipes if user is not subscribed
    if (!isSubscribed) {
      filtered = filtered.filter(recipe => !recipe.recipeRequireSubscription);
    }

    setSearchResults(filtered);
  };

  const handleRecipeClick = () => {
    // Remove modal-open class from body
    document.body.classList.remove('modal-open');
    // Remove modal backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    // // Hide modal
    // const modal = document.getElementById('search-book');
    // if (modal) {
    //   modal.style.display = 'none';
    // }
  };

  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const displayedRecipes = isSubscribed 
    ? recipes 
    : recipes.filter(recipe => !recipe.recipeRequireSubscription);

  return (
    <div>
      <Navbar/>
      <div className="right-layer animate__animated animate__fadeIn"></div>
           {/* Search Section */}
      <div className="container mt-4" style={{ height: "100px" }}>
        <div className="row flex-column-reverse gap-5 flex-lg-row py-5">
          <div className="col-8 col-lg-4 align-self-center animate__animated animate__fadeInLeft">
            <div className="d-flex align-items-center gap-2">
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter Search Recipe"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className="btn btn-lg btn-primary"
                    onClick={() => handleSearch(searchQuery)}
                    data-bs-toggle="modal"
                    data-bs-target="#search-recipe"
                >
                    Search
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Banner */}
      {!isSubscribed && (
        <div className="container mb-4">
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <i className="bi bi-star-fill me-2"></i>
              <div>
                Subscribe to access our premium recipes! 
                <Link to="/order" className="alert-link ms-2">
                  Subscribe Now
                </Link>
              </div>
            </div>
          </div>
        )}

      {/* Search Modal */}
      <div className="modal fade" id="search-recipe" tabIndex="-1">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Search Results</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <div className="row row-cols-1 row-cols-md-3 g-4">
                    {searchResults.map(recipe => (
                      <div key={recipe.id} className="col">
                        <div className="card h-100">
                          <img
                            src={`${API_URL}${recipe.recipeThumbnail}`} // Use the correct URL for the recipe.recipeThumbnail}
                            className="card-img-top"
                            alt={recipe.recipeName}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="card-body">
                            <h5 className="card-title">{recipe.recipeName}</h5>
                            <p className="card-text">{truncateText(recipe.recipeDescription, 100)}</p>
                            <Link to={`/detail-recipe/${recipe.id}`} className="btn btn-primary" onClick={handleRecipeClick}>
                              View Recipe
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {searchResults.length === 0 && searchQuery && (
                    <p className="text-center my-4">No recipes found</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
      </div>
      
      {/* Recipe Grid */}
      <div className="container px-4 px-md-4 mb-5">   {/*py-5 */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
      <div className="container px-4 px-md-4 mb-5 container-popular-recipe"> {/*py-5 */}
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {displayedRecipes.map(recipe => (
            <div key={recipe.id} className="col animate__animated animate__fadeIn">
              <div className="card h-100">
                <img
                  src={`${API_URL}${recipe.recipeThumbnail}`}
                  className="card-img-top"
                  alt={recipe.recipeName}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.recipeName}</h5>
                  <p className="card-text">{truncateText(recipe.recipeDescription, 100)}</p>
                  <Link
                    to={`/detail-recipe/${recipe.id}`}
                    className="btn"
                    style={{ backgroundColor: "#efc81a", color: "#fff" }}
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
export default Product
