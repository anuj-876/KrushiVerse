import React from 'react';

// Team members data
const teamMembers = [
  {
    name: 'Vedant Phadke',
    title: 'Project Leader / Networking Incharge',
    description: 'Leads and oversees agricultural projects, ensuring timely and effective implementation while coordinating stakeholders. Manages communication and collaboration among farmers, partners, and stakeholders to support project success.',
    socials: [{ icon: 'in', url: '#' }],
    photo: '/images/Vedant.jpg',
  },
  {
    name: 'Sharvari Abhyankar',
    title: 'Web Developer',
    description: 'Develops and maintains the project\'s web applications and interfaces, ensuring user-friendly design, seamless functionality, and integration with agricultural data and AI services to empower farmers digitally.',
    socials: [{ icon: 'in', url: '#' }],
    photo: '/images/Sharvari.jpg',
  },
  {
    name: 'Shreya Borade',
    title: 'AI Analyst',
    description: 'An AI Analyst at KrushiVerse uses artificial intelligence to analyze agricultural data and provide farmers with insights to boost crop yield, efficiency, and sustainable farming practices.',
    socials: [{ icon: 'in', url: '#' }],
    photo: '/images/shreya.jpg',
  },
  {
    name: 'Parth Kale',
    title: 'UI/UX Designer',
    description: 'Designs intuitive and engaging user interfaces and experiences that simplify access to AI-driven agricultural insights, ensuring the platform is user-friendly and meets farmers\' needs effectively.',
    socials: [
      { icon: 'in', url: '#' },
      { icon: 'tw', url: '#' },
    ],
    photo: '/images/Parth.jpg',
  },
  {
    name: 'Anujkumar Sutar',
    title: 'AI Developer',
    description: 'An AI Developer at KrushiVerse focuses on building and optimizing machine learning models to analyze agricultural data and provide actionable insights for farmers.',
    socials: [{ icon: 'in', url: '#' }],
    photo: '/images/anuj.jpg',
  },
];

// Timeline data
const timelineData = [
  { year: '2019', title: 'Foundation', desc: 'KrushiVerse founded with initial research on AI applications in agriculture' },
  { year: '2020', title: 'First Pilot', desc: 'Launched pilot program with 100 farmers in Punjab and Maharashtra' },
  { year: '2022', title: 'Platform Launch', desc: 'Full platform launch with crop monitoring and weather prediction features' },
  { year: '2024', title: 'Global Expansion', desc: 'Expanded to serve farmers in 8 countries with advanced AI capabilities' },
];

export default function AboutPage() {
  return (
    <div style={{ 
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '100px 5vw 80px', 
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(16, 185, 129, 0.9) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>
        
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '0.5rem 1.5rem',
            borderRadius: '50px',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600' }}>🌾 Revolutionizing Agriculture</span>
          </div>
          
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: '800', 
            color: '#ffffff', 
            marginBottom: '2rem',
            lineHeight: '1.1',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            About KrushiVerse
          </h1>
          
          <p style={{ 
            fontSize: '1.3rem', 
            color: '#f0f9ff', 
            marginBottom: '3rem',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            Pioneering the future of agriculture through artificial intelligence, empowering farmers worldwide with innovative technology
            solutions for sustainable and profitable farming.
          </p>
          
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginTop: '4rem',
            maxWidth: '800px',
            margin: '4rem auto 0'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '2rem 1.5rem',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
              <div style={{ color: '#ffffff', fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>AI-Powered</div>
              <div style={{ color: '#f0f9ff', fontSize: '1rem' }}>Smart Solutions</div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '2rem 1.5rem',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌍</div>
              <div style={{ color: '#ffffff', fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Global</div>
              <div style={{ color: '#f0f9ff', fontSize: '1rem' }}>Impact</div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '2rem 1.5rem',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
              <div style={{ color: '#ffffff', fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Innovation</div>
              <div style={{ color: '#f0f9ff', fontSize: '1rem' }}>Driven</div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        padding: '100px 5vw',
        position: 'relative'
      }}>
        {/* Section Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }}></div>
        
        <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            padding: '0.5rem 1.5rem',
            borderRadius: '50px',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)'
          }}>
            <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600' }}>👥 Our Amazing Team</span>
          </div>
          
          <h2 style={{ 
            fontWeight: '800', 
            fontSize: '3.5rem', 
            marginBottom: '1.5rem', 
            color: '#1f2937',
            background: 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Meet Our Team
          </h2>
          
          <div style={{ 
            color: '#6b7280', 
            fontSize: '1.2rem', 
            margin: '0 auto', 
            maxWidth: '700px',
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            Our diverse team of Computer Engineering students, AI researchers, and technology experts is dedicated to revolutionizing
            farming through innovation and cutting-edge technology.
          </div>
        </div>

        {/* Team Cards */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* First Row - 3 Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2.5rem',
              marginBottom: '2.5rem',
            }}
          >
            {teamMembers.slice(0, 3).map((member, idx) => (
              <div
                key={member.name}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  padding: '2.5rem 2rem',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                }}
              >
                {/* Card Background Gradient */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                }}></div>
                
                {/* Profile Image with Enhanced Styling */}
                <div style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '-5px',
                    right: '-5px',
                    bottom: '-5px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    borderRadius: '50%',
                    opacity: 0.2
                  }}></div>
                  <img
                    src={member.photo}
                    alt={member.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid #ffffff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      position: 'relative',
                      zIndex: 2
                    }}
                  />
                </div>
                
                <h3 style={{ 
                  fontWeight: '700', 
                  fontSize: '1.4rem', 
                  margin: '0 0 0.5rem 0',
                  color: '#1f2937',
                  letterSpacing: '-0.025em'
                }}>
                  {member.name}
                </h3>
                
                <div style={{
                  color: '#22c55e',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.9rem'
                }}>
                  {member.title}
                </div>
                
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#6b7280', 
                  lineHeight: '1.6',
                  margin: '0',
                  fontWeight: '400'
                }}>
                  {member.description}
                </p>
                
                {/* Decorative Element */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #22c55e20, #16a34a10)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🌾</span>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row - 2 Cards Centered */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2.5rem',
            }}
          >
            {teamMembers.slice(3, 5).map((member, idx) => (
            <div
              key={member.name}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
            >
              {/* Card Background Gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
              }}></div>
              
              {/* Profile Image with Enhanced Styling */}
              <div style={{
                position: 'relative',
                display: 'inline-block',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '-5px',
                  right: '-5px',
                  bottom: '-5px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  borderRadius: '50%',
                  opacity: 0.2
                }}></div>
                <img
                  src={member.photo}
                  alt={member.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #ffffff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    position: 'relative',
                    zIndex: 2
                  }}
                />
              </div>
              
              <h3 style={{ 
                fontWeight: '700', 
                fontSize: '1.4rem', 
                margin: '0 0 0.5rem 0',
                color: '#1f2937',
                letterSpacing: '-0.025em'
              }}>
                {member.name}
              </h3>
              
              <div style={{
                color: '#22c55e',
                fontWeight: '600',
                marginBottom: '1rem',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.9rem'
              }}>
                {member.title}
              </div>
              
              <p style={{ 
                fontSize: '1rem', 
                color: '#6b7280', 
                lineHeight: '1.6',
                margin: '0',
                fontWeight: '400'
              }}>
                {member.description}
              </p>
              
              {/* Decorative Element */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #22c55e20, #16a34a10)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🌾</span>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
