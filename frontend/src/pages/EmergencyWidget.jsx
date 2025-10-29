import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FiAlertTriangle, FiX, FiRadio, FiClock, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import "../styles/emergencyWidget.css";

const EmergencyWidget = () => {
  const [open, setOpen] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const controls = useAnimation();

  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIncidents(data);
      
      if (data.length > 0 && !open) {
        controls.start({
          scale: [1, 1.2, 1],
          boxShadow: ["0 0 0 0 rgba(255, 77, 77, 0)", "0 0 0 10px rgba(255, 77, 77, 0.3)", "0 0 0 0 rgba(255, 77, 77, 0)"],
          transition: { duration: 1.5 }
        });
      }
    });
    return () => unsubscribe();
  }, [open, controls]);

  const getTimeAgo = (timestamp) => {
    if (!timestamp?.seconds) return "Now";
    const now = new Date();
    const time = new Date(timestamp.seconds * 1000);
    const secondsAgo = Math.floor((now - time) / 1000);
    if (secondsAgo < 60) return "Just now";
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
    return `${Math.floor(secondsAgo / 86400)}d ago`;
  };

  const priorityColors = {
    High: "#ff4d4d",
    Medium: "#ffa64d",
    Low: "#4d88ff",
    Normal: "#4d88ff"
  };

  return (
    <div className="emergency-widget-container left-side">
      <motion.button 
        className="emergency-toggle-btn" 
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={controls}
        initial={false}
      >
        <div className="alert-icon-container">
          <FiAlertTriangle className="alert-icon" />
          {incidents.length > 0 && (
            <motion.div 
              className="alert-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {Math.min(incidents.length, 9)}
            </motion.div>
          )}
        </div>
        <span>LIVE ALERTS</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiChevronUp className="chevron-icon" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div 
            className="emergency-panel left-panel"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="panel-header">
              <div className="broadcast-header">
                <FiRadio className="broadcast-icon" />
                <h4>EMERGENCY BROADCAST</h4>
              </div>
              <button onClick={() => setOpen(false)} className="close-btn">
                <FiX size={18} />
              </button>
            </div>

            <div className="incident-list">
              {incidents.length === 0 ? (
                <motion.div 
                  className="no-incident"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p>No active alerts in your area</p>
                  <div className="scan-line"></div>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {incidents.map(({ id, description = "No description", timestamp, priority = "Normal" }) => (
                    <motion.div
                      key={id}
                      className="incident-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      style={{ borderLeftColor: priorityColors[priority] }}
                    >
                      <div className="incident-meta">
                        <span 
                          className="incident-priority"
                          style={{ color: priorityColors[priority] }}
                        >
                          {priority.toUpperCase()}
                        </span>
                        <div className="time-tag">
                          <FiClock className="time-icon" />
                          <span className="incident-time">{getTimeAgo(timestamp)}</span>
                        </div>
                      </div>
                      <p className="incident-desc">{description}</p>
                      <div className="incident-footer">
                        <div className="status-indicator"></div>
                        <button className="view-btn">VIEW DETAILS</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyWidget;