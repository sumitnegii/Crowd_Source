const express = require("express");
const admin = require("./firebaseAdmin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// Protected Route
app.post("/report", verifyToken, (req, res) => {
    const { description, location, severity } = req.body;
    console.log(`New Report from ${req.user.uid}:`, { description, location, severity });
    res.json({ message: "Report submitted!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
