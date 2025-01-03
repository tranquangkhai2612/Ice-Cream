import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./styles/Home.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AboutUs() {
  return (
    <div>
      <Navbar />
      <div className="right-layer animate__animated animate__fadeIn"></div>

      <div className="container mt-4" style={{ height: "600px" }}>
        <div className="row flex-column-reverse gap-5 flex-lg-row py-5">
          <div className="col-8 col-lg-6 align-self-center animate__animated animate__fadeInLeft">
            <h5
              className="text-lg-start "
              style={{ color: "#2e266f" }}
            >
                <h2>Welcome to our Ice Cream Recipe Haven! <br/></h2>
              
              We are a passionate team dedicated to bringing you the most delightful and innovative ice
              cream recipes. <br/>
              Our mission is to make ice cream making accessible
              to everyone, from beginners to seasoned dessert chefs. <br/>
              What We Offer: <br/>
              Diverse Recipes: From classic vanilla to exotic flavors.<br/>
              Step-by-Step Guides: Detailed instructions for perfect results.<br/>
              Community Engagement: Share your creations and get feedback.<br/>
              Expert Tips: Learn from our team of experts. <br/>
              Join us on this sweet
              journey and let's create something delicious together!
            </h5>
          </div>
          <div className="col text-center text-lg-end animate__animated animate__fadeInRight">
            <img
              src="./img/about-us.avif"
              alt="food"
              style={{ width: "55%" }}
            />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default AboutUs;
