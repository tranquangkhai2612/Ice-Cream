import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Link } from "react-router-dom"
import axios from "axios"
import "./styles/Home.css"
const Book = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const API_URL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Book`);
      const allBooks = response.data;
      
      // Set all recipes
      setBooks(allBooks);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      // setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = books.filter(book =>
      book.bookName.toLowerCase().includes(query.toLowerCase()) ||
      book.bookDescription.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleBookClick = () => {
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

  return (
    <div>
      <Navbar/>
      <div className="right-layer animate__animated animate__fadeIn"></div>
      {/* Search Section */}
      <div className="container mt-4" style={{ height: "100px" }}>
        <div className="row flex-column-reverse gap-5 flex-lg-row py-5">
          <div className="col-8 col-lg-4 align-self-center animate__animated animate__fadeInLeft">
            {/* <h1
              className="text-center text-lg-start fw-bolder fs-1 mb-4"
              style={{ color: "#2e266f" }}
            >
              Discover Recipe
            </h1> */}
            <div className="d-flex align-items-center gap-2">
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter Book Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className="btn btn-lg btn-primary"
                    onClick={() => handleSearch(searchQuery)}
                    data-bs-toggle="modal"
                    data-bs-target="#search-book"
                >
                    Search
                </button>
            </div>
          </div>

          {/* Search Modal */}
          <div className="modal fade" id="search-book" tabIndex="-1">
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Search Results</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <div className="row row-cols-1 row-cols-md-3 g-4">
                    {searchResults.map(book => (
                      <div key={book.id} className="col">
                        <div className="card h-100">
                          <img
                            src={`${API_URL}${book.bookImage}`} // Use the correct URL for the recipe.recipeThumbnail}
                            className="card-img-top"
                            alt={book.bookName}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="card-body" data-bs-dismiss="modal">
                            <h5 className="card-title">{book.bookName}</h5>
                            <p className="card-text">{truncateText(book.bookDescription, 100)}</p>
                            <Link to={`../order`} className="btn btn-primary" onClick={handleBookClick}>
                              Add to Cart
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {searchResults.length === 0 && searchQuery && (
                    <p className="text-center my-4">No book found</p>
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
        </div>
      </div>

      <div className="container px-4 px-md-4 py-5 mb-5 container-popular-recipe">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {books.map(book => (
            <div key={book.id} className="col animate__animated animate__fadeIn">
              <div className="card h-100">
                <img
                  src={`${API_URL}${book.bookImage}`}
                  className="card-img-top"
                  alt={book.bookName}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{book.bookName}</h5>
                  <p className="card-text">{truncateText(book.bookDescription, 100)}</p>
                  <Link
                    to={`/order`}
                    className="btn"
                    style={{ backgroundColor: "#efc81a", color: "#fff" }}
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
export default Book
