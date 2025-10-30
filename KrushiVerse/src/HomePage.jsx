import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  IconButton, 
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography, 
  CircularProgress,
  Tooltip
} from "@mui/material";
import { 
  Mic, 
  MicOff, 
  Send, 
  Translate, 
  VolumeUp 
} from "@mui/icons-material";

// Get API URL from environment variable (Vite uses import.meta.env)
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8002";

// SVG Tick Icon
const TickIcon = (
  <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#D1FADF" />
    <path d="M6.5 10.5L9 13L14 8" stroke="#12B76A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const solutionCards = [
  {
    iconBg: "#d7f8e2",
    iconColor: "#22C55E",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" stroke="#22C55E" strokeWidth="2" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#22C55E" strokeWidth="2" />
      </svg>
    ),
    title: "AI-Powered Plant Growth",
    desc: "Boost crop performance with AI-driven insights that optimize growth stages, from seedling to harvest, ensuring healthier plants and higher productivity."
  },
  {
    iconBg: "#e6f3fb",
    iconColor: "#23b0ff",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path d="M20 17.58A4.422 4.422 0 0 0 16.2 13H7.8A4.424 4.424 0 0 0 4 17.58V18a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-.42" stroke="#23b0ff" strokeWidth="2" />
        <path d="M9 14V9a3 3 0 1 1 6 0v5" stroke="#23b0ff" strokeWidth="2" />
      </svg>
    ),
    title: "Weather Prediction",
    desc: "Advanced weather forecasting with hyperlocal predictions to help plan irrigation, harvesting, and protection strategies."
  },
  {
    iconBg: "#fff3e6",
    iconColor: "#ff7f35",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <rect x="6" y="10" width="2" height="8" fill="#ff7f35" />
        <rect x="11" y="6" width="2" height="12" fill="#ff7f35" />
        <rect x="16" y="14" width="2" height="4" fill="#ff7f35" />
      </svg>
    ),
    title: "Yield Optimization",
    desc: "AI-driven recommendations for fertilizer application, irrigation scheduling, and harvest timing to maximize your yield."
  }
];

const farmingFeatures = [
  {
    title: "Remote Sensing Technology",
    desc: "Analyze crop health from space using multispectral satellite imagery and drone surveillance."
  },
  {
    title: "Predictive Analytics",
    desc: "Forecast crop diseases, pest outbreaks, and optimal harvest times with 95% accuracy."
  },
  {
    title: "Smart Recommendations",
    desc: "Get personalized advice on irrigation, fertilization, and crop protection based on your conditions."
  }
];

