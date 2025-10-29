// import React, { useEffect, useState } from "react";
// import { collection, onSnapshot, query } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import Card from "../components/ui/card";
// import "../styles/livefeed.css";

// const LiveEmergencyFeed = () => {
//   const [incidents, setIncidents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [priorityFilter, setPriorityFilter] = useState("All");

//   useEffect(() => {
//     const q = query(collection(db, "incidents"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const fetchedIncidents = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setIncidents(fetchedIncidents);
//     });

//     return () => unsubscribe();
//   }, []);

//   const renderMedia = (mediaUrl) => {
//     if (!mediaUrl) return null;
//     return mediaUrl.includes("video") ? (
//       <video controls className="incident-media">
//         <source src={mediaUrl} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     ) : (
//       <img src={mediaUrl} alt="Emergency" className="incident-media" />
//     );
//   };

//   const filteredIncidents = incidents
//     .filter((incident) => {
//       const matchesSearch =
//         incident.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         incident.user?.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesPriority =
//         priorityFilter === "All" || incident.priority === priorityFilter;

//       return matchesSearch && matchesPriority;
//     })
//     .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

//   return (
//     <div className="live-emergency-feed">
//       <h1>Live Emergency Feed</h1>

//       {/* Filters */}
//       <div className="filter-bar">
//         <input
//           type="text"
//           placeholder="Search by description or reporter..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="filter-input"
//         />

//         <select
//           value={priorityFilter}
//           onChange={(e) => setPriorityFilter(e.target.value)}
//           className="priority-select"
//         >
//           <option value="All">All Priorities</option>
//           <option value="High">High</option>
//           <option value="Normal">Normal</option>
//           <option value="Low">Low</option>
//         </select>
//       </div>

//       <div className="scroll-container">
//         {filteredIncidents.length === 0 ? (
//           <p className="empty-text">No matching incidents found.</p>
//         ) : (
//           filteredIncidents.map((incident) => {
//             const {
//               id,
//               user = "Anonymous",
//               priority = "Normal",
//               location = {},
//               timestamp,
//               description = "No description provided.",
//               mediaUrl,
//             } = incident;

//             const cardClass = `card ${priority === "High" ? "high-priority" : ""}`;

//             return (
//               <Card key={id} className={cardClass}>
//                 <div className="p-4">
//                   <p><strong>Reported By:</strong> {user}</p>
//                   <p><strong>Priority:</strong> {priority}</p>
//                   <p><strong>Location:</strong> {location.name || "Unknown"}</p>
//                   <p><strong>Time:</strong> {timestamp ? new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A"}</p>
//                   <p>{description}</p>
//                   {renderMedia(mediaUrl)}
//                 </div>
//               </Card>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default LiveEmergencyFeed;


import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiAlertTriangle, FiClock, FiUser, FiMapPin, FiFilter } from "react-icons/fi";
import "../styles/livefeed.css";

const LiveEmergencyFeed = () => {
  const [incidents, setIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const filterRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedIncidents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncidents(fetchedIncidents);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderMedia = (mediaUrl) => {
    if (!mediaUrl) return null;
    
    return (
      <motion.div 
        className="media-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {mediaUrl.includes("video") ? (
          <video controls className="incident-media">
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={mediaUrl} 
            alt="Emergency" 
            className="incident-media"
            loading="lazy"
          />
        )}
      </motion.div>
    );
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.user?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === "All" || incident.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const priorityColors = {
    High: "#ff4d4d",
    Normal: "#ffa64d",
    Low: "#4d88ff"
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp?.seconds) return "Just now";
    
    const now = new Date();
    const incidentTime = new Date(timestamp.seconds * 1000);
    const diffInSeconds = Math.floor((now - incidentTime) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="live-feed-container">
      {/* Holographic Header */}
      <div className="feed-header">
        <div className="header-content">
          <FiAlertTriangle className="header-icon pulse" />
          <h1>LIVE EMERGENCY FEED</h1>
          <div className="status-indicator active"></div>
        </div>
        <div className="header-grid"></div>
      </div>

      {/* Search and Filter Bar */}
      <div className="control-bar">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-wrapper" ref={filterRef}>
          <button 
            className="filter-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter className="filter-icon" />
            <span>FILTER</span>
          </button>
          
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                className="filter-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="filter-option" onClick={() => setPriorityFilter("All")}>
                  <div className={`priority-dot all`}></div>
                  <span>All Priorities</span>
                </div>
                <div className="filter-option" onClick={() => setPriorityFilter("High")}>
                  <div className="priority-dot" style={{ background: priorityColors.High }}></div>
                  <span>High Priority</span>
                </div>
                <div className="filter-option" onClick={() => setPriorityFilter("Normal")}>
                  <div className="priority-dot" style={{ background: priorityColors.Normal }}></div>
                  <span>Normal Priority</span>
                </div>
                <div className="filter-option" onClick={() => setPriorityFilter("Low")}>
                  <div className="priority-dot" style={{ background: priorityColors.Low }}></div>
                  <span>Low Priority</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Live Feed Content */}
      <div className="feed-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>SYNCING WITH EMERGENCY NETWORK</p>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="empty-state">
            <div className="holographic-message">
              <p>NO MATCHING INCIDENTS FOUND</p>
              <div className="scan-line"></div>
            </div>
          </div>
        ) : (
          <div className="incidents-grid">
            <AnimatePresence>
              {filteredIncidents.map((incident) => {
                const {
                  id,
                  user = "Anonymous",
                  priority = "Normal",
                  location = {},
                  timestamp,
                  description = "No description provided.",
                  mediaUrl,
                } = incident;

                return (
                  <motion.div
                    key={id}
                    className="incident-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div 
                      className="card-header"
                      style={{ borderColor: priorityColors[priority] }}
                    >
                      <div className="priority-tag" style={{ background: priorityColors[priority] }}>
                        {priority.toUpperCase()}
                      </div>
                      <div className="time-ago">{getTimeAgo(timestamp)}</div>
                    </div>

                    <div className="card-body">
                      <div className="incident-details">
                        <div className="detail-row">
                          <FiUser className="detail-icon" />
                          <span>{user}</span>
                        </div>
                        <div className="detail-row">
                          <FiMapPin className="detail-icon" />
                          <span>{location.name || "Unknown Location"}</span>
                        </div>
                        <div className="detail-row">
                          <FiClock className="detail-icon" />
                          <span>
                            {timestamp ? new Date(timestamp.seconds * 1000).toLocaleTimeString([], { 
                              hour: "2-digit", 
                              minute: "2-digit",
                              day: "numeric",
                              month: "short"
                            }) : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="incident-description">
                        <p>{description}</p>
                      </div>

                      {renderMedia(mediaUrl)}
                    </div>

                    <div className="card-footer">
                      <div className="status-indicator"></div>
                      <div className="action-buttons">
                        <button className="action-button">VIEW DETAILS</button>
                        <button className="action-button">TRACK</button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveEmergencyFeed;
