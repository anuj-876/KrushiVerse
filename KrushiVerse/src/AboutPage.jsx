import React from 'react';

// Team members data
const teamMembers = [
  {
    name: 'Vedant Phadke',
    title: 'Project Leader / Networking Incharge',
    description:
      'Leads and oversees agricultural projects, ensuring timely and effective implementation while coordinating stakeholders. Manages communication and collaboration among farmers, partners, and stakeholders to support project success.',
    socials: [{ icon: 'in', url: '#' }],
    photo: '/images/Vedant.jpg',
  },
  {
    name: 'Sharvari Abhyankar',
    title: 'Web Developer',
    description:
      'Develops and maintains the project’s web applications and interfaces, ensuring user-friendly design, seamless functionality, and integration with agricultural data and AI services to empower farmers digitally.',
    socials: [{ icon: 'in', url: '#' }],
    photo: '/images/Sharvari.jpg',
  },
  {
    name: 'Parth Kale',
    title: 'UI/UX Designer',
    description:
      'Designs intuitive and engaging user interfaces and experiences that simplify access to AI-driven agricultural insights, ensuring the platform is user-friendly and meets farmers’ needs effectively.',
    socials: [
      { icon: 'in', url: '#' },
      { icon: 'tw', url: '#' },
    ],
    photo: '/images/Parth.jpg',
  },
  {
    name: 'Shreya Borade',
    title: 'AI Analyst',
    description:
      'An AI Analyst at SmartKrishi uses artificial intelligence to analyze agricultural data and provide farmers with insights to boost crop yield, efficiency, and sustainable farming practices.',
    socials: [{ icon: 'in', url: '#' }],
    photo: '/images/shreya.jpg',
  },
  {
    name: 'Anuj Sutar',
    title: 'AI Analyst',
    description:
      'An AI Analyst at SmartKrishi uses artificial intelligence to analyze agricultural data and provide farmers with insights to boost crop yield, efficiency, and sustainable farming practices.',
    socials: [{ icon: 'in', url: '#' }],
    photo: '/images/anuj.jpg',
  },
];

// Timeline data
const timelineData = [
  { year: '2019', title: 'Foundation', desc: 'SmartKrishi founded with initial research on AI applications in agriculture' },
  { year: '2020', title: 'First Pilot', desc: 'Launched pilot program with 100 farmers in Punjab and Haryana' },
  { year: '2022', title: 'Platform Launch', desc: 'Full platform launch with crop monitoring and weather prediction features' },
  { year: '2024', title: 'Global Expansion', desc: 'Expanded to serve farmers in 8 countries with advanced AI capabilities' },
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f9fafb' }}>
      {/* About Section */}
      <section style={{ padding: '64px 5vw 32px', background: '#fff' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>About SmartKrishi</h1>
          <p style={{ fontSize: '1.12rem', color: '#374151', marginBottom: '24px' }}>
            Pioneering the future of agriculture through artificial intelligence, empowering farmers worldwide with innovative technology
            solutions for sustainable and profitable farming.
          </p>
        </div>
      </section>

      {/* (Other sections remain unchanged) */}

      {/* Meet Our Team Section */}
      <section style={{ background: '#f7fafe', padding: '56px 5vw' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: '9px', color: '#111827' }}>Meet Our Team</h2>
          <div style={{ color: '#374151', fontSize: '1.1rem', margin: '0 auto', maxWidth: '640px' }}>
            Our diverse team of Computer Engineering students, AI researchers, and technology experts is dedicated to revolutionizing
            farming through innovation.
          </div>
        </div>

        {/* Team Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '40px',
            maxWidth: '1200px',
            margin: '40px auto 0 auto',
          }}
        >
          {teamMembers.map((member, idx) => (
            <div
              key={member.name}
              style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 4px 20px #e3e4ea',
                padding: '38px 22px',
                textAlign: 'center',
              }}
            >
              <img
                src={member.photo}
                alt={member.name}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '12px',
                  background: '#e4e7ec',
                }}
              />
              <h3 style={{ fontWeight: 'bold', fontSize: '1.08rem', margin: '7px 0' }}>{member.name}</h3>
              <div style={{ color: '#070b12', fontWeight: '500', marginBottom: '7px' }}>{member.title}</div>
              <p style={{ fontSize: '0.98rem', color: '#6B7280', marginBottom: '10px' }}>{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
