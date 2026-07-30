import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [tab, setTab] = useState("orders");
    const [orders, setOrders] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [toast, setToast] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/admin/stats").then(r => setStats(r.data));
        API.get("/admin/orders").then(r => setOrders(r.data));
        API.get("/admin/restaurants").then(r => setRestaurants(r.data));
        API.get("/admin/users").then(r => setUsers(r.data));
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

    const updateOrderStatus = async (id, status) => {
        try {
            await API.put(`/admin/orders/${id}`, { order_status: status });
            setOrders(orders.map(o => o.order_id === id ? { ...o, order_status: status } : o));
            showToast("Order status updated ✅");
        } catch {
            showToast("Failed to update order ❌");
        }
    };

    const updateRestaurantStatus = async (id, is_approved) => {
        try {
            await API.put(`/admin/restaurants/${id}`, {
                is_approved,
                status: is_approved ? "approved" : "suspended"
            });
            setRestaurants(restaurants.map(r => r.restaurant_id === id ? { ...r, is_approved } : r));
            showToast(is_approved ? "Restaurant approved ✅" : "Restaurant suspended ❌");
        } catch {
            showToast("Failed to update restaurant ❌");
        }
    };

    const statusColor = (s) => ({
        pending: "#f59e0b",
        accepted: "#3b82f6",
        preparing: "#8b5cf6",
        out_for_delivery: "#06b6d4",
        delivered: "#10b981",
        cancelled: "#ef4444"
    }[s] || "#6b7280");

    const statusIcon = (s) => ({
        pending: "⏳",
        accepted: "✅",
        preparing: "👨‍🍳",
        out_for_delivery: "🛵",
        delivered: "🎉",
        cancelled: "❌"
    }[s] || "•");

    return (
        <div style={S.page}>
            <style>{`
                @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes toastIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
                .nav-btn:hover { background: rgba(255,107,53,0.1) !important; color: #ff6b35 !important; }
                .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
                .order-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
                .status-btn:hover { opacity: 0.85; transform: scale(1.03); }
            `}</style>

            {/* Sidebar */}
            <div style={S.sidebar}>
                <div style={S.brand}>
                    <span style={S.brandEmoji}>🍜</span>
                    <span>Foody Admin</span>
                </div>

                <div style={S.navSection}>
                    {[
                        { key: "orders", icon: "📦", label: "Orders" },
                        { key: "restaurants", icon: "🏪", label: "Restaurants" },
                        { key: "users", icon: "👥", label: "Users" },
                    ].map(t => (
                        <button key={t.key} className="nav-btn" onClick={() => setTab(t.key)}
                            style={{ ...S.navBtn, ...(tab === t.key ? S.navActive : {}) }}>
                            <span style={S.navIcon}>{t.icon}</span>
                            {t.label}
                            {tab === t.key && <span style={S.navIndicator}></span>}
                        </button>
                    ))}
                </div>

                <div style={S.sidebarBottom}>
                    <button onClick={() => navigate("/restaurants")} style={S.backBtn}>
                        ← Customer View
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={S.main}>
                {/* Toast */}
                {toast && (
                    <div style={S.toast}>{toast}</div>
                )}

                {/* Stats Row */}
                {stats && (
                    <div style={S.statsRow}>
                        {[
                            { label: "Total Users", value: stats.totalUsers, emoji: "👥", color: "#3b82f6", bg: "#eff6ff" },
                            { label: "Total Orders", value: stats.totalOrders, emoji: "📦", color: "#f59e0b", bg: "#fffbeb" },
                            { label: "Restaurants", value: stats.totalRestaurants, emoji: "🏪", color: "#10b981", bg: "#ecfdf5" },
                            { label: "Pending Approval", value: stats.pendingRestaurants, emoji: "⏳", color: "#ef4444", bg: "#fef2f2" },
                        ].map((s, i) => (
                            <div key={s.label} className="stat-card"
                                style={{ ...S.statCard, background: s.bg, animationDelay: `${i * 0.08}s` }}>
                                <span style={S.statEmoji}>{s.emoji}</span>
                                <div style={{ ...S.statNum, color: s.color }}>{s.value}</div>
                                <div style={S.statLabel}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Orders Tab */}
                {tab === "orders" && (
                    <div>
                        <div style={S.tabHeader}>
                            <h2 style={S.heading}>All Orders</h2>
                            <span style={S.tabCount}>{orders.length} orders</span>
                        </div>
                        {orders.length === 0 ? (
                            <div style={S.empty}>📭 No orders yet</div>
                        ) : orders.map((order, idx) => (
                            <div key={order.order_id} className="order-card"
                                style={{ ...S.card, animationDelay: `${idx * 0.05}s` }}>
                                <div style={S.cardTop}>
                                    <div style={S.cardTopLeft}>
                                        <span style={S.orderId}>Order #{order.order_id}</span>
                                        <span style={{
                                            ...S.badge,
                                            background: statusColor(order.order_status) + "22",
                                            color: statusColor(order.order_status),
                                            border: `1px solid ${statusColor(order.order_status)}44`
                                        }}>
                                            {statusIcon(order.order_status)} {order.order_status.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <span style={S.amount}>{Number(order.total_amount).toLocaleString()} ETB</span>
                                </div>

                                <p style={S.sub}>
                                    👤 {order.customers?.users?.first_name} {order.customers?.users?.last_name}
                                    &nbsp;•&nbsp;
                                    🏪 {order.restaurants?.name}
                                    &nbsp;•&nbsp;
                                    🕐 {new Date(order.order_date).toLocaleDateString()}
                                </p>

                                <div style={S.itemsList}>
                                    {order.order_items?.map(i => (
                                        <span key={i.order_item_id} style={S.itemTag}>
                                            {i.menu_items?.name} ×{i.quantity}
                                        </span>
                                    ))}
                                </div>

                                <div style={S.statusBtns}>
                                    {["pending", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"].map(s => (
                                        <button key={s} className="status-btn"
                                            onClick={() => updateOrderStatus(order.order_id, s)}
                                            style={{
                                                ...S.sBtn,
                                                ...(order.order_status === s ? {
                                                    background: statusColor(s),
                                                    color: "white",
                                                    border: `1px solid ${statusColor(s)}`,
                                                } : {})
                                            }}>
                                            {statusIcon(s)} {s.replace(/_/g, " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Restaurants Tab */}
                {tab === "restaurants" && (
                    <div>
                        <div style={S.tabHeader}>
                            <h2 style={S.heading}>All Restaurants</h2>
                            <span style={S.tabCount}>{restaurants.length} restaurants</span>
                        </div>
                        {restaurants.length === 0 ? (
                            <div style={S.empty}>🏪 No restaurants yet</div>
                        ) : restaurants.map((r, idx) => (
                            <div key={r.restaurant_id} className="order-card"
                                style={{ ...S.card, animationDelay: `${idx * 0.05}s` }}>
                                <div style={S.cardTop}>
                                    <div style={S.cardTopLeft}>
                                        <span style={S.orderId}>🏪 {r.name}</span>
                                        <span style={{
                                            ...S.badge,
                                            background: r.is_approved ? "#10b98122" : "#f59e0b22",
                                            color: r.is_approved ? "#10b981" : "#f59e0b",
                                            border: `1px solid ${r.is_approved ? "#10b98144" : "#f59e0b44"}`
                                        }}>
                                            {r.is_approved ? "✅ Approved" : "⏳ Pending"}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        {!r.is_approved && (
                                            <button onClick={() => updateRestaurantStatus(r.restaurant_id, true)}
                                                style={S.approveBtn}>
                                                ✅ Approve
                                            </button>
                                        )}
                                        {r.is_approved && (
                                            <button onClick={() => updateRestaurantStatus(r.restaurant_id, false)}
                                                style={S.rejectBtn}>
                                                ⏸ Suspend
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p style={S.sub}>
                                    📧 {r.email || "No email"}
                                    &nbsp;•&nbsp;
                                    📞 {r.phone || "No phone"}
                                    &nbsp;•&nbsp;
                                    👤 Owner: {r.restaurant_owners?.users?.first_name} {r.restaurant_owners?.users?.last_name}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Users Tab */}
                {tab === "users" && (
                    <div>
                        <div style={S.tabHeader}>
                            <h2 style={S.heading}>All Users</h2>
                            <span style={S.tabCount}>{users.length} users</span>
                        </div>
                        <div style={S.table}>
                            <div style={S.tableHead}>
                                <span>Name</span>
                                <span>Email</span>
                                <span>Role</span>
                                <span>Status</span>
                            </div>
                            {users.map((u, idx) => (
                                <div key={u.user_id} style={{ ...S.tableRow, animationDelay: `${idx * 0.04}s` }}>
                                    <span style={{ fontWeight: "600", color: "#1a1a2e" }}>
                                        {u.first_name} {u.last_name}
                                    </span>
                                    <span style={{ color: "#666", fontSize: "13px" }}>{u.email}</span>
                                    <span style={{
                                        ...S.badge,
                                        background: u.role === "admin" ? "#8b5cf622" : "#3b82f622",
                                        color: u.role === "admin" ? "#8b5cf6" : "#3b82f6",
                                    }}>
                                        {u.role === "admin" ? "⚙️" : "👤"} {u.role}
                                    </span>
                                    <span style={{
                                        ...S.badge,
                                        background: u.is_active ? "#10b98122" : "#ef444422",
                                        color: u.is_active ? "#10b981" : "#ef4444",
                                    }}>
                                        {u.is_active ? "✅ Active" : "❌ Inactive"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const S = {
    page: { display: "flex", minHeight: "100vh", background: "#f0f2f5", fontFamily: "sans-serif" },
    sidebar: {
        width: "240px", background: "#1a1a2e",
        display: "flex", flexDirection: "column", flexShrink: 0,
        padding: "0", position: "sticky", top: 0, height: "100vh",
    },
    brand: {
        display: "flex", alignItems: "center", gap: "10px",
        padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        fontSize: "18px", fontWeight: "800", color: "white",
    },
    brandEmoji: { fontSize: "28px" },
    navSection: { padding: "16px 12px", flex: 1 },
    navBtn: {
        width: "100%", padding: "12px 16px", borderRadius: "12px",
        border: "none", background: "transparent", color: "#8892a4",
        cursor: "pointer", textAlign: "left", fontSize: "14px", fontWeight: "600",
        display: "flex", alignItems: "center", gap: "10px", position: "relative",
        marginBottom: "4px", transition: "all 0.2s",
    },
    navActive: { background: "rgba(255,107,53,0.12)", color: "#ff6b35" },
    navIcon: { fontSize: "18px" },
    navIndicator: {
        position: "absolute", right: "12px", width: "6px", height: "6px",
        borderRadius: "50%", background: "#ff6b35",
    },
    sidebarBottom: { padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" },
    backBtn: {
        width: "100%", padding: "10px 16px", borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
        color: "#8892a4", cursor: "pointer", fontSize: "13px", fontWeight: "600",
        textAlign: "left", transition: "all 0.2s",
    },
    main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
    toast: {
        position: "fixed", top: "20px", right: "20px",
        background: "#1a1a2e", color: "white", padding: "12px 24px",
        borderRadius: "50px", fontSize: "14px", fontWeight: "600", zIndex: 999,
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)", animation: "toastIn 0.3s ease",
    },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "28px" },
    statCard: {
        borderRadius: "16px", padding: "20px", textAlign: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)", transition: "all 0.2s",
        animation: "fadeIn 0.5s ease both", cursor: "default",
    },
    statEmoji: { fontSize: "28px" },
    statNum: { fontSize: "36px", fontWeight: "900", margin: "8px 0 4px", letterSpacing: "-1px" },
    statLabel: { fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },
    tabHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" },
    heading: { fontSize: "22px", fontWeight: "800", color: "#1a1a2e", margin: 0, letterSpacing: "-0.5px" },
    tabCount: { background: "#ff6b35", color: "white", borderRadius: "20px", padding: "3px 12px", fontSize: "13px", fontWeight: "700" },
    card: {
        background: "white", borderRadius: "16px", padding: "20px",
        marginBottom: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        transition: "all 0.2s", animation: "fadeIn 0.5s ease both",
    },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
    cardTopLeft: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
    orderId: { fontWeight: "800", fontSize: "16px", color: "#1a1a2e", letterSpacing: "-0.3px" },
    badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
    amount: { fontWeight: "900", color: "#ff6b35", fontSize: "18px", letterSpacing: "-0.5px" },
    sub: { color: "#999", fontSize: "13px", margin: "4px 0 10px" },
    itemsList: { display: "flex", flexWrap: "wrap", gap: "6px", margin: "10px 0" },
    itemTag: { background: "#f5f5f0", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", color: "#555", fontWeight: "500" },
    statusBtns: { display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #f5f5f0" },
    sBtn: {
        padding: "6px 14px", borderRadius: "20px", border: "1px solid #e8e8e8",
        background: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600",
        color: "#666", transition: "all 0.15s",
    },
    approveBtn: {
        padding: "8px 16px", borderRadius: "20px", border: "none",
        background: "#10b981", color: "white", cursor: "pointer",
        fontSize: "13px", fontWeight: "700", boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
    },
    rejectBtn: {
        padding: "8px 16px", borderRadius: "20px", border: "none",
        background: "#f59e0b", color: "white", cursor: "pointer",
        fontSize: "13px", fontWeight: "700", boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
    },
    empty: { textAlign: "center", padding: "60px", color: "#aaa", fontSize: "18px" },
    table: { background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" },
    tableHead: {
        display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr",
        padding: "14px 20px", background: "#f8f9fa",
        fontWeight: "700", fontSize: "12px", color: "#999",
        textTransform: "uppercase", letterSpacing: "0.5px",
    },
    tableRow: {
        display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr",
        padding: "14px 20px", borderTop: "1px solid #f5f5f0",
        fontSize: "14px", alignItems: "center", animation: "fadeIn 0.5s ease both",
    },
};

export default AdminDashboard;
