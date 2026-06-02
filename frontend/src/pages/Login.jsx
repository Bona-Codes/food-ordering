import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/restaurants");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      setLoading(false);
    }
  };

  const foods = ["🍕","🍔","🌮","🍜","🍣","🥗","🍗","🧆","🥘","🍛","🫕","🥙"];

  return (
    <div style={S.page}>
      {/* Animated background particles */}
      <div style={S.bgOverlay} />
      {foods.map((f, i) => (
        <div key={i} style={{
          ...S.floatingFood,
          left: `${(i * 8.5) % 95}%`,
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${6 + (i % 4)}s`,
          fontSize: `${20 + (i % 3) * 8}px`,
          opacity: 0.12 + (i % 3) * 0.06,
        }}>{f}</div>
      ))}

      {/* Left Panel */}
      <div style={{...S.leftPanel, opacity: mounted ? 1 : 0, transform: mounted ? "translateX(0)" : "translateX(-40px)"}}>
        <div style={S.brandArea}>
          <div style={S.logoRing}>
            <span style={{fontSize:"44px"}}>🍜</span>
          </div>
          <h1 style={S.brandName}>Foody</h1>
          <p style={S.brandTagline}>Delicious food,<br/>delivered fast.</p>
        </div>

        <div style={S.featureList}>
          {[
            { icon: "⚡", text: "Lightning fast delivery" },
            { icon: "🏪", text: "100+ top restaurants" },
            { icon: "💳", text: "Secure payments" },
            { icon: "📦", text: "Real-time order tracking" },
          ].map((f, i) => (
            <div key={i} style={{...S.feature, animationDelay: `${0.3 + i * 0.15}s`}}>
              <span style={S.featureIcon}>{f.icon}</span>
              <span style={S.featureText}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Decorative dots */}
        <div style={S.dots}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{...S.dot, background: i === 0 ? "#ff6b35" : "rgba(255,255,255,0.3)"}} />
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{...S.rightPanel, opacity: mounted ? 1 : 0, transform: mounted ? "translateX(0)" : "translateX(40px)"}}>
        <div style={S.formCard}>
          <div style={S.formHeader}>
            <h2 style={S.formTitle}>Welcome back</h2>
            <p style={S.formSubtitle}>Sign in to your account</p>
          </div>

          {error && (
            <div style={S.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={S.form}>
            <div style={S.fieldGroup}>
              <label style={S.label}>EMAIL</label>
              <div style={S.inputWrapper}>
                <span style={S.inputIcon}>✉️</span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={S.input}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={S.fieldGroup}>
              <label style={S.label}>PASSWORD</label>
              <div style={S.inputWrapper}>
                <span style={S.inputIcon}>🔒</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  style={S.input}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{...S.submitBtn, opacity: loading ? 0.8 : 1}}
            >
              {loading ? (
                <span style={S.loadingDots}>
                  <span style={{...S.dot2, animationDelay:"0s"}} />
                  <span style={{...S.dot2, animationDelay:"0.2s"}} />
                  <span style={{...S.dot2, animationDelay:"0.4s"}} />
                </span>
              ) : (
                <>Sign In <span style={{marginLeft:"8px"}}>→</span></>
              )}
            </button>
          </form>

          <div style={S.divider}>
            <div style={S.dividerLine} />
            <span style={S.dividerText}>or</span>
            <div style={S.dividerLine} />
          </div>

          <p style={S.registerText}>
            Don't have an account?{" "}
            <Link to="/register" style={S.registerLink}>Create one</Link>
          </p>

          {/* Quick login hint */}
          <div style={S.hint}>
            <span style={{fontSize:"12px", color:"#aaa"}}>
              🔑 Customer: sagni@food.com &nbsp;|&nbsp; Admin: bona19@food.com
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,53,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(255,107,53,0); }
        }
      `}</style>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh", display: "flex", fontFamily: "'Georgia', serif",
    background: "#0f0f1a", position: "relative", overflow: "hidden",
  },
  bgOverlay: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(78,205,196,0.06) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  floatingFood: {
    position: "absolute", bottom: "-50px",
    animation: "floatUp linear infinite",
    pointerEvents: "none", zIndex: 0,
  },
  leftPanel: {
    width: "45%", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
    padding: "60px 50px", display: "flex", flexDirection: "column",
    justifyContent: "center", position: "relative", zIndex: 1,
    transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },
  brandArea: { marginBottom: "60px" },
  logoRing: {
    width: "88px", height: "88px", borderRadius: "24px",
    background: "linear-gradient(135deg, #ff6b35, #e55a28)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "24px", boxShadow: "0 8px 40px rgba(255,107,53,0.4)",
    animation: "pulse 3s infinite",
  },
  brandName: {
    fontSize: "52px", fontWeight: "900", color: "#ff6b35",
    margin: "0 0 12px", letterSpacing: "-1px",
    fontFamily: "'Georgia', serif",
  },
  brandTagline: {
    fontSize: "22px", color: "rgba(255,255,255,0.6)",
    lineHeight: 1.5, margin: 0,
  },
  featureList: { display: "flex", flexDirection: "column", gap: "20px" },
  feature: {
    display: "flex", alignItems: "center", gap: "16px",
    animation: "fadeSlideIn 0.6s ease forwards", opacity: 0,
  },
  featureIcon: {
    width: "44px", height: "44px", borderRadius: "12px",
    background: "rgba(255,107,53,0.15)", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: "20px",
    flexShrink: 0, border: "1px solid rgba(255,107,53,0.2)",
  },
  featureText: { fontSize: "16px", color: "rgba(255,255,255,0.8)", fontFamily: "sans-serif" },
  dots: { display: "flex", gap: "8px", marginTop: "60px" },
  dot: { width: "10px", height: "10px", borderRadius: "50%" },

  rightPanel: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px", position: "relative", zIndex: 1,
    transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
  },
  formCard: {
    width: "100%", maxWidth: "440px",
    background: "rgba(255,255,255,0.03)", borderRadius: "28px",
    padding: "48px 44px", border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
  },
  formHeader: { marginBottom: "36px" },
  formTitle: {
    fontSize: "38px", fontWeight: "900", color: "white",
    margin: "0 0 8px", fontFamily: "'Georgia', serif", letterSpacing: "-0.5px",
  },
  formSubtitle: { fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: "sans-serif" },
  errorBox: {
    background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "12px", padding: "12px 16px", marginBottom: "20px",
    color: "#fca5a5", fontSize: "14px", display: "flex", gap: "8px", alignItems: "center",
    fontFamily: "sans-serif",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.4)",
    letterSpacing: "1.5px", fontFamily: "sans-serif",
  },
  inputWrapper: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "rgba(255,255,255,0.06)", borderRadius: "14px",
    padding: "14px 18px", border: "1px solid rgba(255,255,255,0.08)",
    transition: "border-color 0.2s",
  },
  inputIcon: { fontSize: "18px", flexShrink: 0 },
  input: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "white", fontSize: "16px", fontFamily: "sans-serif",
  },
  submitBtn: {
    width: "100%", padding: "18px",
    background: "linear-gradient(135deg, #ff6b35, #e55a28)",
    color: "white", border: "none", borderRadius: "14px",
    fontSize: "17px", fontWeight: "700", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 8px 30px rgba(255,107,53,0.4)",
    marginTop: "8px", fontFamily: "sans-serif",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  loadingDots: { display: "flex", gap: "6px", alignItems: "center" },
  dot2: {
    width: "8px", height: "8px", background: "white", borderRadius: "50%",
    display: "inline-block", animation: "bounce 1.4s infinite ease-in-out",
  },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" },
  dividerLine: { flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" },
  registerText: { textAlign: "center", fontSize: "15px", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" },
  registerLink: { color: "#ff6b35", fontWeight: "700", textDecoration: "none" },
  hint: { textAlign: "center", marginTop: "16px", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "10px" },
};

export default Login;
