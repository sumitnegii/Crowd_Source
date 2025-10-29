import React from "react";
import Navbar from "./navbar";
import ChatBot from "./ChatBot";
import HowItWorks from "./HowItWorks";
import TrustedBy from "./TrustedBy";
import EmergencyWidget from "./EmergencyWidget";
import EmergencyAssistant from "./EmergencyAssistant";

import HeroSection from "./HeroSection"; 
import "../styles/Homepage.css";

const Homepage = ({ user }) => {
  return (
    <div className="homepage-container">
      <Navbar user={user} />
      
      {/* <HeroSection />
      <ChatBot />
      <HowItWorks />
      <TrustedBy />
      <EmergencyWidget />
      <EmergencyAssistant /> */}
    </div>
  );
};

export default Homepage;
