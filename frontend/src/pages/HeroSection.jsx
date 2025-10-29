import React, { useEffect, useState } from "react";
import "../styles/HeroSection.css";

const HeroSection = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverState, setHoverState] = useState(null);

  useEffect(() => {
    // Initialize advanced animations
    initParticles();
    initCursorTracking();
    initCounters();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const initParticles = () => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(p => {
      p.style.setProperty('--x-pos', `${Math.random() * 100}%`);
      p.style.setProperty('--y-pos', `${Math.random() * 100}%`);
      p.style.setProperty('--size', `${Math.random() * 15 + 5}px`);
      p.style.setProperty('--delay', `${Math.random() * 10}s`);
    });
  };

  const initCursorTracking = () => {
    window.addEventListener('mousemove', handleMouseMove);
  };

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const initCounters = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const hero = document.querySelector('.hero-section');
    if (hero) observer.observe(hero);
  };

  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-counter');
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 2000;
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value.toLocaleString();
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    });
  };

  return (
    <section className="hero-section">
      {/* Dynamic Cursor Effect */}
      <div 
        className="cursor-trail"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          opacity: hoverState ? 1 : 0
        }}
      ></div>

      {/* Advanced Background Layers */}
      <div className="bg-grid"></div>
      <div className="bg-gradient"></div>
      <div className="bg-particles"></div>
      <div className="bg-nexus"></div>

      {/* Quantum Particles */}
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="particle"
          style={{
            '--hue': `${Math.random() * 360}deg`,
            '--speed': `${Math.random() * 20 + 10}s`
          }}
        ></div>
      ))}

      {/* Main Content */}
      <div className="hero-content">
        {/* 3D Title Effect */}
        <div className="title-container">
          <h1 className="main-title">
            <span className="title-line">
              <span className="text-layer base">Report Emergencies</span>
              <span className="text-layer glow">Report Emergencies</span>
            </span>
            <span className="title-line">
              <span className="dynamic-text">
                <span className="text-fragment">In</span>
                <span className="text-fragment">Real-Time</span>
                <span className="text-fragment">Anywhere</span>
              </span>
              <span className="text-aura"></span>
            </span>
          </h1>
          <div className="title-underline">
            <div className="underline-effect"></div>
          </div>
        </div>

        {/* Animated Subtitle */}
        <div className="subtitle-container">
          <p className="hero-subtitle">
            <span className="sub-line">Empower citizens and responders to act fast</span>
            <span className="sub-line">Real-time emergency alerts that save lives</span>
          </p>
        </div>

        {/* Holographic Buttons */}
        <div className="cta-container">
          <button
            className="cta-btn emergency"
            onClick={() => window.location.href = "/submit-emergency"}
            onMouseEnter={() => setHoverState('emergency')}
            onMouseLeave={() => setHoverState(null)}
          >
            <span className="btn-icon">🚨</span>
            <span className="btn-text">Report Emergency</span>
            <span className="btn-aura"></span>
            <span className="btn-pulse"></span>
          </button>
          <button
            className="cta-btn secondary"
            onClick={() => window.location.href = "/livefeed"}
            onMouseEnter={() => setHoverState('feed')}
            onMouseLeave={() => setHoverState(null)}
          >
            <span className="btn-icon">📡</span>
            <span className="btn-text">View Live Feed</span>
            <span className="btn-aura"></span>
          </button>
        </div>

        {/* Animated Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value" data-target="1242">0</div>
            <div className="stat-label">Incidents Handled</div>
            <div className="stat-graph"></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value" data-target="98">0</div>
            <div className="stat-label">Responders Online</div>
            <div className="stat-graph"></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-value" data-target="13">0</div>
            <div className="stat-label">Active Regions</div>
            <div className="stat-graph"></div>
          </div>
        </div>

        {/* Global Pulse Effect */}
        <div className="pulse-effect"></div>
      </div>

      {/* Floating Emergency Orb */}
      <div className="emergency-orb">
        <div className="orb-core"></div>
        <div className="orb-ring"></div>
        <div className="orb-particles"></div>
      </div>
    </section>
  );
};

export default HeroSection;