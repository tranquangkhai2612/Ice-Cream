import React from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addAuth } from "../store/reducers/auth"

import "../styles/RecipeCardThird.css"

function RecipeCard(props) {
  const { title, image, id } = props
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)

  const handleDeleteRecipe = (id) => {
    Swal.fire({
      title: "Do you want to delete this recipe?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log(id)
        axios
          .delete(`${process.env.REACT_APP_BASE_URL}/recipes/${id}`)
          .then((response) => {
            const userData = state?.userData
            const token = state?.token
            axios
              .get(
                `${process.env.REACT_APP_BASE_URL}/recipes?user_id=${userData?.id}`
              )
              .then((response) => {
                const recipes = response?.data?.data
                dispatch(addAuth({ auth: true, userData, token, recipes }))
                Swal.fire("Deleted!", "", "success").then(() => {
                  window.location.href = "/profile"
                })
              })
              .catch((error) => {
                console.log(error)
              })
          })
          .catch((error) => {
            console.log(error)
          })
      } else if (result.isDenied) {
        Swal.fire("Recipe are not deleted", "", "info")
      }
    })
  }

  return (
    <>
      <Link
        className="mb-1 col-sm-2 col-md-4 d-flex align-items-end img-popular-recipe text-decoration-none text-black animate__animated animate__fadeIn"
        style={{
          position: "relative",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        to={`/detail-recipe/${id}`}
      >
        <div
          style={{
            display: "none",
            margin: 0,
            padding: 0,
            position: "absolute",
            backgroundColor: "#EFC81A",
            height: "100%",
            width: "100%",
            opacity: "30%",
            borderRadius: "3%",
            left: 0,
            zIndex: -1,
          }}
        ></div>
        <p
          className="fs-3 fw-medium"
          style={{ textShadow: "4px 4px 10px rgba(239, 200, 26, 1)" }}
        >
          {title}
        </p>
        <div className="edit">
          <Link
            className="btn"
            style={{ backgroundColor: "#efc81a", color: "#fff" }}
            to={`../edit-recipe/${id}`}
          >
            Edit
          </Link>
          <Link
            to={"#"}
            className="btn"
            style={{ backgroundColor: "#fff", color: "#efc81a" }}
            onClick={() => {
              handleDeleteRecipe(id)
            }}
          >
            Delete
          </Link>
        </div>
      </Link>
    </>
  )
}

export default RecipeCard
