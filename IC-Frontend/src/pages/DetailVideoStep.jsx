import React from "react"
import { useLocation } from "react-router"
import axios from "axios"

import NavbarSecond from "../components/NavbarSecond"
import Footer from "../components/Footer"

function DetailVideoStep() {
  const location = useLocation()
  const id = location?.pathname?.split("/")[2]
  const [currentRecipe, setCurrentRecipe] = React.useState(null)
  React.useEffect(() => {
    window.scroll(0, 0)
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/recipes/${id}`)
      .then((response) => {
        setCurrentRecipe(response.data.data[0])
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const idVideo = currentRecipe?.videoLink?.split("/")[3]

  return (
    <div>
      <NavbarSecond />

      <div className="container py-5 animate__animated animate__fadeIn vh-100">
        <div className="row flex-column flex-md-row pb-5">
          <div className="col text-center">
            <h3 className="mb-4">{currentRecipe?.title}</h3>
            <iframe
              width="1000"
              height="500"
              src={`https://www.youtube.com/embed/${idVideo}`}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default DetailVideoStep
