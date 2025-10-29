import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { FiShield, FiUsers, FiGlobe, FiAward } from "react-icons/fi";
import "../styles/TrustedBy.css";

const partners = [
  {
    src: "/logos/ndrf.png",
    alt: "NDRF",
    description: "National Disaster Response Force",
    icon: <FiShield className="partner-icon" />,
  },
  {
    src: "/logos/redcross.png",
    alt: "Red Cross",
    description: "International Humanitarian Network",
    icon: <FiGlobe className="partner-icon" />,
  },
  {
    src: "/logos/municipal.png",
    alt: "Municipal Corp",
    description: "Local Government Authorities",
    icon: <FiAward className="partner-icon" />,
  },
  {
    src: "/logos/community.png",
    alt: "Community Group",
    description: "Verified Community Responders",
    icon: <FiUsers className="partner-icon" />,
  },
];

const TrustedBy = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.17, 0.67, 0.83, 0.67],
      },
    },
  };

  const logoVariants = {
    hover: {
      y: -10,
      scale: 1.05,
      boxShadow: "0 15px 30px rgba(0, 240, 255, 0.3)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="trusted-section" ref={ref}>
      <div className="holographic-grid"></div>
      
      <motion.div
        className="trusted-container"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div className="header-content" variants={itemVariants}>
          <h2 className="trusted-title">TRUSTED BY GLOBAL RESPONSE NETWORKS</h2>
          <div className="title-underline"></div>
          <p className="trusted-subtitle">
            Partnering with leading emergency response organizations worldwide
          </p>
        </motion.div>

        <motion.div className="partners-grid" variants={containerVariants}>
          {partners.map((partner, idx) => (
            <motion.div
              key={idx}
              className="partner-card"
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.div
                className="logo-container"
                variants={logoVariants}
                whileHover={{
                  background: `radial-gradient(circle at center, rgba(0, 240, 255, 0.2) 0%, transparent 70%)`,
                }}
              >
                <div className="partner-icon-container">{partner.icon}</div>
                <img
                  src={partner.src}
                  alt={partner.alt}
                  className="partner-logo"
                  loading="lazy"
                />
                <div className="holographic-overlay"></div>
              </motion.div>
              <div className="partner-info">
                <h3>{partner.alt}</h3>
                <p>{partner.description}</p>
              </div>
              <div className="connection-line"></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="trusted-footer" variants={itemVariants}>
          <div className="trust-badge">
            <div className="badge-circle"></div>
            <span>Verified Emergency Response Partners</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TrustedBy;