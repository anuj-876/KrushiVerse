import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const subjects = ["General Inquiry", "Technical Support", "Sales", "Other"];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const err = {};
    if (!formData.fullName.trim()) err.fullName = "Full name is required.";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      err.email = "Valid email required.";
    if (!formData.subject) err.subject = "Please select a subject.";
    if (!formData.message.trim()) err.message = "Message cannot be empty.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setFormData({ fullName: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#FAFBFA",
        minHeight: "100vh",
        padding: "40px 20px",
        boxSizing: "border-box",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          margin: 0,
          padding: "0 20px",
          width: "100%",
          boxSizing: "border-box",
          maxWidth: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 24,
            color: "#111827",
          }}
        >
          Contact Us
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            textAlign: "center",
            color: "#4B5563",
            marginBottom: 48,
            lineHeight: 1.5,
          }}
        >
          Reach out to our team for assistance and inquiries. We are here to
          support you.
        </p>

        {/* Updated heading size */}
        <h2
          style={{
            fontSize: "2rem", // reduced from 2.75rem
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 32,
            color: "#111827",
          }}
        >
          Send Us a Message
        </h2>

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignItems: "center",
          }}
        >
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name*"
            style={{
              width: "100%",
              padding: 18,
              fontSize: 18,
              borderRadius: 14,
              border: errors.fullName
                ? "2.5px solid #EF4444"
                : "1.8px solid #CBD5E1",
              boxSizing: "border-box",
              outline: "none",
              maxWidth: 640,
            }}
          />
          {errors.fullName && (
            <div style={{ color: "#EF4444", fontSize: 15 }}>
              {errors.fullName}
            </div>
          )}

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address*"
            style={{
              width: "100%",
              padding: 18,
              fontSize: 18,
              borderRadius: 14,
              border: errors.email
                ? "2.5px solid #EF4444"
                : "1.8px solid #CBD5E1",
              boxSizing: "border-box",
              outline: "none",
              maxWidth: 640,
            }}
          />
          {errors.email && (
            <div style={{ color: "#EF4444", fontSize: 15 }}>
              {errors.email}
            </div>
          )}

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 18,
              fontSize: 18,
              borderRadius: 14,
              border: errors.subject
                ? "2.5px solid #EF4444"
                : "1.8px solid #CBD5E1",
              boxSizing: "border-box",
              color: formData.subject === "" ? "#9CA3AF" : "#111827",
              maxWidth: 640,
            }}
            required
          >
            <option value="" disabled>
              Select Subject*
            </option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <div style={{ color: "#EF4444", fontSize: 15 }}>
              {errors.subject}
            </div>
          )}

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here*"
            rows={6}
            style={{
              width: "100%",
              padding: 18,
              fontSize: 18,
              borderRadius: 14,
              border: errors.message
                ? "2.5px solid #EF4444"
                : "1.8px solid #CBD5E1",
              boxSizing: "border-box",
              resize: "vertical",
              outline: "none",
              maxWidth: 640,
            }}
          />
          {errors.message && (
            <div style={{ color: "#EF4444", fontSize: 15 }}>
              {errors.message}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 22,
              backgroundColor: "#22C55E",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              fontSize: 18, // fixed from 10 (too small)
              borderRadius: 16,
              cursor: "pointer",
              maxWidth: 640,
            }}
          >
            Send Message
          </button>

          {submitted && (
            <p
              style={{
                color: "#22C55E",
                fontWeight: "bold",
                fontSize: 18,
                marginTop: 24,
                textAlign: "center",
              }}
            >
              Thank you for contacting us! We will be in touch shortly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
