import React from "react"

function RecipeCard(props) {
  const { title, image, id } = props
  return (
    <>
      <a
        className="mb-1 col-sm-2 col-md-4 d-flex align-items-end img-popular-recipe text-decoration-none text-black animate__animated animate__fadeIn"
        style={{
          position: "relative",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        href={`/detail-recipe/${id}`}
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
      </a>
    </>
  )
}

export default RecipeCard
