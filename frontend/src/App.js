import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import SubmitEmergency from "./pages/SubmitEmergency";
import LiveEmergencyFeed from "./pages/livefeed";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/submit-emergency"
          element={user ? <SubmitEmergency /> : <Navigate to="/login" />}
        />
         <Route
      path="/livefeed"
      element={<LiveEmergencyFeed />} 
      />
        
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
