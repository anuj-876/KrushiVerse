import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "#22C55E" : "#333",
    textDecoration: "none",
    fontWeight: isActive(path) ? "700" : "500",
    fontSize: "1rem",
    cursor: "pointer",
  });

  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 5vw",
        background: "#fff",
        boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          color: "#22C55E",
          fontWeight: 800,
          fontSize: "1.6rem",
          fontFamily: "cursive",
          textDecoration: "none",
          marginBottom: "8px",
        }}
      >
        कृषी Verse
      </Link>

      {/* Main Nav Links */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" style={linkStyle("/")}>
          Home
        </Link>
        <Link to="/about" style={linkStyle("/about")}>
          About
        </Link>
        <Link to="/crop-insights" style={linkStyle("/crop-insights")}>
          Crop Insights
        </Link>
        <Link to="/contact" style={linkStyle("/contact")}>
          Contact
        </Link>
      </div>

      {/* Auth Buttons */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          marginTop: "8px",
        }}
      >
        <Link
          to="/login"
          style={{
            ...linkStyle("/login"), // ✅ Now highlights like other links
          }}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{
            background: isActive("/register") ? "#16A34A" : "#22C55E", // ✅ Darker green when active
            color: "white",
            padding: "8px 20px",
            borderRadius: "8px",
            fontWeight: "700",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
