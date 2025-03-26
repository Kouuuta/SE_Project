import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ResetPassword.css";
import { toast } from "sonner";

const ResetPassword = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Optional: Validate the token here if needed
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Both password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/reset-password/${uidb64}/${token}/`,
        { password }, // ✅ Send JSON body correctly
        {
          headers: {
            "Content-Type": "application/json", // ✅ Ensure proper headers
          },
        }
      );

      toast.success("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(
        "❌ Reset Password Error:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="reset-password-input"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="reset-password-input"
          />
          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
        </form>
        {message && <p className="reset-password-message success">{message}</p>}
        {error && <p className="reset-password-message error">{error}</p>}
        <button
          className="reset-password-back-to-login"
          onClick={() => navigate("/")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
