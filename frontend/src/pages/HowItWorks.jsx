import React from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiMapPin, FiRadio, FiZap } from "react-icons/fi";
import "../styles/HowItWorks.css";

const steps = [
  {
    step: "1",
    title: "Describe Emergency",
    text: "Share what's happening with a few details — quick and easy.",
    icon: <FiAlertTriangle className="step-icon-svg" />,
    color: "#ff4d4d",
  },
  {
    step: "2",
    title: "Auto-Locate You",
    text: "Our system automatically detects your location to assist faster.",
    icon: <FiMapPin className="step-icon-svg" />,
    color: "#4d88ff",
  },
  {
    step: "3",
    title: "Live Support Activated",
    text: "Nearby responders get notified and begin tracking the incident live.",
    icon: <FiRadio className="step-icon-svg" />,
    color: "#00cc88",
  },
  {
    step: "4",
    title: "Real-Time Resolution",
    text: "Watch as emergency services are dispatched in real-time to your location.",
    icon: <FiZap className="step-icon-svg" />,
    color: "#ffa64d",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const HowItWorks = () => {
  return (
    <section className="how-it-works-section">
      <div className="holographic-bg"></div>
      
      <motion.div 
        className="how-it-works-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.h2 className="section-title" variants={itemVariants}>
          HOW CROWDSOLVE WORKS
        </motion.h2>
        
        <motion.div className="steps-grid" variants={containerVariants}>
          {steps.map((item) => (
            <motion.div 
              key={item.step}
              className="step-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="step-number">{item.step}</div>
              
              <div 
                className="step-icon-container"
                style={{ 
                  background: `radial-gradient(circle at center, ${item.color}40, transparent 70%)`,
                  borderColor: item.color
                }}
              >
                {item.icon}
                <div 
                  className="pulse-effect" 
                  style={{ backgroundColor: item.color }}
                ></div>
              </div>
              
              <h3 className="step-title">{item.title}</h3>
              <p className="step-text">{item.text}</p>
              
              <div 
                className="step-connector" 
                style={{ backgroundColor: item.color }}
              ></div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;