import React from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addAuth } from "../store/reducers/auth"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Swal from "sweetalert2"

import "../styles/Profile.css"

function EditProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((reducer) => reducer.auth)
  const profile = React.useState(state?.userData)
  const [isLoading, setIsLoading] = React.useState(false)
  const [profilePicture, setProfilePicture] = React.useState(
    state?.userData?.profilePicture
  )
  const [fullname, setFullname] = React.useState(state?.userData?.fullname)
  const [phoneNumber, setPhoneNumber] = React.useState(
    state?.userData?.phoneNumber
  )

  React.useEffect(() => {
    if (!state.auth) {
      navigate("/login")
    }
  }, [])

  const handleUpdateProfile = () => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("photo", profilePicture)
    if (profilePicture.length != 0) {
      axios
        .patch(`${process.env.REACT_APP_BASE_URL}/users/photo`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/users`, {
        fullname,
        phoneNumber,
      })
      .then((response) => {
        const token = state?.token
        const newData = response?.data?.data[0]
        const recipes = state?.recipes
        Swal.fire({
          title: "Success Update Profile!",
          text: "Success Update Profile! Go to your profile",
          icon: "success",
        }).then(() => {
          dispatch(addAuth({ auth: true, userData: newData, token, recipes }))
          navigate("/profile")
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
              <div className="text-center mb-2">
                <img
                  src={profile?.profilePicture}
                  alt="user-icon"
                  width={"50%"}
                />
              </div>
              <input
                className="form-control mb-3"
                type="file"
                id="formFile"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
              <input
                type="text"
                className="form-control mb-3"
                name="fullname"
                id="fullname"
                placeholder="Fullname"
                defaultValue={profile?.fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
              <input
                type="number"
                className="form-control mb-3"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Phone Number"
                defaultValue={profile?.phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#efc81a", color: "#fff" }}
                  onClick={handleUpdateProfile}
                >
                  {isLoading ? "Loading..." : "Update"}
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

export default EditProfile
