import React, { useState, useEffect } from "react";
import { 
  FiPhoneCall, 
  FiMapPin, 
  FiChevronUp, 
  FiAlertTriangle, 
  FiExternalLink,
  FiPlus,
  FiMinus,
  FiCrosshair
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/EmergencyAssistant.css";

const emergencyContacts = {
  default: {
    police: { number: "100", description: "National Police Emergency" },
    ambulance: { number: "102", description: "National Ambulance Service" },
    fire: { number: "101", description: "National Fire Brigade" },
    women: { number: "1091", description: "Women Helpline" },
    disaster: { number: "108", description: "Disaster Management" },
    resources: {
      hospitals: "https://www.google.com/maps/search/hospitals+near+me",
      disasterPortal: "https://ndma.gov.in/"
    }
  },
  delhi: {
    police: { number: "112", description: "Delhi Police Emergency" },
    ambulance: { number: "102", description: "Centralized Ambulance" },
    fire: { number: "101", description: "Delhi Fire Service" },
    women: { number: "1091", description: "Delhi Women Helpline" },
    disaster: { number: "1078", description: "Delhi Disaster Control" },
    resources: {
      hospitals: "https://www.google.com/maps/search/hospitals+near+Delhi",
      disasterPortal: "https://ddma.delhi.gov.in/"
    }
  },
  mumbai: {
    police: { number: "100", description: "Mumbai Police Emergency" },
    ambulance: { number: "1298", description: "Mumbai Ambulance Service" },
    fire: { number: "101", description: "Mumbai Fire Brigade" },
    women: { number: "1091", description: "Mumbai Women Helpline" },
    disaster: { number: "108", description: "Maharashtra Disaster Control" },
    resources: {
      hospitals: "https://www.google.com/maps/search/hospitals+near+Mumbai",
      disasterPortal: "https://www.maharashtra.gov.in/"
    }
  },
  bangalore: {
    police: { number: "100", description: "Bengaluru Police Emergency" },
    ambulance: { number: "108", description: "Karnataka Ambulance" },
    fire: { number: "101", description: "Bengaluru Fire Service" },
    women: { number: "1091", description: "Bengaluru Women Helpline" },
    disaster: { number: "1070", description: "Karnataka Disaster Control" },
    resources: {
      hospitals: "https://www.google.com/maps/search/hospitals+near+Bangalore",
      disasterPortal: "https://karnataka.gov.in/karnataka-state-disaster-management-authority/"
    }
  }
};

const EmergencyAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState({
    loading: true,
    name: "Detecting location...",
    error: null
  });
  const [regionKey, setRegionKey] = useState("default");
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000
          });
        });

        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        
        const city = data.address.city || data.address.town || data.address.county || "";
        const state = data.address.state || "";
        
        setLocation({
          loading: false,
          name: city ? `${city}, ${state}` : state || "Your area",
          error: null
        });

        // Determine region
        if (/delhi/i.test(city)) setRegionKey("delhi");
        else if (/mumbai/i.test(city)) setRegionKey("mumbai");
        else if (/bangalore|bengaluru/i.test(city)) setRegionKey("bangalore");
        else setRegionKey("default");
      } catch (error) {
        console.error("Location detection failed:", error);
        setLocation({
          loading: false,
          name: "National Emergency Services",
          error: "Could not detect precise location"
        });
        setRegionKey("default");
      }
    };

    detectLocation();
  }, []);

  const triggerPulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1000);
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
    triggerPulse();
  };

  const contacts = emergencyContacts[regionKey] || emergencyContacts.default;

  return (
    <div className="emergency-assistant-container left-position">
      <motion.button
        onClick={togglePanel}
        className="emergency-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: isPulsing 
            ? ["0 0 0 0 rgba(255, 77, 77, 0.7)", "0 0 0 20px rgba(255, 77, 77, 0)"]
            : "0 0 0 0 rgba(255, 77, 77, 0)"
        }}
        transition={{ duration: 1 }}
        aria-label={isOpen ? "Close emergency assistant" : "Open emergency assistant"}
      >
        {isOpen ? (
          <FiMinus className="emergency-icon" />
        ) : (
          <FiAlertTriangle className="emergency-icon" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="emergency-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            aria-modal="true"
            role="dialog"
          >
            <div className="panel-header">
              <h2 className="panel-title">
                <FiAlertTriangle className="title-icon" />
                EMERGENCY ASSISTANT
              </h2>
              <button 
                onClick={togglePanel}
                className="close-button"
                aria-label="Close panel"
              >
                <FiChevronUp />
              </button>
            </div>

            <div className="location-display">
              <div className="location-info">
                <FiMapPin className="location-icon" />
                <div>
                  <p className="location-name">{location.name}</p>
                  {location.error && (
                    <p className="location-error">{location.error}</p>
                  )}
                </div>
              </div>
              {!location.loading && (
                <a
                  href={`https://www.google.com/maps?q=${location.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-map-link"
                  aria-label="Open location in maps"
                >
                  <FiCrosshair />
                </a>
              )}
            </div>

            <div className="emergency-list">
              <h3 className="section-title">Emergency Contacts</h3>
              
              <div className="emergency-item">
                <div className="service-info">
                  <span className="service-name">Police</span>
                  <span className="service-description">{contacts.police.description}</span>
                </div>
                <a 
                  href={`tel:${contacts.police.number}`} 
                  className="service-number"
                  aria-label="Call police"
                >
                  {contacts.police.number}
                </a>
              </div>

              <div className="emergency-item">
                <div className="service-info">
                  <span className="service-name">Ambulance</span>
                  <span className="service-description">{contacts.ambulance.description}</span>
                </div>
                <a 
                  href={`tel:${contacts.ambulance.number}`} 
                  className="service-number"
                  aria-label="Call ambulance"
                >
                  {contacts.ambulance.number}
                </a>
              </div>

              <div className="emergency-item">
                <div className="service-info">
                  <span className="service-name">Fire Department</span>
                  <span className="service-description">{contacts.fire.description}</span>
                </div>
                <a 
                  href={`tel:${contacts.fire.number}`} 
                  className="service-number"
                  aria-label="Call fire department"
                >
                  {contacts.fire.number}
                </a>
              </div>

              <div className="emergency-item">
                <div className="service-info">
                  <span className="service-name">Women Helpline</span>
                  <span className="service-description">{contacts.women.description}</span>
                </div>
                <a 
                  href={`tel:${contacts.women.number}`} 
                  className="service-number"
                  aria-label="Call women helpline"
                >
                  {contacts.women.number}
                </a>
              </div>

              <div className="emergency-item">
                <div className="service-info">
                  <span className="service-name">Disaster Relief</span>
                  <span className="service-description">{contacts.disaster.description}</span>
                </div>
                <a 
                  href={`tel:${contacts.disaster.number}`} 
                  className="service-number"
                  aria-label="Call disaster relief"
                >
                  {contacts.disaster.number}
                </a>
              </div>
            </div>

            <div className="resource-links">
              <h3 className="section-title">Quick Resources</h3>
              
              <a
                href={contacts.resources.hospitals}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                <FiExternalLink className="link-icon" />
                <span>Nearest Hospitals</span>
              </a>
              
              <a
                href={contacts.resources.disasterPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                <FiExternalLink className="link-icon" />
                <span>Disaster Management Portal</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyAssistant;