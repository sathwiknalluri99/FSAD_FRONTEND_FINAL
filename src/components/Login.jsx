// components/Login.jsx
import React, { useState } from "react";

export default function Login({ onLogin, onVerifyRequired }) {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const roles = [
    {
      value: "student",
      label: "Student",
      icon: "fa-solid fa-rocket",
      description: "Access courses, track progress, and manage your academic journey",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-blue-50 to-purple-50"
    },
    {
      value: "teacher",
      label: "Teacher",
      icon: "fa-solid fa-chalkboard-user",
      description: "Create courses, manage students, and track academic performance",
      color: "from-green-500 to-teal-600",
      bgColor: "bg-gradient-to-r from-green-50 to-teal-50"
    },
    {
      value: "admin",
      label: "Admin",
      icon: "fa-solid fa-gears",
      description: "Manage the system, users, and institutional settings",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-r from-orange-50 to-red-50"
    }
  ];

  function generateCaptcha() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  // when the component mounts attempt to prefill using a remembered user record
  React.useEffect(() => {
    const remembered = JSON.parse(localStorage.getItem("rememberedUser"));
    if (remembered) {
      setUsernameInput(remembered.username || "");
      setSelectedRole(remembered.role || "student");
      setRememberMe(true);
      // don't auto-login after explicit logout, just pre-fill
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputCaptcha !== captcha) {
      alert("Incorrect CAPTCHA");
      refreshCaptcha();
      setInputCaptcha("");
      return;
    }

    const username = usernameInput.trim();
    // Disallow emails in the username field to prevent confusion
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(username)) {
      alert("Please enter a username, not an email address.");
      return;
    }
    const password = passwordInput;
    const role = selectedRole;

    try {
      const response = await fetch("http://localhost:8086/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const saved = data.user;
        
        if (saved.role.toLowerCase() !== role.toLowerCase()) {
          alert(`Wrong credentials: Your registered role is '${saved.role}', but you selected '${role}'.`);
          return;
        }

        const token = data.token || btoa(username + ":" + password);
        localStorage.setItem("token", token);

        // Store user id for API calls that need it
        if (saved.id) {
          localStorage.setItem("userId", saved.id);
        }

        if (rememberMe) {
          localStorage.setItem("rememberedUser", JSON.stringify({ username: saved.username, role: saved.role.toLowerCase(), email: saved.email }));
        } else {
          localStorage.removeItem("rememberedUser");
        }

        onLogin({ id: saved.id, username: saved.username, role: saved.role.toLowerCase(), email: saved.email });
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please ensure the backend is running.");
    }
  };

  // clear login inputs when switching between login/signup so values don't bleed over
  React.useEffect(() => {
    if (showSignup) {
      setUsernameInput("");
      setPasswordInput("");
      setInputCaptcha("");
    }
  }, [showSignup]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const username = e.target.reg_username.value;
    const email = e.target.reg_email.value;
    const password = e.target.reg_password.value;
    const role = e.target.reg_role.value;

    // Validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      alert("Username can only contain letters, numbers, and underscores");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!username || !email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch("http://localhost:8086/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          email: email,
          firstName: username,
          lastName: "User",
          role: role.toUpperCase()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message || "Registration successful! Please verify your email.");
        onVerifyRequired(email);
      } else {
        alert(data.message || "Registration failed. Username or email might already exist.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server to register.");
    }
  };

  // Hash password using SubtleCrypto (legacy localstorage reference - can be ignored now)
  async function hashPassword(password) {
    return password;
  }

  return (
    <div className="login-screen">
      {/* LEFT PANEL - BRANDING & INFO */}
      <div className="login-left-panel">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-logo">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <h1>Edu ERP</h1>
            <p className="login-brand-tagline">Where Innovation Meets Education</p>
          </div>
          
          <div className="login-features">
            <div className="login-feature-item">
              <i className="fa-solid fa-rocket"></i>
              <div>
                <h4>Smart Learning</h4>
                <p>Personalized education experience for every student</p>
              </div>
            </div>
            <div className="login-feature-item">
              <i className="fa-solid fa-chart-line"></i>
              <div>
                <h4>Real-Time Analytics</h4>
                <p>Track progress with comprehensive data insights</p>
              </div>
            </div>
            <div className="login-feature-item">
              <i className="fa-solid fa-users"></i>
              <div>
                <h4>Collaborative Tools</h4>
                <p>Connect students, teachers, and administrators seamlessly</p>
              </div>
            </div>
          </div>
          
          <div className="login-footer-left">
            <p>© 2026 Edu Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* RIGHT PANEL - LOGIN FORM */}
      <div className="login-right-panel">
        <div className="login-card">
          {/* TOP HEADER */}
          <div className="login-card-header">
            <div className="login-title-section">
              <h2>EduERP {showSignup ? "Sign Up" : "Login"}</h2>
              <p>{showSignup ? "Create your account to get started" : "Enter your credentials to access the system"}</p>
            </div>
          </div>

        {/* FORM (login or signup) */}
        {!showSignup ? (
          <form onSubmit={handleSubmit} className="login-form">

            <label className="input-label">Username</label>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
              <i className="fa-solid fa-user input-icon"></i>
            </div>

            <label className="input-label">Password</label>
            <div className="input-box">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
              <i className="fa-solid fa-lock input-icon"></i>
            </div>

            <label className="input-label">Login as</label>
            <div className="input-box">
              <select
                name="role"
                className="captcha-input"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <label className="input-label">Enter CAPTCHA</label>
            <div className="captcha-row">
              <div className="captcha-box">{captcha}</div>
              <button type="button" className="captcha-refresh" onClick={refreshCaptcha}>
                <i className="fa-solid fa-rotate-right"></i>
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter the CAPTCHA code"
              className="captcha-input"
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value)}
              required
            />

            <button className="login-btn">Login</button>

            <div className="login-footer">
              Forgot your <a href="#">username</a> or <a href="#">password</a>? &nbsp; 
              <span style={{ marginLeft: 8 }}>Don't have an account? <a href="#" onClick={(ev) => { ev.preventDefault(); setShowSignup(true); setSelectedRole("student"); }}>Create account</a></span>
            </div>

          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <label className="input-label">Username</label>
            <div className="input-box">
              <input type="text" name="reg_username" placeholder="Choose a username" required />
              <i className="fa-solid fa-user input-icon"></i>
            </div>
            
            <label className="input-label">Email Address</label>
            <div className="input-box">
              <input type="email" name="reg_email" placeholder="Enter your email address" required />
              <i className="fa-solid fa-envelope input-icon"></i>
            </div>
            
            <label className="input-label">Password</label>
            <div className="input-box">
              <input type="password" name="reg_password" placeholder="Choose a password" required />
              <i className="fa-solid fa-lock input-icon"></i>
            </div>
            
            <label className="input-label">Select Your Role</label>
            <div className="role-selection">
              {roles.map((role) => (
                <div
                  key={role.value}
                  className={`role-card ${selectedRole === role.value ? "active" : ""}`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <i className={role.icon}></i>
                  <h4>{role.label}</h4>
                  <p>{role.description}</p>
                  {selectedRole === role.value && <div className="role-checkmark"><i className="fa-solid fa-check"></i></div>}
                </div>
              ))}
            </div>
            <input type="hidden" name="reg_role" value={selectedRole} />

            <button className="login-btn" style={{ marginTop: "20px" }}>Create Account</button>

            <div className="login-footer">
              Already have an account? <a href="#" onClick={(ev) => { ev.preventDefault(); setShowSignup(false); }}>Sign in</a>
            </div>
          </form>
        )}
      </div>
    </div>
    </div>

  );
}
