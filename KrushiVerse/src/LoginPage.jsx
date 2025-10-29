import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call your PHP API
    try {
      const res = await fetch("http://localhost/krushiversaU.A/login_api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
        credentials: "include", // for PHP sessions
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to your SmartKrishiLanding page
        navigate("/home"); // make sure your route matches
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Network error. Try again later.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>Login</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Email or Phone</label>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10, background: "#22C55E", color: "#fff", border: "none", borderRadius: 4 }}>
          Login
        </button>
      </form>
    </div>
  );
}
