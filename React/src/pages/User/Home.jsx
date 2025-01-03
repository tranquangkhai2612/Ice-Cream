import { useEffect, useState} from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import "./styles/Home.css"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [popularRecipe, setPopularRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState(null);
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
      console.log(JSON.parse(localStorage.getItem("user")));
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

      // Set popular recipe (first recipe for now, you can modify the logic)
      if (allRecipes.length > 0) {
        setPopularRecipe(isSubscribed ? allRecipes[-1] : allRecipes.filter(recipe => !recipe.recipeRequireSubscription)[1]);
      }

      // Set new recipe (latest by date)
      const sortedByDate = [...isSubscribed ? allRecipes : allRecipes.filter(recipe => !recipe.recipeRequireSubscription)].sort(
        (a, b) => new Date(b.recipeDate) - new Date(a.recipeDate)
      );

      if (sortedByDate.length > 0) {
        setNewRecipe(sortedByDate[0]);
      }

      // setLoading(false);
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

  // Function to truncate text
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
      <Navbar />
      <div className="right-layer animate__animated animate__fadeIn"></div>

      {/* Search Section */}
      <div className="container mt-4" style={{ height: "600px" }}>
        <div className="row flex-column-reverse gap-5 flex-lg-row py-5">
          <div className="col-8 col-lg-4 align-self-center animate__animated animate__fadeInLeft">
            <h1
              className="text-center text-lg-start fw-bolder fs-1 mb-4"
              style={{ color: "#2e266f" }}
            >
              Discover Recipe
            </h1>
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter Recipe"
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

          <div className="col text-center text-lg-end animate__animated animate__fadeInRight">
            <img
              src="./img/download.jpg"
              alt="food"
              style={{ width: "55%" }}
            />
          </div>
        </div>
      </div>

          {/* Search Modal */}
          <div className="modal fade" id="search-recipe" tabIndex="-1">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Search Results</h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row row-cols-1 row-cols-md-3 g-4">
                    {searchResults.map((recipe) => (
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
                            <p className="card-text">
                              {truncateText(recipe.recipeDescription, 100)}
                            </p>
                            <Link
                              to={`/detail-recipe/${recipe.id}`}
                              className="btn btn-primary"
                              onClick={handleRecipeClick}
                            >
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
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

      {/* Popular Recipe Section */}
      <div className="container d-flex align-items-center mt-3 mb-5 animate__animated animate__flipInX">
        <div
          className="vr"
          style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
        ></div>
        <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
          Popular For You!
        </p>
      </div>

      {popularRecipe && (
        <div className="container" style={{ marginBottom: "100px" }}>
          <div className="row flex-column gap-5 flex-lg-row py-5">
            <div className="col text-center text-lg-start animate__animated animate__fadeInLeft">
              <img
                src={`${API_URL}${popularRecipe.recipeThumbnail}`} // Use the correct URL for the popularRecipe.recipeThumbnail
                alt={popularRecipe.recipeName}
                style={{ width: "80%", height: "400px", objectFit: "cover" }}
              />
            </div>
            <div className="col-8 col-lg-4 d-flex flex-column d-lg-block justify-content-center align-self-center animate__animated animate__fadeInRight">
              <h2
                className="text-center text-lg-start fs-1"
                style={{ color: "#3f3a3a" }}
              >
                {popularRecipe.recipeName}
              </h2>
              <hr className="opacity-100" />
              <p
                style={{ color: "#3f3a3a" }}
                className="text-center text-lg-start"
              >
                {truncateText(popularRecipe.recipeDescription, 150)}
              </p>
              <Link
                to={`/detail-recipe/${popularRecipe.id}`}
                className="btn btn-lg"
                style={{ backgroundColor: "#efc81a", color: "#fff" }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* New Recipe Section */}
      {newRecipe && (
        <>
          <div className="container d-flex align-items-center my-5 animate__animated animate__flipInX">
            <div
              className="vr"
              style={{
                width: "15px",
                backgroundColor: "#efc81a",
                opacity: "100%",
              }}
            ></div>
            <p
              className="m-0 ms-3 fs-1 fw-semibold"
              style={{ color: "#3f3a3a" }}
            >
              New Recipe
            </p>
          </div>

          <div className="left-layer animate__animated animate__fadeIn"></div>

          <div className="container" style={{ marginBottom: "150px" }}>
            <div className="row flex-column gap-5 flex-lg-row py-5">
              <div className="col text-center text-lg-start animate__animated animate__fadeInLeft">
                <img
                  src={`${API_URL}${newRecipe.recipeThumbnail}`} // Use the correct URL for the recipe thumbnail image
                  alt={newRecipe.recipeName}
                  style={{ width: "80%", height: "400px", objectFit: "cover" }}
                />
              </div>
              <div className="col-8 col-lg-4 d-flex flex-column d-lg-block justify-content-center align-self-center animate__animated animate__fadeInRight">
                <h2
                  className="text-center text-lg-start fs-1"
                  style={{ color: "#3f3a3a" }}
                >
                  {newRecipe.recipeName}
                </h2>
                <hr className="opacity-100" />
                <p
                  style={{ color: "#3f3a3a" }}
                  className="text-center text-lg-start"
                >
                  {truncateText(newRecipe.recipeDescription, 150)}
                </p>
                <Link
                  to={`/detail-recipe/${newRecipe.id}`}
                  className="btn btn-lg"
                  style={{ backgroundColor: "#efc81a", color: "#fff" }}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* All Recipes Section */}
      <div className="container d-flex align-items-center my-5 animate__animated animate__flipInX">
        <div
          className="vr"
          style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
        ></div>
        <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
          All Recipes
        </p>
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

      <div className="container" style={{ marginBottom: "100px" }}>
        <div className="row flex-column gap-5 flex-lg-row py-5">
          <div className="col text-center text-lg-start animate__animated animate__fadeInLeft">
            <img
              src="./img/book-poster.jpg"
              alt="food"
              style={{ width: "50%", position: "inherit" }}
            />
          </div>
          <div className="col-8 col-lg-4 d-flex flex-column d-lg-block justify-content-center align-self-center animate__animated animate__fadeInRight">
            <h2
              className="text-center text-lg-start fs-1"
              style={{ color: "#3f3a3a" }}
            >
              Order My Brand New Cookbook!
            </h2>
            <hr className="opacity-100" />
            <p
              style={{ color: "#3f3a3a" }}
              className="text-center text-lg-start"
            >
              Elevate your dessert game with my new cookbook—packed with bold,
              modern recipes for every occasion. Order now!
            </p>
            <Link
              to="/order"
              className="btn btn-lg"
              style={{ backgroundColor: "#efc81a", color: "#fff" }}
            >
              Order Now!
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home
