import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    password: "", phone: "", role: "customer"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.bigEmoji}>🍕</div>
          <h1 style={styles.brand}>Foody</h1>
          <p style={styles.tagline}>Join thousands of<br />happy customers.</p>
          <div style={styles.features}>
            {["🚀 Fast delivery", "🍽️ 100+ restaurants", "💳 Easy checkout"].map((f, i) => (
              <div key={i} style={styles.feature}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Start ordering in minutes</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>First Name</label>
                <input type="text" placeholder="Bona" style={styles.input}
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Last Name</label>
                <input type="text" placeholder="Tesfa" style={styles.input}
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input type="email" placeholder="you@example.com" style={styles.inputFull}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone</label>
              <input type="text" placeholder="09xxxxxxxx" style={styles.inputFull}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input type="password" placeholder="••••••••" style={styles.inputFull}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>I am a</label>
              <select style={styles.inputFull} value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" style={loading ? {...styles.btn, opacity:0.7} : styles.btn} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'Georgia', serif" },
  left: {
    flex: "0 0 380px",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "60px 40px",
  },
  leftContent: { textAlign: "center", color: "white" },
  bigEmoji: { fontSize: "70px", marginBottom: "16px", display: "block" },
  brand: {
    fontSize: "48px", fontWeight: "bold", margin: "0 0 12px", letterSpacing: "-1px",
    background: "linear-gradient(135deg, #ff6b35, #f7c59f)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  tagline: { fontSize: "18px", lineHeight: 1.5, color: "rgba(255,255,255,0.7)", margin: "0 0 32px" },
  features: { display: "flex", flexDirection: "column", gap: "10px" },
  feature: {
    background: "rgba(255,255,255,0.08)", borderRadius: "10px",
    padding: "10px 16px", fontSize: "14px", color: "rgba(255,255,255,0.8)",
    fontFamily: "sans-serif",
  },
  right: {
    flex: 1, background: "#fafaf8",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "40px",
  },
  card: { width: "100%", maxWidth: "460px" },
  title: { fontSize: "32px", fontWeight: "bold", color: "#1a1a2e", margin: "0 0 8px", letterSpacing: "-1px" },
  subtitle: { fontSize: "15px", color: "#888", margin: "0 0 28px", fontFamily: "sans-serif" },
  errorBox: {
    background: "#fff0f0", border: "1px solid #ffcdd2", color: "#c62828",
    padding: "12px 16px", borderRadius: "10px", marginBottom: "20px",
    fontSize: "14px", fontFamily: "sans-serif",
  },
  row: { display: "flex", gap: "12px" },
  field: { flex: 1, marginBottom: "16px" },
  label: {
    display: "block", fontSize: "12px", fontWeight: "600", color: "#555",
    marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "sans-serif",
  },
  input: {
    width: "100%", padding: "12px 14px", border: "2px solid #e8e8e8",
    borderRadius: "10px", fontSize: "15px", outline: "none", background: "white",
    boxSizing: "border-box", fontFamily: "sans-serif",
  },
  inputFull: {
    width: "100%", padding: "12px 14px", border: "2px solid #e8e8e8",
    borderRadius: "10px", fontSize: "15px", outline: "none", background: "white",
    boxSizing: "border-box", fontFamily: "sans-serif",
  },
  btn: {
    width: "100%", padding: "15px", background: "linear-gradient(135deg, #ff6b35, #e55a28)",
    color: "white", border: "none", borderRadius: "12px", fontSize: "15px",
    fontWeight: "bold", cursor: "pointer", marginTop: "4px",
    fontFamily: "sans-serif", boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
  },
  switchText: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#888", fontFamily: "sans-serif" },
  link: { color: "#ff6b35", fontWeight: "bold", textDecoration: "none" },
};

export default Register;
