import React, { useState, useRef, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiUpload, FiMapPin, FiCamera, FiChevronDown } from "react-icons/fi";
import "../styles/submit.css";

const SubmitEmergency = () => {
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [priority, setPriority] = useState("High");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (media) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.onloadend = () => {};
      reader.onerror = () => {
        setError("Failed to preview file");
        setMedia(null);
      };
      reader.readAsDataURL(media);
    } else {
      setPreviewUrl("");
    }
  }, [media]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLocalAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      return data.address
        ? `${data.address.road || ""}, ${data.address.city || data.address.town || ""}, ${data.address.state || ""}, ${data.address.country || ""}`
        : "Unknown Location";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unknown Location";
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      setError("Please upload an image (JPEG, PNG, GIF) or video (MP4)");
      return;
    }
    
    if (file.size > maxSize) {
      setError("File size too large (max 10MB)");
      return;
    }
    
    setMedia(file);
  };

  const reportIncident = async () => {
    if (!description.trim()) {
      setError("Please provide an emergency description");
      return;
    }

    setIsSubmitting(true);
    setLocationStatus("acquiring");
    setError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true
        });
      });

      setLocationStatus("processing");
      const { latitude, longitude } = position.coords;
      const locationName = await getLocalAddress(latitude, longitude);

      let mediaUrl = "";
      if (media) {
        setLocationStatus("uploading-media");
        try {
          const mediaRef = ref(storage, `emergencies/${user.uid}/${Date.now()}_${media.name}`);
          const snapshot = await uploadBytes(mediaRef, media);
          mediaUrl = await getDownloadURL(snapshot.ref);
        } catch (uploadError) {
          console.error("Media upload failed:", uploadError);
          throw new Error("Failed to upload media. Please try again.");
        }
      }

      setLocationStatus("finalizing");
      await addDoc(collection(db, "incidents"), {
        user: user.displayName || user.email,
        userId: user.uid,
        location: { name: locationName, lat: latitude, lng: longitude },
        description,
        timestamp: new Date(),
        priority,
        mediaUrl,
        status: "pending"
      });

      setLocationStatus("success");
      setDescription("");
      setMedia(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("Error reporting incident:", error);
      setError(error.message || "Failed to submit report. Please try again.");
      setLocationStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setLocationStatus("idle"), 2000);
    }
  };

  const priorityOptions = ["High", "Medium", "Low"];
  const priorityColors = {
    High: "#ff4d4d",
    Medium: "#ffa64d",
    Low: "#4d88ff"
  };

  if (!user) {
    return (
      <motion.div 
        className="auth-required"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="holographic-card">
          <FiAlertTriangle className="warning-icon" />
          <h2>Authentication Required</h2>
          <p>You must be logged in to submit an emergency report.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="emergency-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="holo-grid-bg"></div>
      
      <motion.div 
        className="emergency-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="card-header">
          <FiAlertTriangle className="pulse-icon" />
          <h1>Emergency Report</h1>
          <div className="status-indicator"></div>
        </div>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <FiAlertTriangle /> {error}
          </motion.div>
        )}

        <div className="priority-selector" ref={dropdownRef}>
          <div 
            className="selected-priority"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ borderColor: priorityColors[priority] }}
          >
            <span style={{ color: priorityColors[priority] }}>{priority} Priority</span>
            <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`} />
          </div>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                className="priority-options"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {priorityOptions.map((option) => (
                  <div
                    key={option}
                    className="priority-option"
                    onClick={() => {
                      setPriority(option);
                      setIsDropdownOpen(false);
                    }}
                    style={{ color: priorityColors[option] }}
                  >
                    {option} Priority
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="input-field">
          <label>Emergency Description *</label>
          <textarea
            placeholder="Describe the emergency situation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="neon-input"
            disabled={isSubmitting}
          />
        </div>

        <div className="media-upload">
          <label>
            <FiCamera className="icon" />
            <span>Attach Media (Optional - Images or Videos)</span>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*, video/*"
              onChange={handleFileChange}
              className="hidden-input"
              disabled={isSubmitting}
            />
            <FiUpload className="upload-icon" />
          </label>
          
          <AnimatePresence>
            {previewUrl && (
              <motion.div
                className="media-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {media.type.startsWith("image") ? (
                  <img src={previewUrl} alt="Media preview" />
                ) : (
                  <video src={previewUrl} controls />
                )}
                <button 
                  onClick={() => {
                    setMedia(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }} 
                  className="remove-media"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          className="submit-button"
          onClick={reportIncident}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ background: "#ff4d4d" }}
          animate={{
            background: isSubmitting 
              ? ["#ff4d4d", "#ff6666", "#ff4d4d"] 
              : priorityColors[priority]
          }}
          transition={isSubmitting ? { repeat: Infinity, duration: 1.5 } : {}}
        >
          {isSubmitting ? (
            <div className="submit-status">
              <div className="spinner"></div>
              <span>
                {locationStatus === "acquiring" && "Acquiring location..."}
                {locationStatus === "processing" && "Processing data..."}
                {locationStatus === "uploading-media" && "Uploading media..."}
                {locationStatus === "finalizing" && "Finalizing report..."}
                {locationStatus === "success" && "Report submitted!"}
                {locationStatus === "error" && "Error occurred"}
              </span>
            </div>
          ) : (
            <>
              <FiMapPin className="icon" />
              <span>REPORT EMERGENCY</span>
            </>
          )}
        </motion.button>

        <div className="location-disclaimer">
          <p>Your current location will be automatically included in the report</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubmitEmergency;