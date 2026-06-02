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
        await API.put(`/admin/orders/${id}`, { order_status: status });
        setOrders(orders.map(o => o.order_id === id ? { ...o, order_status: status } : o));
        showToast("Order status updated ✅");
    };

    const updateRestaurantStatus = async (id, is_approved) => {
        await API.put(`/admin/restaurants/${id}`, { is_approved, status: is_approved ? 'active' : 'rejected' });
        setRestaurants(restaurants.map(r => r.restaurant_id === id ? { ...r, is_approved } : r));
        showToast(is_approved ? "Restaurant approved ✅" : "Restaurant rejected ❌");
    };

    const statusColor = (s) => ({
        pending: "#f59e0b", confirmed: "#3b82f6", preparing: "#8b5cf6",
        delivered: "#10b981", cancelled: "#ef4444"
    }[s] || "#6b7280");

    return (
        <div style={S.page}>
            {/* Sidebar */}
            <div style={S.sidebar}>
                <div style={S.brand}>🍜 Foody Admin</div>
                {["orders", "restaurants", "users"].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        style={{ ...S.navBtn, ...(tab === t ? S.navActive : {}) }}>
                        {t === "orders" ? "📦" : t === "restaurants" ? "🏪" : "👥"} {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
                <button onClick={() => navigate("/restaurants")} style={S.backBtn}>← Customer View</button>
            </div>

            {/* Main */}
            <div style={S.main}>
                {toast && <div style={S.toast}>{toast}</div>}

                {/* Stats */}
                {stats && (
                    <div style={S.statsRow}>
                        {[
                            { label: "Total Users", value: stats.totalUsers, emoji: "👥", color: "#3b82f6" },
                            { label: "Total Orders", value: stats.totalOrders, emoji: "📦", color: "#f59e0b" },
                            { label: "Restaurants", value: stats.totalRestaurants, emoji: "🏪", color: "#10b981" },
                            { label: "Pending Approval", value: stats.pendingRestaurants, emoji: "⏳", color: "#ef4444" },
                        ].map(s => (
                            <div key={s.label} style={S.statCard}>
                                <span style={{ fontSize: "32px" }}>{s.emoji}</span>
                                <div style={{ ...S.statNum, color: s.color }}>{s.value}</div>
                                <div style={S.statLabel}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Orders Tab */}
                {tab === "orders" && (
                    <div>
                        <h2 style={S.heading}>All Orders</h2>
                        {orders.map(order => (
                            <div key={order.order_id} style={S.card}>
                                <div style={S.cardTop}>
                                    <div>
                                        <span style={S.orderId}>Order #{order.order_id}</span>
                                        <span style={{ ...S.badge, background: statusColor(order.order_status) + "22", color: statusColor(order.order_status) }}>
                                            {order.order_status}
                                        </span>
                                    </div>
                                    <span style={S.amount}>{Number(order.total_amount).toLocaleString()} ETB</span>
                                </div>
                                <p style={S.sub}>
                                    👤 {order.customers?.users?.first_name} {order.customers?.users?.last_name} &nbsp;|&nbsp;
                                    🏪 {order.restaurants?.name}
                                </p>
                                <div style={S.itemsList}>
                                    {order.order_items?.map(i => (
                                        <span key={i.order_item_id} style={S.itemTag}>{i.menu_items?.name} x{i.quantity}</span>
                                    ))}
                                </div>
                                <div style={S.statusBtns}>
                                    {["pending", "confirmed", "preparing", "delivered", "cancelled"].map(s => (
                                        <button key={s} onClick={() => updateOrderStatus(order.order_id, s)}
                                            style={{ ...S.sBtn, ...(order.order_status === s ? { background: statusColor(s), color: "white" } : {}) }}>
                                            {s}
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
                        <h2 style={S.heading}>All Restaurants</h2>
                        {restaurants.map(r => (
                            <div key={r.restaurant_id} style={S.card}>
                                <div style={S.cardTop}>
                                    <div>
                                        <span style={S.orderId}>{r.name}</span>
                                        <span style={{ ...S.badge, background: r.is_approved ? "#10b98122" : "#ef444422", color: r.is_approved ? "#10b981" : "#ef4444" }}>
                                            {r.is_approved ? "Approved" : "Pending"}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        {!r.is_approved && (
                                            <button onClick={() => updateRestaurantStatus(r.restaurant_id, true)} style={S.approveBtn}>✅ Approve</button>
                                        )}
                                        {r.is_approved && (
                                            <button onClick={() => updateRestaurantStatus(r.restaurant_id, false)} style={S.rejectBtn}>❌ Reject</button>
                                        )}
                                    </div>
                                </div>
                                <p style={S.sub}>📧 {r.email} &nbsp;|&nbsp; Owner: {r.restaurant_owners?.users?.first_name} {r.restaurant_owners?.users?.last_name}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Users Tab */}
                {tab === "users" && (
                    <div>
                        <h2 style={S.heading}>All Users</h2>
                        <div style={S.table}>
                            <div style={S.tableHead}>
                                <span>Name</span><span>Email</span><span>Role</span><span>Status</span>
                            </div>
                            {users.map(u => (
                                <div key={u.user_id} style={S.tableRow}>
                                    <span>{u.first_name} {u.last_name}</span>
                                    <span style={{ color: "#666" }}>{u.email}</span>
                                    <span style={{ ...S.badge, background: "#3b82f622", color: "#3b82f6" }}>{u.role}</span>
                                    <span style={{ ...S.badge, background: u.is_active ? "#10b98122" : "#ef444422", color: u.is_active ? "#10b981" : "#ef4444" }}>
                                        {u.is_active ? "Active" : "Inactive"}
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
    page: { display: "flex", minHeight: "100vh", background: "#f5f5f0", fontFamily: "sans-serif" },
    sidebar: { width: "220px", background: "#1a1a2e", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 },
    brand: { fontSize: "20px", fontWeight: "bold", color: "white", marginBottom: "24px", fontFamily: "Georgia,serif" },
    navBtn: { padding: "12px 16px", borderRadius: "10px", border: "none", background: "transparent", color: "#aaa", cursor: "pointer", textAlign: "left", fontSize: "14px", fontWeight: "600" },
    navActive: { background: "#ff6b3522", color: "#ff6b35" },
    backBtn: { marginTop: "auto", padding: "10px 16px", borderRadius: "10px", border: "1px solid #333", background: "transparent", color: "#666", cursor: "pointer", fontSize: "13px" },
    main: { flex: 1, padding: "32px", overflowY: "auto" },
    toast: { position: "fixed", top: "20px", right: "20px", background: "#1a1a2e", color: "white", padding: "12px 24px", borderRadius: "20px", fontSize: "14px", fontWeight: "600", zIndex: 999 },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "32px" },
    statCard: { background: "white", borderRadius: "16px", padding: "20px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
    statNum: { fontSize: "32px", fontWeight: "bold", margin: "8px 0 4px" },
    statLabel: { fontSize: "13px", color: "#999" },
    heading: { fontSize: "22px", fontWeight: "bold", color: "#1a1a2e", marginBottom: "16px" },
    card: { background: "white", borderRadius: "16px", padding: "20px", marginBottom: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
    orderId: { fontWeight: "bold", fontSize: "16px", color: "#1a1a2e", marginRight: "10px" },
    badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
    amount: { fontWeight: "bold", color: "#ff6b35", fontSize: "16px" },
    sub: { color: "#888", fontSize: "13px", margin: "4px 0 8px" },
    itemsList: { display: "flex", flexWrap: "wrap", gap: "6px", margin: "8px 0" },
    itemTag: { background: "#f5f5f0", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", color: "#555" },
    statusBtns: { display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" },
    sBtn: { padding: "5px 12px", borderRadius: "20px", border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#555" },
    approveBtn: { padding: "6px 14px", borderRadius: "20px", border: "none", background: "#10b981", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    rejectBtn: { padding: "6px 14px", borderRadius: "20px", border: "none", background: "#ef4444", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
    table: { background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
    tableHead: { display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", padding: "14px 20px", background: "#f5f5f0", fontWeight: "700", fontSize: "13px", color: "#888" },
    tableRow: { display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", padding: "14px 20px", borderTop: "1px solid #f0f0f0", fontSize: "14px", alignItems: "center" },
};

export default AdminDashboard;