export default function SmartKrishiLanding() {
  const [isChatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "नमस्कार! मी आपला कृषी सहाय्यक आहे. मला शेती, पीक आणि कृषी तंत्राबद्दल प्रश्न विचारा. 🌾\n\nHello! I'm your agricultural assistant. Ask me about farming, crops, and agricultural techniques.", sender: "ai", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Language options for speech recognition
  const languages = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "en-IN", name: "English (India)", flag: "🇮🇳" },
    { code: "hi-IN", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
    { code: "mr-IN", name: "मराठी (Marathi)", flag: "🇮🇳" }
  ];

  // Speech Recognition Functions (using Web Speech API)
  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = selectedLanguage;
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      console.log(`🎤 Speech recognition started in ${selectedLanguage}`);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log(`� Recognized: "${transcript}"`);
      setInputValue(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error(`❌ Speech recognition error:`, event.error);
      setIsListening(false);
      
      let errorMessage = "Speech recognition error: ";
      switch(event.error) {
        case 'network':
          errorMessage += "Network connection required for speech recognition.";
          break;
        case 'not-allowed':
          errorMessage += "Microphone access denied. Please allow microphone access.";
          break;
        case 'no-speech':
          errorMessage += "No speech detected. Please try again.";
          break;
        default:
          errorMessage += event.error;
      }
      alert(errorMessage);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      console.log("🏁 Speech recognition ended");
    };

    recognitionRef.current.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // API Communication
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    
    const userMessage = { 
      text: messageText, 
      sender: "user", 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Try API first, fallback to local responses
      let aiResponse = null;
      
      try {
        const response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            language: selectedLanguage,
            session_id: sessionId
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.response;
          // Store session ID for conversation continuity
          if (data.session_id && !sessionId) {
            setSessionId(data.session_id);
          }
        }
      } catch (apiError) {
        console.log("API not available, using local responses");
      }

      // Fallback to local responses if API fails
      if (!aiResponse) {
        const msg = messageText.toLowerCase();
        const agriKeywords = ['crop', 'farm', 'plant', 'seed', 'शेती', 'पीक', 'कृषी', 'किसान', 'tomato', 'wheat', 'irrigation', 'fertilizer'];
        
        if (agriKeywords.some(keyword => msg.includes(keyword))) {
          if (msg.includes('tomato') || msg.includes('टमाटर')) {
            aiResponse = "🍅 **टोमॅटो पिकवण्यासाठी:**\n• चांगली निचरा असलेली जमीन वापरा\n• योग्य अंतरावर रोपे लावा (2-3 फूट)\n• नियमित पाणी द्या पण जास्त नाही\n• NPK खत वापरा\n\n**For tomato cultivation:**\n• Use well-drained soil\n• Plant with proper spacing (2-3 feet)\n• Regular but not excessive watering\n• Use NPK fertilizer";
          } else if (msg.includes('wheat') || msg.includes('गहू')) {
            aiResponse = "🌾 **गहू पिकवण्यासाठी:**\n• ऑक्टोबर-नोव्हेंबरमध्ये पेरणी करा\n• 100-125 किलो बीज प्रति हेक्टर\n• योग्य खत व्यवस्थापन\n• तण नियंत्रण महत्वाचे\n\n**Wheat cultivation:**\n• Sow in October-November\n• 100-125 kg seeds per hectare\n• Proper fertilizer management\n• Weed control is important";
          } else if (msg.includes('water') || msg.includes('irrigation') || msg.includes('पाणी')) {
            aiResponse = "💧 **पाणी व्यवस्थापन:**\n• सकाळी किंवा संध्याकाळी पाणी द्या\n• ड्रिप इरिगेशन वापरा\n• माती ओली ठेवा पण भिजवू नका\n• पावसाळ्यात कमी पाणी द्या\n\n**Water management:**\n• Water in morning or evening\n• Use drip irrigation\n• Keep soil moist but not waterlogged\n• Reduce watering in monsoon";
          } else {
            aiResponse = "🌾 **कृषी सल्ला / Agricultural Advice**\n\nमी तुमचा कृषी सहाय्यक आहे! मला पुढील विषयांबद्दल विचारा:\nI am your agricultural assistant! Ask me about:\n\n🌱 **पीक लागवड / Crop Cultivation**\n• टोमॅटो, गहू, भाजीपाला / Tomato, Wheat, Vegetables\n\n💧 **पाणी व्यवस्थापन / Water Management**\n• पाणी पुरवठा / Irrigation methods\n\n🌿 **खत व्यवस्थापन / Fertilizer Management**\n• सेंद्रिय खत / Organic fertilizers\n\nअधिक विशिष्ट प्रश्न विचारा! Ask more specific questions!";
          }
        } else {
          aiResponse = "मला केवळ शेती आणि कृषी संबंधी प्रश्नांची उत्तरे देता येतात. कृपया शेतीबद्दल प्रश्न विचारा.\n\nI can only answer agriculture and farming related questions. Please ask about farming topics.";
        }
      }
      
      const aiMessage = {
        text: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        text: "क्षमा करा, मला तुमच्या प्रश्नाचे उत्तर देण्यात समस्या आली आहे. कृपया पुन्हा प्रयत्न करा.\n\nSorry, I'm having trouble responding to your question. Please try again.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ 
      fontFamily: "sans-serif", 
      background: "#f9fafb", 
      minHeight: "100vh",
      width: "100%",
      maxWidth: "100vw",
      boxSizing: "border-box",
      overflowX: "hidden",
      margin: 0,
      padding: 0
    }}>
      {/* HERO SECTION */}
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px 4vw",
          minHeight: "60vh",
          maxWidth: "1400px",
          margin: "0 auto",
          background:
            "linear-gradient(90deg,rgba(255,255,255,0.8) 60%,rgba(255,255,255,0.1)), url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1350&q=80') right/cover",
        }}
      >
        <div style={{ 
          flex: "1 1 450px", 
          minWidth: "300px",
          maxWidth: "600px",
          marginBottom: "2rem"
        }}>
          <h1 style={{ 
            fontSize: "clamp(2rem, 4vw, 3.5rem)", 
            fontWeight: "bold", 
            marginBottom: "1.5rem", 
            color: "#111827",
            lineHeight: "1.2"
          }}>
            Empowering Farmers<br />with AI
          </h1>
          <p style={{ 
            fontSize: "clamp(1rem, 2vw, 1.25rem)", 
            color: "#374151", 
            marginBottom: "2rem",
            lineHeight: "1.6"
          }}>
            Revolutionize farming with advanced AI solutions designed to boost productivity, reduce risks, and maximize crop yield.
          </p>
          <button
            style={{
              background: "#22C55E",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "16px 32px",
              fontSize: "clamp(1rem, 1.5vw, 1.1rem)",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onClick={() => navigate("/crop-insights")}
            onMouseEnter={(e) => e.target.style.background = "#16A34A"}
            onMouseLeave={(e) => e.target.style.background = "#22C55E"}
          >
            Get Insights
          </button>
        </div>
        <div style={{ 
          flex: "1 1 400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
            alt="Drone"
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "auto",
              borderRadius: 22,
              boxShadow: "0 8px 32px rgba(0,0,0,0.14)"
            }}
          />
        </div>
      </section>

      {/* SOLUTION CARDS */}
      <section style={{ 
        background: "#f7fafe", 
        padding: "60px 4vw 50px",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ 
          textAlign: "center", 
          marginBottom: "2rem",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          <h2 style={{ 
            fontWeight: "bold", 
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)", 
            color: "#23272e", 
            marginBottom: "1rem",
            lineHeight: "1.3"
          }}>
            Intelligent Agriculture Solutions
          </h2>
          <div style={{ 
            fontSize: "clamp(1rem, 1.5vw, 1.2rem)", 
            color: "#556080",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Harness the power of AI to make informed farming decisions and optimize operations.
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 1rem"
          }}
        >
          {solutionCards.map(({ iconBg, icon, title, desc }, idx) => (
            <div
              key={idx}
              style={{
                background: "white",
                borderRadius: 24,
                boxShadow: "0 4px 16px rgba(80,80,120,0.07)",
                padding: "clamp(24px, 4vw, 40px) clamp(20px, 3vw, 28px)",
                textAlign: "left",
                minHeight: "280px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 8px 24px rgba(80,80,120,0.12)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 16px rgba(80,80,120,0.07)";
              }}
            >
              <span
                style={{
                  background: iconBg,
                  borderRadius: 16,
                  padding: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {icon}
              </span>
              <h3 style={{ 
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)", 
                fontWeight: "bold", 
                marginTop: "1.2rem", 
                marginBottom: "0.8rem", 
                color: "#23272e",
                lineHeight: "1.4"
              }}>
                {title}
              </h3>
              <p style={{ 
                fontSize: "clamp(0.9rem, 1.2vw, 1rem)", 
                color: "#6b7a8f", 
                margin: 0,
                lineHeight: "1.6",
                flex: 1
              }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How AI Transforms Farming */}
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(24px, 4vw, 42px)",
          background: "white",
          padding: "clamp(40px, 8vw, 70px) clamp(16px, 4vw, 40px)",
          maxWidth: "100%",
          boxSizing: "border-box"
        }}
      >
        <div style={{ 
          maxWidth: 520, 
          flex: "1 1 clamp(300px, 45%, 350px)",
          minWidth: 0
        }}>
          <h2 style={{ 
            fontWeight: "bold", 
            fontSize: "clamp(1.8rem, 4vw, 2rem)", 
            marginBottom: "clamp(16px, 3vw, 26px)", 
            color: "#23272e",
            lineHeight: 1.3
          }}>
            How AI Transforms Your Farming
          </h2>
          <p style={{ 
            color: "#586074", 
            fontSize: "clamp(1rem, 1.5vw, 1.18rem)", 
            marginBottom: "clamp(20px, 4vw, 32px)",
            lineHeight: 1.6
          }}>
            Our advanced AI combines satellite imagery, weather data, and machine learning to provide actionable insights for modern farmers.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {farmingFeatures.map(({ title, desc }, idx) => (
              <li key={idx} style={{ 
                display: "flex", 
                gap: "clamp(8px, 1.5vw, 10px)", 
                marginBottom: "clamp(20px, 3vw, 28px)", 
                alignItems: "flex-start" 
              }}>
                <span style={{ 
                  flexShrink: 0,
                  transform: "scale(clamp(0.8, 1.2vw, 1))"
                }}>
                  {TickIcon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: "bold", 
                    fontSize: "clamp(1rem, 1.3vw, 1.1rem)", 
                    color: "#113c25", 
                    marginBottom: "clamp(4px, 1vw, 7px)",
                    lineHeight: 1.4
                  }}>
                    {title}
                  </div>
                  <div style={{ 
                    color: "#53606e", 
                    fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                    lineHeight: 1.5
                  }}>
                    {desc}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ 
          flex: "1 1 clamp(280px, 45%, 370px)", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          minWidth: 0
        }}>
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
            alt="AI crop dashboard"
            style={{ 
              width: "100%", 
              maxWidth: "clamp(300px, 80vw, 470px)", 
              height: "auto",
              borderRadius: "clamp(16px, 3vw, 32px)", 
              boxShadow: "0 8px 38px rgba(0,0,0,0.09)",
              objectFit: "cover"
            }}
          />
        </div>
      </section>

      {/* Enhanced Floating AI Chatbot */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000 }}>
        {!isChatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#fff",
              color: "#000",
              border: "none",
              borderRadius: 14,
              padding: "18px 28px",
              fontSize: 16,
              fontWeight: 500,
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
              alt="Chat"
              style={{ width: 22, height: 22 }}
            />
            Ask कृषी Verse AI
          </button>
        ) : (
          <div
            style={{
              width: 400,
              height: 600,
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 10px 32px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                color: "#fff",
                padding: "16px 20px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "18px" }}>🌾</span>
                <span style={{ fontSize: "16px" }}>कृषी Verse AI</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "#fff",
                  fontSize: 16,
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                padding: "16px",
                overflowY: "auto",
                backgroundColor: "#f8fafc"
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "12px",
                    display: "flex",
                    justifyContent: message.sender === "user" ? "flex-end" : "flex-start"
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "12px 16px",
                      borderRadius: message.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: message.sender === "user" ? "#22C55E" : "#fff",
                      color: message.sender === "user" ? "#fff" : "#374151",
                      fontSize: "14px",
                      lineHeight: "1.4",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "12px" }}>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "18px 18px 18px 4px",
                      background: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                  >
                    <CircularProgress size={20} sx={{ color: "#22C55E" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                padding: "16px",
                background: "#fff"
              }}
            >
              {/* Voice Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Tooltip title={`Voice input (${languages.find(l => l.code === selectedLanguage)?.name})`}>
                  <IconButton
                    onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
                    sx={{
                      color: isListening ? "#ef4444" : "#22C55E",
                      backgroundColor: isListening ? "#fef2f2" : "#f0fdf4"
                    }}
                    size="small"
                  >
                    {isListening ? <MicOff /> : <Mic />}
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Select language">
                  <IconButton
                    onClick={(e) => setLanguageMenuAnchor(e.currentTarget)}
                    size="small"
                    sx={{ color: "#6b7280" }}
                  >
                    <Translate />
                  </IconButton>
                </Tooltip>
                
                <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "12px" }}>
                  {languages.find(l => l.code === selectedLanguage)?.flag} {languages.find(l => l.code === selectedLanguage)?.name}
                </Typography>
              </div>

              {/* Language Selection Menu */}
              <Popover
                open={Boolean(languageMenuAnchor)}
                anchorEl={languageMenuAnchor}
                onClose={() => setLanguageMenuAnchor(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                slotProps={{
                  paper: {
                    style: {
                      maxWidth: 200,
                      marginTop: 4
                    }
                  }
                }}
              >
                <List dense>
                  {languages.map((lang) => (
                    <ListItem
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setLanguageMenuAnchor(null);
                      }}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedLanguage === lang.code ? '#f0f9ff' : 'transparent',
                        borderLeft: selectedLanguage === lang.code ? '3px solid #0ea5e9' : '3px solid transparent',
                        '&:hover': {
                          backgroundColor: '#f8fafc'
                        }
                      }}
                    >
                      <span style={{ marginRight: 8, fontSize: '16px' }}>{lang.flag}</span>
                      <ListItemText primary={lang.name} />
                    </ListItem>
                  ))}
                </List>
              </Popover>


              {/* Text Input */}
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="शेतीचे प्रश्न विचारा... Ask farming questions..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    border: "2px solid #e5e7eb",
                    borderRadius: 12,
                    padding: "12px 16px",
                    outline: "none",
                    fontSize: 14,
                    color: "#374151",
                    backgroundColor: isLoading ? "#f9fafb" : "#fff",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s ease",
                    lineHeight: "1.4"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#22C55E";
                    e.target.style.color = "#111827";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.color = "#374151";
                  }}
                />
                <IconButton
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  sx={{
                    backgroundColor: "#22C55E",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#16A34A" },
                    "&:disabled": { backgroundColor: "#e5e7eb", color: "#9ca3af" }
                  }}
                >
                  <Send />
                </IconButton>
              </div>
              
              {isListening && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  🎤 Listening... Speak now in {languages.find(l => l.code === selectedLanguage)?.name}
                </Typography>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(90deg,#159E39 66%,#63B958 99%)',
        color: 'white',
        paddingTop: "clamp(40px, 6vw, 56px)",
        paddingBottom: "clamp(20px, 3vw, 28px)",
        paddingLeft: "clamp(16px, 5vw, 40px)",
        paddingRight: "clamp(16px, 5vw, 40px)",
        marginTop: "clamp(40px, 6vw, 56px)"
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto',
          gap: "clamp(24px, 4vw, 40px)"
        }}>
          {/* Brand/Desc */}
          <div style={{ 
            flex: '1 1 clamp(250px, 30%, 300px)', 
            minWidth: "clamp(200px, 25%, 250px)",
            marginBottom: "clamp(20px, 3vw, 0)"
          }}>
            <h2 style={{ 
              color: '#fff', 
              fontFamily: 'cursive', 
              fontWeight: 'bold', 
              fontSize: "clamp(1.4rem, 3vw, 1.6rem)", 
              marginBottom: "clamp(8px, 1.5vw, 12px)" 
            }}>
              कृषी Verse
            </h2>
            <p style={{ 
              color: '#e7fbe7', 
              fontSize: "clamp(0.9rem, 1.2vw, 1rem)", 
              marginBottom: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.5
            }}>
              Empowering farmers with AI-driven insights for sustainable and profitable agriculture.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: "clamp(12px, 2vw, 18px)",
              flexWrap: "wrap"
            }}>
              <a href="#" style={{ 
                color: '#fff',
                transition: "transform 0.3s ease",
                display: "inline-block"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                <svg height="clamp(20px, 2.5vw, 22px)" width="clamp(20px, 2.5vw, 22px)" viewBox="0 0 24 24" fill="#fff">
                  <path d="M9 8H6v4h3v12h6V12h4l1-4h-5V4c0-1 1-2 2-2h3V0h-4c-3 0-6 3-6 6v2z"/>
                </svg>
              </a>
              <a href="#" style={{ 
                color: '#fff',
                transition: "transform 0.3s ease",
                display: "inline-block"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                <svg height="clamp(20px, 2.5vw, 22px)" width="clamp(20px, 2.5vw, 22px)" viewBox="0 0 24 24" fill="#fff">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M19 6.5l-7 7-3.5-3.5" stroke="#159E39" strokeWidth="2" fill="none"/>
                </svg>
              </a>
              <a href="#" style={{ 
                color: '#fff',
                transition: "transform 0.3s ease",
                display: "inline-block"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                <svg height="clamp(20px, 2.5vw, 22px)" width="clamp(20px, 2.5vw, 22px)" viewBox="0 0 24 24" fill="#fff">
                  <circle cx="12" cy="12" r="10" />
                  <rect x="8" y="8" width="8" height="8" fill="#159E39"/>
                </svg>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div style={{ 
            flex: '1 1 clamp(140px, 20%, 180px)', 
            minWidth: "clamp(140px, 18%, 150px)",
            marginBottom: "clamp(20px, 3vw, 0)"
          }}>
            <h3 style={{ 
              fontSize: "clamp(1.1rem, 1.8vw, 1.2rem)", 
              fontWeight: 'bold', 
              marginBottom: "clamp(12px, 2vw, 16px)", 
              color: '#fff' 
            }}>
              Quick Links
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              color: '#e7fbe7', 
              fontSize: "clamp(0.9rem, 1.2vw, 1rem)" 
            }}>
              <li style={{ marginBottom: "clamp(6px, 1vw, 8px)" }}>
                <a href="/" style={{ 
                  color: '#e7fbe7', 
                  textDecoration: 'none',
                  transition: "color 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#e7fbe7"}
                >Home</a>
              </li>
              <li style={{ marginBottom: "clamp(6px, 1vw, 8px)" }}>
                <a href="/about" style={{ 
                  color: '#e7fbe7', 
                  textDecoration: 'none',
                  transition: "color 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#e7fbe7"}
                >About</a>
              </li>
              <li style={{ marginBottom: "clamp(6px, 1vw, 8px)" }}>
                <a href="/crop-insights" style={{ 
                  color: '#e7fbe7', 
                  textDecoration: 'none',
                  transition: "color 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#e7fbe7"}
                >Crop Insights</a>
              </li>
              <li>
                <a href="/contact" style={{ 
                  color: '#e7fbe7', 
                  textDecoration: 'none',
                  transition: "color 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#e7fbe7"}
                >Contact</a>
              </li>
            </ul>
          </div>
          {/* Services */}
          <div style={{ 
            flex: '1 1 clamp(160px, 22%, 200px)', 
            minWidth: "clamp(160px, 20%, 170px)",
            marginBottom: "clamp(20px, 3vw, 0)"
          }}>
            <h3 style={{ 
              fontSize: "clamp(1.1rem, 1.8vw, 1.2rem)", 
              fontWeight: 'bold', 
              marginBottom: "clamp(12px, 2vw, 16px)", 
              color: '#fff' 
            }}>
              Services
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              color: '#e7fbe7', 
              fontSize: "clamp(0.9rem, 1.2vw, 1rem)" 
            }}>
              <li style={{ marginBottom: "clamp(6px, 1vw, 8px)" }}>Crop Monitoring</li>
              <li style={{ marginBottom: "clamp(6px, 1vw, 8px)" }}>Weather Prediction</li>
              <li style={{ marginBottom: "clamp(6px, 1vw, 8px)" }}>Yield Optimization</li>
              <li>AI Recommendations</li>
            </ul>
          </div>
          {/* Account */}
          <div style={{ 
            flex: '1 1 clamp(160px, 22%, 200px)', 
            minWidth: "clamp(160px, 20%, 170px)"
          }}>
            <h3 style={{ 
              fontSize: "clamp(1.1rem, 1.8vw, 1.2rem)", 
              fontWeight: 'bold', 
              marginBottom: "clamp(12px, 2vw, 16px)", 
              color: '#fff' 
            }}>
              Account
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              color: '#e7fbe7', 
              fontSize: "clamp(0.9rem, 1.2vw, 1rem)" 
            }}>

              <li style={{ marginBottom: "clamp(6px, 1vw, 8px)" }}>
                <a href="/support" style={{ 
                  color: '#e7fbe7', 
                  textDecoration: 'none',
                  transition: "color 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.color = "#fff"}
                onMouseLeave={(e) => e.target.style.color = "#e7fbe7"}
                >Support</a>
              </li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        {/* Bottom */}
        <div style={{ 
          marginTop: "clamp(30px, 4vw, 40px)", 
          paddingTop: "clamp(16px, 2vw, 20px)", 
          borderTop: '1px solid #45be6d', 
          color: '#e7fbe7', 
          fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)", 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          gap: "clamp(12px, 2vw, 16px)",
          textAlign: "center"
        }}>
          <div style={{ 
            flex: "1 1 auto",
            minWidth: "clamp(200px, 50%, 300px)"
          }}>
            © 2025 कृषी Verse. All rights reserved. Empowering farmers with intelligent agriculture solutions.
          </div>
          <div style={{ 
            fontSize: "clamp(0.7rem, 1vw, 0.8rem)",
            flexShrink: 0
          }}>
            Designed by <a href="https://readdy.link" style={{ 
              color: '#e7fbe7', 
              textDecoration: 'underline',
              transition: "color 0.3s ease"
            }}
            onMouseEnter={(e) => e.target.style.color = "#fff"}
            onMouseLeave={(e) => e.target.style.color = "#e7fbe7"}
            >Readdy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
