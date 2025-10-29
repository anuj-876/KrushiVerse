import React from "react";

export default function CropInsights() {
  return (
    <main
      style={{
        fontFamily: "sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
        width: "100vw",
        boxSizing: "border-box",
        padding: "56px 0",
        color: "#111827",
      }}
    >
      <div style={{
        width: "100%",
        padding: "0 32px",
        boxSizing: "border-box",
      }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: "bold", marginBottom: "20px" }}>Crop Insights</h1>
        <p style={{ fontSize: "1.3rem" }}>
          View agricultural data, crop monitoring, and predictive analytics to enhance your farming decisions.
        </p>
      </div>
    </main>
  );
}
