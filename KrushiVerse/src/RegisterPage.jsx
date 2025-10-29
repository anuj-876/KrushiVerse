import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Stepper = ({ step }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", width: "100%"
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: step >= 1 ? "#22C55E" : "#E5E7EB",
      color: "#fff", fontWeight: "bold", fontSize: 18,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>1</div>
    <div style={{
      flex: 1, height: 5, borderRadius: 3,
      background: step >= 2 ? "#22C55E" : "#E5E7EB"
    }} />
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: step >= 2 ? "#22C55E" : "#E5E7EB",
      color: step >= 2 ? "#fff" : "#222", fontWeight: "bold", fontSize: 18,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>2</div>
    <span style={{ marginLeft: "18px", fontSize: 15, color: "#7F7F7F", fontWeight: "bold" }}>
      Step {step} of 2
    </span>
  </div>
);

const Modal = ({ open, onClose, onPrimary }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99
    }}>
      <div style={{
        width: "100%", maxWidth: 420, background: "#fff", borderRadius: 18, padding: 28,
        boxShadow: "0 16px 56px rgba(0,0,0,0.14)"
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: "#D1FADF",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px"
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#22C55E" />
            <path d="M8 12.5l2.8 2.5L16 9" stroke="#fff" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 style={{ fontSize: 22, textAlign: "center", fontWeight: "900", marginBottom: 12 }}>Registration Successful!</h3>
        <p style={{ textAlign: "center", color: "#697384", fontSize: 15 }}>
          Your account has been created successfully.<br />Welcome to SmartKrishi!
        </p>
        <button onClick={onPrimary} style={{
          marginTop: 20, width: "100%", background: "#22C55E", color: "#fff", border: "none",
          borderRadius: 8, padding: "14px 0", fontWeight: "bold", fontSize: 16, cursor: "pointer"
        }}>Continue to Dashboard</button>
        <button onClick={onClose} style={{
          width: "100%", marginTop: 10, background: "#F4F8FC", color: "#403E3E",
          border: "none", borderRadius: 8, padding: 12, fontWeight: "bold", cursor: "pointer"
        }}>Close</button>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [farmerType, setFarmerType] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateStep1 = () => {
    const err = {};
    if (!fullName.trim()) err.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Enter a valid email.";
    if (!/^\+?\d[\d\s-]{7,}$/.test(phone)) err.phone = "Enter a valid phone number.";
    if (password.length < 6) err.password = "Password must be at least 6 characters.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep2 = () => {
    const err = {};
    if (!location.trim()) err.location = "Location is required.";
    if (!farmerType.trim()) err.farmerType = "Please select your type.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onContinue = e => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const onCreate = e => {
    e.preventDefault();
    if (validateStep2()) setSuccess(true);
  };

  const goDashboard = () => {
    setSuccess(false);
    navigate("/dashboard");
  };

  const Field = ({ label, children, error }) => (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "block", fontWeight: "bold", fontSize: 18, marginBottom: 9, color: "#23272e" }}>{label}</label>
      {children}
      {error && <div style={{ color: "#EF4444", fontSize: 14, marginTop: 10 }}>{error}</div>}
    </div>
  );

  return (
    <div style={{
      fontFamily: "sans-serif",
      background: "#FAFBFA",
      minHeight: "100vh",
      boxSizing: "border-box"
    }}>
      <div style={{
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        background: "#f9fafb",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "920px",
          margin: "42px auto",
          background: "#fff",
          borderRadius: 30,
          padding: "44px 4vw",
          boxShadow: "0 8px 46px rgba(80,100,120,0.10)",
          boxSizing: "border-box"
        }}>
          <div style={{ textAlign: "center", marginBottom: 34 }}>
            <div style={{ color: "#22C55E", fontWeight: 800, fontSize: 34, fontFamily: "cursive" }}>SmartKrishi</div>
            <h1 style={{ color: "#172432", fontSize: 38, fontWeight: 900, margin: "10px 0 8px" }}>Create your account</h1>
            <div style={{ color: "#6B7280", fontSize: 20, fontWeight: 500 }}>Join thousands of farmers using AI to transform agriculture</div>
          </div>

          <Stepper step={step} />

          {step === 1 ? (
            <form onSubmit={onContinue} noValidate>
              <Field label="Full Name" error={errors.fullName}>
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%", padding: 18, borderRadius: 12,
                    border: `2px solid ${errors.fullName ? "#EF4444" : "#E5E7EB"}`,
                    fontSize: 18, outline: "none"
                  }}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: "100%", padding: 18, borderRadius: 12,
                    border: `2px solid ${errors.email ? "#EF4444" : "#E5E7EB"}`,
                    fontSize: 18, outline: "none"
                  }}
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  style={{
                    width: "100%", padding: 18, borderRadius: 12,
                    border: `2px solid ${errors.phone ? "#EF4444" : "#E5E7EB"}`,
                    fontSize: 18, outline: "none"
                  }}
                />
              </Field>
              <Field label="Password" error={errors.password}>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password"
                  style={{
                    width: "100%", padding: 18, borderRadius: 12,
                    border: `2px solid ${errors.password ? "#EF4444" : "#E5E7EB"}`,
                    fontSize: 18, outline: "none"
                  }}
                />
              </Field>
              <button type="submit"
                style={{
                  width: "100%", background: "#22C55E", color: "#fff",
                  border: "none", borderRadius: 12, padding: 18, fontWeight: "bold", fontSize: 20, marginTop: 12, cursor: "pointer"
                }}>
                Continue
              </button>
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 17 }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#22C55E", fontWeight: 700, textDecoration: "none" }}>Sign in here</Link>
              </div>
            </form>
          ) : (
            <form onSubmit={onCreate} noValidate>
              <Field label="Location" error={errors.location}>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  style={{
                    width: "100%", padding: 18, borderRadius: 12,
                    border: `2px solid ${errors.location ? "#EF4444" : "#22C55E"}`,
                    fontSize: 18, outline: "none"
                  }}
                />
              </Field>
              <Field label="Type of Farmer" error={errors.farmerType}>
                <select
                  value={farmerType}
                  onChange={e => setFarmerType(e.target.value)}
                  style={{
                    width: "100%", padding: 18, borderRadius: 12,
                    border: `2px solid ${errors.farmerType ? "#EF4444" : "#E5E7EB"}`,
                    fontSize: 18
                  }}
                >
                  <option value="">Select your type</option>
                  <option value="smallholder">Smallholder</option>
                  <option value="commercial">Commercial</option>
                  <option value="organic">Organic</option>
                  <option value="horticulture">Horticulture</option>
                </select>
              </Field>
              <button type="submit"
                style={{
                  width: "100%", background: "#22C55E", color: "#fff",
                  border: "none", borderRadius: 12, padding: 18, fontWeight: "bold", fontSize: 20, marginTop: 12, cursor: "pointer"
                }}>
                Create Account
              </button>
              <button type="button" onClick={() => setStep(1)}
                style={{
                  marginTop: 18, width: "100%", background: "#F3F4F6", color: "#121",
                  border: "none", borderRadius: 12, padding: 14, fontWeight: "bold", fontSize: 17, cursor: "pointer"
                }}>
                Back
              </button>
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 17 }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#22C55E", fontWeight: 700, textDecoration: "none" }}>Sign in here</Link>
              </div>
            </form>
          )}
          <Modal open={success} onClose={() => setSuccess(false)} onPrimary={goDashboard} />
        </div>
      </div>
    </div>
  );
}
