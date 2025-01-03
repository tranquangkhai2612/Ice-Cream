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
import ProductDetail from "./pages/User/ProductDetail";
import FAQ from "./pages/User/FAQ.jsx";
import FAQDetail from "./pages/User/FAQdetail";
import Book from "./pages/User/Book";
import BookDetail from "./pages/User/BookDetail";
import OrderBill from "./pages/User/OrderBill";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:email/:token"
          element={<ResetPassword />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/order" element={<Order />} />
        <Route path="/detail-recipe/:id" element={<ProductDetail />} />
        <Route path="/recipe" element={<Product />} />
        <Route path="/" index element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/faq/:id" element={<FAQDetail />} />
        <Route path="/Book" element={<Book />} />
        <Route path="/detail-book/:id" element={<BookDetail />} />
        <Route path="/bill/:orderId" element={<OrderBill />} />
      </Routes>
    </Router>
  );
};

export default App;
