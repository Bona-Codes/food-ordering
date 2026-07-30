import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    password: "", phone: "", role: "customer"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,107,53,0.4);} 50%{box-shadow:0 0 0 12px rgba(255,107,53,0);} }
        .reg-input:focus { border-color: #ff6b35 !important; box-shadow: 0 0 0 4px rgba(255,107,53,0.1) !important; outline: none; }
        .reg-btn:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(255,107,53,0.5)!important; }
      `}</style>

      {/* Left Panel */}
      <div style={S.left}>
        <div style={S.leftInner}>
          <div style={S.logoRing}>🍕</div>
          <h1 style={S.brand}>Foody</h1>
          <p style={S.tagline}>Join thousands of<br />happy customers today.</p>
          <div style={S.features}>
            {[
              { icon: "🚀", text: "Fast delivery in 30 min" },
              { icon: "🏪", text: "100+ local restaurants" },
              { icon: "💳", text: "Easy & secure checkout" },
              { icon: "⭐", text: "4.9 star rated service" },
            ].map((f, i) => (
              <div key={i} style={S.feature}>
                <span style={S.featureIcon}>{f.icon}</span>
                <span style={S.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={S.right}>
        <div style={{
          ...S.card,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          <h2 style={S.title}>Create account</h2>
          <p style={S.subtitle}>Start ordering delicious food today</p>

          {error && <div style={S.errorBox}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={S.row}>
              <div style={S.field}>
                <label style={S.label}>First Name</label>
                <input type="text" placeholder="Bona" className="reg-input" style={S.input}
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
              </div>
              <div style={S.field}>
                <label style={S.label}>Last Name</label>
                <input type="text" placeholder="Tesfa" className="reg-input" style={S.input}
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
              </div>
            </div>

            <div style={S.field}>
              <label style={S.label}>Email Address</label>
              <input type="email" placeholder="you@example.com" className="reg-input" style={S.inputFull}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div style={S.field}>
              <label style={S.label}>Phone Number</label>
              <input type="text" placeholder="09xxxxxxxx" className="reg-input" style={S.inputFull}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div style={S.field}>
              <label style={S.label}>Password</label>
              <input type="password" placeholder="Min 6 characters" className="reg-input" style={S.inputFull}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>

            {/* Customer badge — no role selection */}
            <div style={S.roleBadge}>
              <span style={S.roleBadgeIcon}>👤</span>
              <div>
                <p style={S.roleBadgeTitle}>Registering as Customer</p>
                <p style={S.roleBadgeSub}>You can browse restaurants and place orders</p>
              </div>
            </div>

            <button type="submit" className="reg-btn"
              disabled={loading}
              style={{ ...S.btn, opacity: loading ? 0.8 : 1 }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }}></span>
                  Creating account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          <p style={S.switchText}>
            Already have an account? <Link to="/login" style={S.link}>Sign in</Link>
          </p>

          <div style={S.ownerBox}>
            <p style={S.ownerText}>
              🏪 Want to list your restaurant?
              <span style={S.ownerLink}> Contact us to become a partner</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif" },
  left: {
    flex: "0 0 400px",
    background: "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 50%, #0f3460 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "60px 40px",
  },
  leftInner: { textAlign: "center", color: "white" },
  logoRing: {
    width: "80px", height: "80px", borderRadius: "50%",
    background: "linear-gradient(135deg, #ff6b35, #e55a28)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "36px", margin: "0 auto 16px", animation: "pulse 2.5s ease-in-out infinite",
  },
  brand: {
    fontSize: "44px", fontWeight: "900", margin: "0 0 10px", letterSpacing: "-2px",
    background: "linear-gradient(135deg, #ff6b35, #ffa07a)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  tagline: { fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: "0 0 32px" },
  features: { display: "flex", flexDirection: "column", gap: "10px" },
  feature: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "rgba(255,255,255,0.07)", borderRadius: "12px",
    padding: "10px 16px", animation: "fadeUp 0.6s ease both",
  },
  featureIcon: { fontSize: "20px" },
  featureText: { fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  right: {
    flex: 1, background: "#fafaf8",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px",
  },
  card: { width: "100%", maxWidth: "460px" },
  title: { fontSize: "32px", fontWeight: "800", color: "#1a1a2e", margin: "0 0 8px", letterSpacing: "-1px" },
  subtitle: { fontSize: "15px", color: "#888", margin: "0 0 28px" },
  errorBox: {
    background: "#fff0f0", border: "1px solid #ffcdd2", color: "#c62828",
    padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px",
  },
  row: { display: "flex", gap: "12px" },
  field: { flex: 1, marginBottom: "16px" },
  label: {
    display: "block", fontSize: "11px", fontWeight: "700", color: "#555",
    marginBottom: "7px", textTransform: "uppercase", letterSpacing: "0.8px",
  },
  input: {
    width: "100%", padding: "13px 15px", border: "2px solid #e8e8e8",
    borderRadius: "12px", fontSize: "15px", background: "white",
    boxSizing: "border-box", color: "#1a1a2e", transition: "all 0.2s",
  },
  inputFull: {
    width: "100%", padding: "13px 15px", border: "2px solid #e8e8e8",
    borderRadius: "12px", fontSize: "15px", background: "white",
    boxSizing: "border-box", color: "#1a1a2e", transition: "all 0.2s",
  },
  roleBadge: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "#fff5f0", border: "2px solid #ffe0d0",
    borderRadius: "12px", padding: "14px 16px", marginBottom: "20px",
  },
  roleBadgeIcon: { fontSize: "28px" },
  roleBadgeTitle: { fontSize: "14px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 2px" },
  roleBadgeSub: { fontSize: "12px", color: "#888", margin: 0 },
  btn: {
    width: "100%", padding: "15px", fontSize: "15px", fontWeight: "700",
    background: "linear-gradient(135deg, #ff6b35, #e55a28)",
    color: "white", border: "none", borderRadius: "14px", cursor: "pointer",
    boxShadow: "0 4px 20px rgba(255,107,53,0.35)", transition: "all 0.2s",
  },
  switchText: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#888" },
  link: { color: "#ff6b35", fontWeight: "700", textDecoration: "none" },
  ownerBox: {
    marginTop: "20px", padding: "14px 16px",
    background: "#f0f4ff", borderRadius: "12px", border: "1px solid #e0e8ff",
    textAlign: "center",
  },
  ownerText: { fontSize: "13px", color: "#667", margin: 0 },
  ownerLink: { color: "#3b82f6", fontWeight: "700", cursor: "pointer" },
};

export default Register;