import React, { useState, useEffect } from "react";

const regions = [
  "India",
  "Punjab",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
  "Gujarat",
  "Rajasthan",
  "Kerala",
];

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("India");

  const fetchNews = () => {
    setLoading(true);
    fetch(
      `https://newsapi.org/v2/everything?q=agriculture AND ${selectedRegion}&language=en&sortBy=publishedAt&pageSize=10&apiKey=7fad784bb7e04da284b62f77327bc219`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then((data) => {
        setArticles(data.articles);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNews();

    const intervalId = setInterval(() => {
      fetchNews();
    }, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [selectedRegion]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        paddingTop: "2rem",
        paddingBottom: "3rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 2rem",
          boxSizing: "border-box",
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 
            style={{ 
              fontSize: "3rem", 
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "0.5rem",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            🌾 Agriculture News
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            color: "#6b7280", 
            maxWidth: "600px", 
            margin: "0 auto 2rem",
            lineHeight: "1.6"
          }}>
            Stay updated with the latest agricultural developments from {selectedRegion}
          </p>

          {/* Region Selector */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#ffffff",
              padding: "0.75rem 1.5rem",
              borderRadius: "50px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <label
              htmlFor="region-select"
              style={{
                marginRight: "1rem",
                fontWeight: "600",
                fontSize: "1rem",
                color: "#374151",
              }}
            >
              📍 Select Region:
            </label>
            <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "25px",
                border: "2px solid #22c55e",
                minWidth: 180,
                background: "#f9fafb",
                color: "#374151",
                fontWeight: "500",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading, Error, and Empty States */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ 
              display: "inline-block",
              padding: "1.5rem 2rem",
              background: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f4f6",
                borderTop: "4px solid #22c55e",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                transform: "rotate(0deg)",
                animation: "spin 1s linear infinite"
              }}></div>
              <style dangerouslySetInnerHTML={{
                __html: `
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `
              }} />
              <p style={{ color: "#374151", fontSize: "1.1rem", fontWeight: "500" }}>
                Loading latest agriculture news...
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{
              display: "inline-block",
              padding: "1.5rem 2rem",
              background: "#fef2f2",
              borderRadius: "20px",
              border: "1px solid #fecaca",
            }}>
              <p style={{ color: "#dc2626", fontSize: "1.1rem", fontWeight: "500" }}>
                ❌ Error: {error}
              </p>
            </div>
          </div>
        )}
        
        {!loading && !error && articles.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{
              display: "inline-block",
              padding: "1.5rem 2rem",
              background: "#fffbeb",
              borderRadius: "20px",
              border: "1px solid #fed7aa",
            }}>
              <p style={{ color: "#d97706", fontSize: "1.1rem", fontWeight: "500" }}>
                📰 No news available for {selectedRegion}
              </p>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {articles.map((article, index) => (
            <article
              key={index}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                border: "1px solid #f3f4f6",
                cursor: "pointer",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
              }}
            >
              {article.urlToImage && (
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    style={{ 
                      width: "100%", 
                      height: "220px", 
                      objectFit: "cover",
                      transition: "transform 0.3s ease"
                    }}
                    loading="lazy"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  height: "280px",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: "1rem",
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#1f2937",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    flex: "0 0 auto",
                  }}
                >
                  {article.title}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    color: "#6b7280",
                    marginBottom: "1.5rem",
                    display: "-webkit-box",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    flex: "1 1 auto",
                  }}
                >
                  {article.description || "Click to read the full article..."}
                </p>
                <div style={{ marginTop: "auto" }}>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "25px",
                      fontWeight: "600",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease",
                      marginBottom: "1rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Read Full Article →
                  </a>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.8rem",
                      color: "#9ca3af",
                      paddingTop: "1rem",
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>
                      📰 {article.source.name}
                    </span>
                    <span>
                      📅 {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
