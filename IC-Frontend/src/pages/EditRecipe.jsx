import React from "react"
import { useLocation } from "react-router"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addAuth } from "../store/reducers/auth"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Swal from "sweetalert2"

function EditRecipe() {
  const location = useLocation()
  const id = location?.pathname?.split("/")[2]
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)
  const recipe = state?.recipes.find((item) => item.recipes_id == id)
  const [recipePicture, setRecipePicture] = React.useState("")
  const [category, setCategory] = React.useState(recipe?.category)
  const [title, setTitle] = React.useState(recipe?.title)
  const [ingredients, setIngredients] = React.useState(recipe?.ingredients)
  const [videoLink, setVideoLink] = React.useState(recipe?.videoLink)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    window.scroll(0, 0)
    if (!state.auth) {
      navigate("/login")
    }
  }, [])

  const handleUpdateRecipe = () => {
    setIsLoading(true)
    if (recipePicture != "") {
      const formData = new FormData()
      formData.append("photo", recipePicture)
      axios
        .patch(
          `${process.env.REACT_APP_BASE_URL}/recipes/photo/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/recipes/${id}`, {
        title,
        ingredients,
        videoLink,
        category,
      })
      .then((response) => {
        const token = state?.token
        const userData = state?.userData
        Swal.fire({
          title: "Success Update Recipe!",
          text: "Success Update Recipe! Go to your profile",
          icon: "success",
        }).then(() => {
          axios
            .get(
              `${process.env.REACT_APP_BASE_URL}/recipes?user_id=${userData?.id}`
            )
            .then((response) => {
              const recipes = response?.data?.data
              dispatch(addAuth({ auth: true, userData, token, recipes }))
              navigate("/profile")
            })
            .catch((error) => {
              console.log(error)
            })
        })
      })
      .catch((error) => {
        console.log(error)
        Swal.fire({
          title: "Error!",
          text: error?.response?.data?.message ?? "Something wrong in our App!",
          icon: "error",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <Navbar />

      <div className="container py-5 mb-5 animate__animated animate__zoomIn">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row py-3 justify-content-md-center">
            <div className="col-md-7 d-grid">
              <div className="text-center mb-2">
                <img
                  src={recipe?.recipePicture}
                  alt="user-icon"
                  width={"80%"}
                />
              </div>
              <input
                className="form-control mb-3"
                type="file"
                id="formFile"
                onChange={(e) => setRecipePicture(e.target.files[0])}
              />
              <input
                type="text"
                className="form-control mb-3"
                name="fullname"
                id="fullname"
                placeholder="Fullname"
                defaultValue={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="category"
                  aria-label="Floating label select example"
                  defaultValue={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="rice">Rice</option>
                  <option value="noodle">Noodle</option>
                  <option value="soup">Soup</option>
                  <option value="dessert">Dessert</option>
                  <option value="spicy">spicy</option>
                  <option value="uncategorized">Uncategorized</option>
                </select>
                <label for="category">Category</label>
              </div>
              <textarea
                className="form-control mb-1"
                name="ingredients"
                id="ingredients"
                cols="35"
                rows="5"
                defaultValue={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Ingredients"
              ></textarea>
              <small className="mb-3">
                * Write the ingredients with a comma separator (salt, paper,
                etc...)
              </small>
              <input
                type="text"
                className="form-control mb-1"
                name="video"
                id="video"
                placeholder="Video"
                defaultValue={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
              />
              <small className="mb-3">* Please use youtube link</small>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#efc81a", color: "#fff" }}
                  onClick={handleUpdateRecipe}
                >
                  {isLoading ? "Loading..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </>
  )
}

export default EditRecipe
