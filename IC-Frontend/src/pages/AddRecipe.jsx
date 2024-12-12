import FormData from "form-data"
import React from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import { useDispatch, useSelector } from "react-redux"
import { addAuth } from "../store/reducers/auth"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function AddRecipe() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)
  const [recipePicture, setRecipePicture] = React.useState([])
  const [title, setTitle] = React.useState("")
  const [category, setCategory] = React.useState("uncategorized")
  const [ingredients, setIngredients] = React.useState("")
  const [videoLink, setVideoLink] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state?.auth) {
      navigate("/login")
    }
  })

  const handleCreateRecipe = () => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("recipePicture", recipePicture)
    formData.append("title", title)
    formData.append("category", category)
    formData.append("ingredients", ingredients)
    formData.append("videoLink", videoLink)
    formData.append("user_id", state?.userData?.id)
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/recipes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const token = state?.token
        const userData = state?.userData
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/recipes?user_id=${state?.userData?.id}`
          )
          .then((response) => {
            const recipes = response?.data?.data
            dispatch(addAuth({ auth: true, userData, token, recipes }))
            Swal.fire({
              title: "Success Create Recipe!",
              text: "Success Create Recipe! Go to your profile",
              icon: "success",
            }).then(() => {
              navigate("/profile")
            })
          })
          .catch((error) => {
            console.log(error)
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
    <div>
      <Navbar />

      <div className="container py-5 mb-5 animate__animated animate__zoomIn">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row py-3 justify-content-md-center">
            <div className="col-md-7 d-grid">
              <input
                className="form-control mb-3"
                type="file"
                id="formFile"
                onChange={(e) => setRecipePicture(e.target.files[0])}
              />
              <input
                type="text"
                className="form-control mb-3"
                name="title"
                id="title"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="category"
                  aria-label="Floating label select example"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="rice">Rice</option>
                  <option value="noodle">Noodle</option>
                  <option value="soup">Soup</option>
                  <option value="dessert">Dessert</option>
                  <option value="spicy">Spicy</option>
                  <option value="uncategorized" selected>
                    Uncategorized
                  </option>
                </select>
                <label for="category">Category</label>
              </div>
              <textarea
                className="form-control mb-1"
                name="ingredients"
                id="ingredients"
                cols="35"
                rows="5"
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
                onChange={(e) => setVideoLink(e.target.value)}
              />
              <small className="mb-3">* Please use youtube link</small>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#efc81a", color: "#fff" }}
                  onClick={handleCreateRecipe}
                >
                  {isLoading ? "Loading..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}

export default AddRecipe
