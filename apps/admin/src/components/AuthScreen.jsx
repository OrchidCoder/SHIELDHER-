
import React, { useState } from "react";
import { Shield, Heart, MapPin, Users, LockKeyhole } from "lucide-react";
import API from "../services/api";

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (mode === "register" && name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "register" && password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (mode === "register") {
        response = await API.register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password
        });
      } else {
        response = await API.login({
          email: email.trim().toLowerCase(),
          password
        });
      }

      onLogin(response.user);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Shield size={27} />
          </div>
          <div>
            <h2>SHIELDHER</h2>
            <span>SAFETY ECOSYSTEM</span>
          </div>
        </div>

        <div className="auth-brand-content">
          <h1>
            Your safety,
            <br />
            <span>your strength.</span>
          </h1>

          <p>
            A smarter personal safety platform designed to help
            you stay connected, prepared and empowered.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <Heart size={19} />
              <span>Emergency incident management</span>
            </div>

            <div className="auth-feature">
              <Users size={19} />
              <span>Your trusted support network</span>
            </div>

            <div className="auth-feature">
              <MapPin size={19} />
              <span>Location-aware safety features</span>
            </div>

            <div className="auth-feature">
              <LockKeyhole size={19} />
              <span>Secure account authentication</span>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          SHIELDHER © 2026 · YOUR SAFETY, OUR PRIORITY
        </div>
      </section>

      <section className="auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-heading">
            <span>WELCOME TO SHIELDHER</span>

            <h2>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to access your personal safety dashboard."
                : "Register to start using your SHIELDHER workspace."}
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          {mode === "register" && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                maxLength={60}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              maxLength={120}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
            />
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "PLEASE WAIT..."
              : mode === "login"
              ? "SIGN IN TO DASHBOARD"
              : "CREATE MY ACCOUNT"}
          </button>

          <div className="auth-switch">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

export default AuthScreen;
