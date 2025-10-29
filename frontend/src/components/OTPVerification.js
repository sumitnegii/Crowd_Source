import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const OTPVerification = () => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [message, setMessage] = useState("");
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

    useEffect(() => {
        // Initialize reCAPTCHA when component mounts
        const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => {
                // This will be called when reCAPTCHA is solved
                console.log("reCAPTCHA solved");
            },
            "expired-callback": () => {
                console.log("reCAPTCHA expired");
            }
        });
        setRecaptchaVerifier(verifier);

        return () => {
            // Clean up reCAPTCHA when component unmounts
            if (verifier) verifier.clear();
        };
    }, []);

    const sendOTP = async () => {
        try {
            // Validate phone number format
            if (!phone.startsWith("+") || phone.length < 10) {
                setMessage("Please enter a valid phone number with country code (e.g., +91XXXXXXXXXX)");
                return;
            }

            setMessage("Sending OTP...");

            const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
            setConfirmationResult(confirmation);
            setMessage("OTP sent successfully!");
        } catch (error) {
            console.error("Error sending OTP:", error);
            setMessage(`Failed to send OTP: ${error.message}`);
            
            // Reset reCAPTCHA on error
            if (recaptchaVerifier) recaptchaVerifier.clear();
            const newVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible"
            });
            setRecaptchaVerifier(newVerifier);
        }
    };

    const verifyOTP = async () => {
        try {
            if (!otp || otp.length < 6) {
                setMessage("Please enter a valid 6-digit OTP");
                return;
            }

            setMessage("Verifying OTP...");
            
            await confirmationResult.confirm(otp);
            setMessage("Phone number verified successfully!");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setMessage(`Invalid OTP: ${error.message}`);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>Phone OTP Verification</h2>
            
            <div style={{ marginBottom: "15px" }}>
                <label htmlFor="phone">Phone Number (with country code):</label>
                <input
                    id="phone"
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
            </div>
            
            <button 
                onClick={sendOTP}
                style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#4285f4",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                Send OTP
            </button>

            <div id="recaptcha-container" style={{ display: "none" }}></div>

            {confirmationResult && (
                <div style={{ marginTop: "20px" }}>
                    <div style={{ marginBottom: "15px" }}>
                        <label htmlFor="otp">Enter OTP:</label>
                        <input
                            id="otp"
                            type="text"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        />
                    </div>
                    
                    <button 
                        onClick={verifyOTP}
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#34a853",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Verify OTP
                    </button>
                </div>
            )}

            {message && (
                <p style={{
                    marginTop: "15px",
                    color: message.includes("success") ? "green" : "red",
                    textAlign: "center"
                }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default OTPVerification;