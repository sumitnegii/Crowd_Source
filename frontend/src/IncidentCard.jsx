import React from "react";
import "./IncidentCard.css";

const IncidentCard = ({ title, description, priority, mediaUrl }) => {
  return (
    <div className={`incident-card ${priority === "high" ? "high-priority" : ""}`}>
      <div className="incident-header">
        <h3 className="incident-title">{title}</h3>
        {priority === "high" && <span className="priority-badge">HIGH</span>}
      </div>
      <p className="incident-description">{description}</p>
      {mediaUrl && (
        <div className="incident-media">
          <img src={mediaUrl} alt="incident" />
        </div>
      )}
    </div>
  );
};

export default IncidentCard;
