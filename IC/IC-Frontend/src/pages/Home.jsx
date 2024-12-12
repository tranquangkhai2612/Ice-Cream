import React from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import "../styles/Home.css"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import RecipeCard from "../components/RecipeCard"
import RecipeCardSecond from "../components/RecipeCardSecond"

function Home() {
  const [listRecipes, setListRecipes] = React.useState([])
  const [newRecipes, setNewRecipes] = React.useState([])
  const [keyword, setKeyword] = React.useState("")
  const [searchResult, setSearchResult] = React.useState([])

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/recipes?sortType=DESC&page=1`)
      .then((response) => {
        setListRecipes(response?.data?.data)
        setNewRecipes(response?.data?.data[0])
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleSearch = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/recipes?keyword=${keyword}`)
      .then((response) => setSearchResult(response?.data?.data))
  }

  function addDefaultSrc(ev) {
    ev.target.src = "./img/Group-697.webp"
    ev.target.style = { width: "50%" }
  }

  return (
    <div>
      <Navbar />

      <div className="right-layer animate__animated animate__fadeIn"></div>

      <div className="container mt-4" style={{ height: "600px" }}>
        <div className="row flex-column-reverse gap-5 flex-lg-row py-5">
          <div className="col-8 col-lg-4 align-self-center animate__animated animate__fadeInLeft">
            <h1
              className="text-center text-lg-start fw-bolder fs-1 mb-4"
              style={{ color: "#2e266f" }}
            >
              Discover Recipe & Delicious Food
            </h1>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search Food"
              data-bs-toggle="modal"
              data-bs-target="#search-recipe"
            />
          </div>

          <div
            class="modal fade"
            id="search-recipe"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    Search Recipe
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search Food"
                    onChange={(e) => {
                      setKeyword(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        handleSearch()
                      }
                    }}
                  />
                  <div className="row justify-content-center gap-1 gap-sm-2 gap-md-4 mt-4">
                    {searchResult.length > 0
                      ? searchResult.map((item) => {
                          return (
                            <RecipeCardSecond
                              title={item?.title}
                              image={item?.recipePicture}
                              id={item?.id}
                            />
                          )
                        })
                      : "Recipe Not Found"}
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col text-center text-lg-end animate__animated animate__fadeInRight">
            <img
              src="./img/Rectangle-313.webp"
              alt="food"
              style={{ width: "55%" }}
            />
          </div>
        </div>
      </div>

      <div
        className="container d-flex align-items-center mt-3 mb-5 animate__animated animate__flipInX"
        style={{ height: "80px" }}
      >
        <div
          className="vr"
          style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
        ></div>
        <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
          Popular For You!
        </p>
      </div>

      <div className="container" style={{ marginBottom: "100px" }}>
        <div className="row flex-column gap-5 flex-lg-row py-5">
          <div className="col text-center text-lg-start animate__animated animate__fadeInLeft">
            <img
              src="./img/nasi-goreng-sederhana.webp"
              alt="food"
              style={{ width: "80%" }}
            />
          </div>
          <div className="col-8 col-lg-4 d-flex flex-column d-lg-block justify-content-center align-self-center animate__animated animate__fadeInRight">
            <h2
              className="text-center text-lg-start fs-1"
              style={{ color: "#3f3a3a" }}
            >
              Nasi Goreng Sederhana
            </h2>
            <hr className="opacity-100" />
            <p
              style={{ color: "#3f3a3a" }}
              className="text-center text-lg-start"
            >
              Resep Nasi Goreng Sederhana, Praktis Lezat Hanya dengan Lima Bahan
            </p>
            <Link
              to="/detail-recipe/12"
              className="btn btn-lg"
              style={{ backgroundColor: "#efc81a", color: "#fff" }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div
        className="container d-flex align-items-center my-5 animate__animated animate__flipInX"
        style={{ height: "80px" }}
      >
        <div
          className="vr"
          style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
        ></div>
        <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
          New Recipe
        </p>
      </div>

      <div className="left-layer animate__animated animate__fadeIn"></div>

      <div className="container" style={{ marginBottom: "150px" }}>
        <div className="row flex-column gap-5 flex-lg-row py-5">
          <div className="col text-center text-lg-start animate__animated animate__fadeInLeft">
            <img
              src={newRecipes?.recipePicture}
              alt="food"
              onError={addDefaultSrc}
              style={{ width: "80%" }}
            />
          </div>
          <div className="col-8 col-lg-4 d-flex flex-column d-lg-block justify-content-center align-self-center animate__animated animate__fadeInRight">
            <h2
              className="text-center text-lg-start fs-1"
              style={{ color: "#3f3a3a" }}
            >
              {newRecipes?.title}
            </h2>
            <hr className="opacity-100" style={{ width: "25% !important" }} />
            <p
              style={{ color: "#3f3a3a" }}
              className="text-center text-lg-start"
            >
              Resep Terbaru yang Dapat Anda coba untuk Keluarga Kesayangan
            </p>
            <Link
              to={`/detail-recipe/${newRecipes?.id}`}
              className="btn btn-lg"
              style={{ backgroundColor: "#efc81a", color: "#fff" }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div
        className="container d-flex align-items-center my-5 animate__animated animate__flipInX"
        style={{ height: "80px" }}
      >
        <div
          className="vr"
          style={{ width: "15px", backgroundColor: "#efc81a", opacity: "100%" }}
        ></div>
        <p className="m-0 ms-3 fs-1 fw-semibold" style={{ color: "#3f3a3a" }}>
          All Recipe
        </p>
      </div>

      <div
        className="container px-4 px-md-4 py-5 mb-5 container-popular-recipe"
        id="popular-recipe"
      >
        <div className="row justify-content-center gap-1 gap-sm-2 gap-md-4">
          {listRecipes.map((item, index) => {
            return (
              <RecipeCard
                title={item?.title}
                image={item?.recipePicture}
                id={item?.id}
                key={index}
              />
            )
          })}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home
