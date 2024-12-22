import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import "./pages/User/styles/Auth.css"
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/User/LoginPage';
import RegisterPage from './pages/User/RegisterPage';
import Profile from './pages/User/Profile';
import ForgotPassword from './pages/User/ForgotPassword';
import Home from './pages/User/Home';
import ResetPassword from './pages/User/ResetPassword';
import AboutUs from "./pages/User/AboutUs";
import Order from "./pages/User/Order"
import ContactUs from "./pages/User/ContactUs";
import Product from "./pages/User/Product";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/order" element={<Order />} />
        <Route path="/product" element={<Product />} />
        <Route path="/" index element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
