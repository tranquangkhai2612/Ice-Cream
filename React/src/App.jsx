import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/User/LoginPage';
import RegisterPage from './pages/User/RegisterPage';
import Profile from './pages/User/Profile';
import ForgotPassword from './pages/User/ForgotPassword';
import Home from './pages/User/Home';
import ResetPassword from './pages/User/ResetPassword';
// import RtlLayout from "layouts/rtl";
// import AdminLayout from "layouts/admin";
// import AuthLayout from "layouts/auth";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        {/* <Route path="auth/*" element={<AuthLayout />} />
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="rtl/*" element={<RtlLayout />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
