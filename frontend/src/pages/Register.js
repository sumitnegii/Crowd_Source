// import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../firebase";  // Import Firestore
// import { doc, setDoc } from "firebase/firestore";  // Firestore functions
// import { useNavigate } from "react-router-dom";
// import "../styles/Auth.css";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [location, setLocation] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Store additional user data in Firestore
//       await setDoc(doc(db, "users", user.uid), {
//         name,
//         age,
//         location,
//         email,
//       });

//       navigate("/dashboard"); // Redirect after signup
//     } catch (error) {
//       setError("Registration failed! Try again.");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <h2>Register</h2>
//         {error && <p className="error-message">{error}</p>}
//         <form onSubmit={handleRegister}>
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <input
//             type="number"
//             placeholder="Age"
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//             required
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Create a password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button type="submit" className="register-btn">Register</button>
//         </form>
//         <p>Already have an account?</p>
//         <button className="login-btn" onClick={() => navigate("/login")}>
//           Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Register;


// this is mobile varification code__________________________________

// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "../styles/Register.css";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [step, setStep] = useState(1); // Step 1: Register, Step 2: OTP Verification
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Send OTP
    const sendOtp = async () => {
        if (!formData.phone) {
            alert("Please enter a valid phone number.");
            return;
        }

        // Initialize reCAPTCHA
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => sendOtp(),
        });

        try {
            setLoading(true);
            const confirmation = await signInWithPhoneNumber(auth, formData.phone, window.recaptchaVerifier);
            setVerificationId(confirmation);
            setStep(2); // Move to OTP verification step
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert("Error sending OTP: " + error.message);
        }
    };

    // Verify OTP & Register User
    const verifyOtpAndRegister = async () => {
        if (!otp) {
            alert("Please enter the OTP.");
            return;
        }

        try {
            setLoading(true);
            await verificationId.confirm(otp);

            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Store user details in Firestore
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            });

            alert("User registered successfully!");
            setLoading(false);
            navigate("/login"); // Redirect to login after successful registration
        } catch (error) {
            setLoading(false);
            alert("OTP Verification Failed: " + error.message);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                {step === 1 ? (
                    <div>
                        <h2>Register</h2>
                        <input name="name" placeholder="Full Name" onChange={handleChange} />
                        <input name="email" placeholder="Email" type="email" onChange={handleChange} />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                        <input name="phone" placeholder="Phone Number" onChange={handleChange} />

                        <button onClick={sendOtp} disabled={loading}>
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                        <div id="recaptcha-container"></div>

                        <button onClick={() => navigate("/login")} className="back-btn">
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2>Enter OTP</h2>
                        <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                        <button onClick={verifyOtpAndRegister} disabled={loading}>
                            {loading ? "Verifying OTP..." : "Verify & Register"}
                        </button>

                        <button onClick={() => navigate("/login")} className="back-btn">
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;

