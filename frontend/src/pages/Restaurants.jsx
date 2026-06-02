import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/restaurants").then((res) => setRestaurants(res.data));

        // Get role from JWT token
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUserRole(payload.role);
            } catch (e) { }
        }

        // Get user info
        API.get("/auth/profile").then((res) => {
            setUserName(res.data.user?.first_name || "");
        }).catch(() => { });
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const filtered = restaurants.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    const bgColors = ["#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4", "#ff9a9e", "#a29bfe"];

    return (
        <div style={S.page}>
            {/* Navbar */}
            <nav style={S.nav}>
                <div style={S.logo}>🍜 Foody</div>
                <div style={S.navRight}>
                    {userName && <span style={S.greeting}>👋 Hi, {userName}</span>}

                    {userRole === "admin" ? (
                        // Admin navbar
                        <button onClick={() => navigate("/admin")} style={S.adminBtn}>
                            ⚙️ Admin Dashboard
                        </button>
                    ) : (
                        // Customer navbar
                        <>
                            <button onClick={() => navigate("/cart")} style={S.navBtn}>🛒 Cart</button>
                            <button onClick={() => navigate("/orders")} style={S.ordersBtn}>📦 Orders</button>
                        </>
                    )}
                    <button onClick={logout} style={S.logoutBtn}>Logout</button>
                </div>
            </nav>

            {/* Hero */}
            <div style={S.hero}>
                <h1 style={S.heroTitle}>What are you<br />craving today?</h1>
                <p style={S.heroSub}>Order from the best restaurants in your area</p>
                <div style={S.searchBox}>
                    <span style={S.searchIcon}>🔍</span>
                    <input
                        style={S.searchInput}
                        placeholder="Search restaurants..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Restaurant List */}
            <div style={S.content}>
                <h2 style={S.sectionTitle}>
                    All Restaurants
                    <span style={S.count}>{filtered.length}</span>
                </h2>

                {userRole === "admin" && (
                    <div style={S.adminBanner}>
                        ⚠️ You are logged in as <strong>Admin</strong>. You cannot place orders.
                        <button onClick={() => navigate("/admin")} style={S.bannerBtn}>
                            Go to Admin Dashboard →
                        </button>
                    </div>
                )}

                <div style={S.grid}>
                    {filtered.map((r, i) => (
                        <div
                            key={r.restaurant_id}
                            onClick={() => navigate(`/menu/${r.restaurant_id}`)}
                            style={S.card}
                        >
                            <div style={{ ...S.cardImg, background: bgColors[i % bgColors.length] }}>
                                <span style={{ fontSize: "60px" }}>🍽️</span>
                                <div style={S.ratingBadge}>⭐ 4.5</div>
                            </div>
                            <div style={S.cardBody}>
                                <h3 style={S.cardTitle}>{r.name}</h3>
                                <p style={S.cardAddress}>📍 Addis Ababa</p>
                                <p style={S.cardCuisine}>Various cuisines</p>
                                <div style={S.cardFooter}>
                                    <span style={S.deliveryTime}>🕐 25-35 min</span>
                                    <button style={S.viewBtn}>View Menu →</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const S = {
    page: { minHeight: "100vh", background: "#f5f5f0", fontFamily: "sans-serif" },
    nav: {
        background: "white", padding: "0 40px", height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 20px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
    },
    logo: { fontSize: "22px", fontWeight: "bold", color: "#1a1a2e", fontFamily: "Georgia,serif" },
    navRight: { display: "flex", alignItems: "center", gap: "12px" },
    greeting: { fontSize: "14px", color: "#666", fontWeight: "600" },
    navBtn: {
        background: "#fff5f0", border: "none", color: "#ff6b35",
        padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
    },
    ordersBtn: {
        background: "#fff5f0", border: "none", color: "#ff6b35",
        padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
    },
    adminBtn: {
        background: "#1a1a2e", border: "none", color: "white",
        padding: "8px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
    },
    logoutBtn: {
        background: "#f5f5f0", border: "none", color: "#666",
        padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
    },
    hero: {
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "80px 40px", textAlign: "center",
    },
    heroTitle: { fontSize: "56px", fontWeight: "900", color: "white", margin: "0 0 16px", fontFamily: "Georgia,serif", lineHeight: 1.2 },
    heroSub: { fontSize: "18px", color: "rgba(255,255,255,0.7)", margin: "0 0 32px" },
    searchBox: {
        maxWidth: "600px", margin: "0 auto", background: "white",
        borderRadius: "50px", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
    },
    searchIcon: { fontSize: "20px" },
    searchInput: { flex: 1, border: "none", outline: "none", fontSize: "16px", background: "transparent" },
    content: { maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" },
    sectionTitle: { fontSize: "28px", fontWeight: "bold", color: "#1a1a2e", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" },
    count: { background: "#ff6b35", color: "white", borderRadius: "50%", width: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" },
    adminBanner: {
        background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "12px",
        padding: "14px 20px", marginBottom: "24px", fontSize: "14px", color: "#856404",
        display: "flex", alignItems: "center", gap: "16px",
    },
    bannerBtn: {
        background: "#1a1a2e", color: "white", border: "none",
        padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "13px", fontWeight: "600",
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" },
    card: { background: "white", borderRadius: "20px", overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transition: "transform 0.2s" },
    cardImg: { height: "180px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" },
    ratingBadge: { position: "absolute", top: "12px", right: "12px", background: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" },
    cardBody: { padding: "20px" },
    cardTitle: { fontSize: "20px", fontWeight: "bold", color: "#1a1a2e", margin: "0 0 8px" },
    cardAddress: { fontSize: "13px", color: "#888", margin: "0 0 4px" },
    cardCuisine: { fontSize: "13px", color: "#aaa", margin: "0 0 16px" },
    cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    deliveryTime: { fontSize: "13px", color: "#666", fontWeight: "600" },
    viewBtn: { background: "none", border: "none", color: "#ff6b35", fontWeight: "bold", cursor: "pointer", fontSize: "14px" },
};

export default Restaurants;