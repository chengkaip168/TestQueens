import { supabase } from "../supabase-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoLockup } from "../assets/logo";
import "./loginpage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const navigate = useNavigate();

  async function sendResetEmail(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: window.location.origin,
      });
      if (resetError) {
        setForgotError("Couldn't send the reset link. Check the address and try again.");
        return;
      }
      setForgotSent(true);
    } catch {
      setForgotError("Connection failed. Check your internet connection and try again.");
    } finally {
      setForgotLoading(false);
    }
  }

  async function signIn() {
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        const isNetwork = authError.message.toLowerCase().includes("fetch") ||
                          authError.message.toLowerCase().includes("network") ||
                          (authError as { status?: number }).status === 0;
        setError(isNetwork
          ? "Connection failed. Check your internet connection and try again."
          : "Invalid email or password.");
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        navigate(profile?.role === "admin" ? "/admin" : profile?.role === "tutor" ? "/tutor" : profile?.role === "parent" ? "/parent" : "/home");
      } else {
        navigate("/home");
      }
    } catch {
      setError("Connection failed. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tq-login">
      <div className="tq-shell">
      {/* Branding column */}
      <div className="tq-brandzone">
        <div className="tq-brand-inner">
          <h1>
            <a href="#/" aria-label="TestQueens home">
              <LogoLockup className="tq-lockup" />
            </a>
          </h1>
          <p className="tq-tagline">
            Practice tests for the SHSAT, with results that show you what to work on next.
          </p>
          <hr className="tq-rule" aria-hidden="true" />
          <div className="tq-bullets">
            {[
              "Take a diagnostic test to find out where you stand",
              "See your results broken down by topic",
              "Practice the question types you keep getting wrong",
            ].map((f) => (
              <div key={f} className="tq-bullet">
                <svg className="tq-bullet-mark" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M5 0 L10 5 L5 10 L0 5 Z" />
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign-in column */}
      <div className="tq-formzone">
        <div className="tq-card">
          <div className="tq-mobile-brand">
            <a href="#/" aria-label="TestQueens home">
              <LogoLockup className="tq-lockup" />
            </a>
          </div>
          {!showForgot && (
            <div className="tq-card-head">
              <h2 className="tq-h2">Sign in</h2>
              <p className="tq-sub">Use the email and password you signed up with.</p>
            </div>
          )}
          {showForgot ? (
            /*  Forgot password inline form */
            forgotSent ? (
              <div className="tq-sent">
                <div className="tq-sent-badge">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="tq-h3">Check your inbox</h3>
                  <p className="tq-sent-copy">
                    If <span className="tq-sent-em">{forgotEmail}</span> has an account,
                    you'll receive a reset link shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                  className="tq-link"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form className="tq-form" onSubmit={sendResetEmail}>
                <div className="tq-card-head">
                  <h2 className="tq-h2">Forgot password?</h2>
                  <p className="tq-sub">Enter your email and we'll send a reset link.</p>
                </div>
                <label className="tq-field">
                  <span className="tq-label">Email</span>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    required
                    autoComplete="email"
                    className="tq-input"
                  />
                </label>
                {forgotError && <p className="tq-error">{forgotError}</p>}
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="tq-btn"
                >
                  {forgotLoading ? "Sending…" : "Send reset link"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="tq-link"
                >
                  Back to sign in
                </button>
              </form>
            )
          ) : (
            /*  Normal sign-in form */
            <>
              <form className="tq-form" onSubmit={(e) => { e.preventDefault(); signIn(); }}>
                <label className="tq-field">
                  <span className="tq-label">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="tq-input"
                  />
                </label>
                <label className="tq-field">
                  <div className="tq-field-row">
                    <span className="tq-label">Password</span>
                    <button
                      type="button"
                      onClick={() => { setShowForgot(true); setForgotEmail(email); }}
                      className="tq-link tq-link-sm"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="tq-input"
                  />
                </label>
                {error && (
                  <p className="tq-error">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="tq-btn"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>
              <p className="tq-foot">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signUp")}
                  className="tq-link"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
        </div>
      </div>
      </div>

      <footer className="tq-footer">
        <div className="tq-footer-inner">
          <span className="tq-foot-copy">&copy; {new Date().getFullYear()} TestQueens</span>
          <a href="#/privacy" className="tq-foot-link">Privacy</a>
          <a href="#/terms" className="tq-foot-link">Terms</a>
          <p className="tq-foot-biz">
            Chan Tutoring Center, 6012b 18th Ave, Brooklyn, NY 11204{" · "}
            <a href="mailto:info@chantutoringcenter.com" className="tq-foot-link">
              info@chantutoringcenter.com
            </a>
          </p>
          <p className="tq-foot-note">
            Not affiliated with or endorsed by the New York City Department of Education.
            Score estimates shown on this site are our own and are not official SHSAT scores.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
