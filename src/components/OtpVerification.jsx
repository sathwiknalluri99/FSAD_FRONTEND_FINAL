import React, { useState, useEffect } from "react";

export default function OtpVerification({ email, onVerified, onCancel }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage({ text: "Please enter a 6-digit code", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:8085/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ text: data.message, type: "success" });
        setTimeout(() => onVerified(), 1500);
      } else {
        setMessage({ text: data.message || "Verification failed", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error connecting to server", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setResending(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:8085/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ text: "A new code has been sent to your email", type: "success" });
        setTimer(60); // Increase wait time after resend
      } else {
        setMessage({ text: data.message || "Failed to resend code", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error connecting to server", type: "error" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="login-card" style={{ maxWidth: '400px', margin: 'auto' }}>
      <div className="login-card-header">
        <div className="login-title-section">
          <h2>Email Verification</h2>
          <p>We've sent a 6-digit code to <strong>{email}</strong></p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="login-form">
        <label className="input-label">Verification Code</label>
        <div className="input-box">
          <input
            type="text"
            placeholder="000000"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            required
            autoFocus
            style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem' }}
          />
          <i className="fa-solid fa-shield-halved input-icon"></i>
        </div>

        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} 
               style={{ 
                 padding: '10px', 
                 borderRadius: '8px', 
                 marginBottom: '15px',
                 backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                 color: message.type === 'success' ? '#166534' : '#991b1b',
                 fontSize: '0.9rem',
                 border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
               }}>
            {message.text}
          </div>
        )}

        <button className="login-btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify Account"}
        </button>

        <div className="login-footer" style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Didn't receive the code?</p>
          <button 
            type="button" 
            onClick={handleResend} 
            disabled={timer > 0 || resending}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: timer > 0 ? '#94a3b8' : '#4f46e5', 
              fontWeight: '600',
              cursor: timer > 0 ? 'default' : 'pointer',
              textDecoration: timer > 0 ? 'none' : 'underline'
            }}
          >
            {resending ? "Sending..." : timer > 0 ? `Resend code in ${timer}s` : "Resend Code"}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); onCancel(); }} style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Back to Login
          </a>
        </div>
      </form>
    </div>
  );
}
