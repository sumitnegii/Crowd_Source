// src/components/ui/card.js
import React from "react";

const Card = ({ children }) => {
    return (
        <div className="border rounded-lg shadow-md p-4">{children}</div>
        
    );
};



export default Card;
