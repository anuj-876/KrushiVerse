import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./HomePage";
import About from "./AboutPage";
import CropInsights from "./CropInsightsPage";
import ContactPage from "./ContactPage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";  // ✅ Import Login Page

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/crop-insights" element={<CropInsights />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />  {/* ✅ Added Login Route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
