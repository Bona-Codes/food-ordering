import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function RestaurantOwnerDashboard() {
    const [tab, setTab] = useState("orders");
    const [orders, setOrders] = useState([]);
    const [menu, setMenu] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [toast, setToast] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", price: "", preparation_time: "15" });
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/owner/restaurant").then(r => setRestaurant(r.data)).catch(() => { });
        API.get("/owner/orders").then(r => setOrders(r.data)).catch(() => { });
        API.get("/owner/menu").then(r => setMenu(r.data)).catch(() => { });
    }, []);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

    const updateOrderStatus = async (id, status) => {
        try {
            await API.put(`/owner/orders/${id}`, { order_status: status });
            setOrders(orders.map(o => o.order_id === id ? { ...o, order_status: status } : o));
            showToast("Order updated ✅");
        } catch { showToast("Failed ❌"); }
    };

    const addMenuItem = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/owner/menu", form);
            setMenu([res.data.item, ...menu]);
            setForm({ name: "", description: "", price: "", preparation_time: "15" });
            setShowAddForm(false);
            showToast("Menu item added ✅");
        } catch { showToast("Failed to add item ❌"); }
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/owner/menu/${editItem.menu_item_id}`, form);
            setMenu(menu.map(i => i.menu_item_id === editItem.menu_item_id ? { ...i, ...form } : i));
            setEditItem(null);
            setForm({ name: "", description: "", price: "", preparation_time: "15" });
            showToast("Item updated ✅");
        } catch { showToast("Failed ❌"); }
    };

    const deleteItem = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await API.delete(`/owner/menu/${id}`);
            setMenu(menu.filter(i => i.menu_item_id !== id));
            showToast("Item deleted ✅");
        } catch { showToast("Failed ❌"); }
    };

    const startEdit = (item) => {
        setEditItem(item);
        setForm({ name: item.name, description: item.description || "", price: item.price, preparation_time: item.preparation_time || 15 });
        setShowAddForm(false);
    };

    const statusColor = (s) => ({ pending: "#f59e0b", accepted: "#3b82f6", preparing: "#8b5cf6", out_for_delivery: "#06b6d4", delivered: "#10b981", cancelled: "#ef4444" }[s] || "#6b7280");
    const statusIcon = (s) => ({ pending: "⏳", accepted: "✅", preparing: "👨‍🍳", out_for_delivery: "🛵", delivered: "🎉", cancelled: "❌" }[s] || "•");
    const emojis = ["🍔", "🍕", "🌮", "🍜", "🥗", "🍣", "🥩", "🍗", "🧆", "🥙", "🍛", "🥘", "🍲", "🫕", "🥞", "🧇", "🥐", "🍞"];

    return (
        <div style={S.page}>
            <style>{`
                @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes toastIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
                .nav-btn:hover { background: rgba(255,107,53,0.1) !important; color: #ff6b35 !important; }
                .status-btn:hover { opacity:0.85; transform:scale(1.03); }
                .menu-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
                .input-field:focus { border-color: #ff6b35 !important; outline: none; box-shadow: 0 0 0 3px rgba(255,107,53,0.1) !important; }
            `}</style>

            {/* Sidebar */}
            <div style={S.sidebar}>
                <div style={S.brand}>
                    <span style={{ fontSize: "28px" }}>🏪</span>
                    <span>Owner Panel</span>
                </div>
                <div style={S.navSection}>
                    {[
                        { key: "orders", icon: "📦", label: "Orders" },
                        { key: "menu", icon: "🍽️", label: "Menu Items" },
                    ].map(t => (
                        <button key={t.key} className="nav-btn" onClick={() => setTab(t.key)}
                            style={{ ...S.navBtn, ...(tab === t.key ? S.navActive : {}) }}>
                            <span>{t.icon}</span> {t.label}
                            {tab === t.key && <span style={S.navDot}></span>}
                        </button>
                    ))}
                </div>
                <div style={S.sidebarBottom}>
                    {restaurant && (
                        <div style={S.restaurantInfo}>
                            <p style={S.restaurantName}>🏪 {restaurant.name}</p>
                            <p style={S.restaurantStatus}>
                                {restaurant.is_approved ? "✅ Active" : "⏳ Pending approval"}
                            </p>
                        </div>
                    )}
                    <button onClick={() => navigate("/restaurants")} style={S.backBtn}>← Customer View</button>
                </div>
            </div>

            {/* Main */}
            <div style={S.main}>
                {toast && <div style={S.toast}>{toast}</div>}

                {/* Orders Tab */}
                {tab === "orders" && (
                    <div>
                        <div style={S.tabHeader}>
                            <h2 style={S.heading}>Incoming Orders</h2>
                            <span style={S.tabCount}>{orders.length} orders</span>
                        </div>
                        {orders.length === 0 ? (
                            <div style={S.empty}>📭 No orders yet</div>
                        ) : orders.map((order, idx) => (
                            <div key={order.order_id} style={{ ...S.card, animationDelay: `${idx * 0.05}s` }}>
                                <div style={S.cardTop}>
                                    <div style={S.cardTopLeft}>
                                        <span style={S.orderId}>Order #{order.order_id}</span>
                                        <span style={{ ...S.badge, background: statusColor(order.order_status) + "22", color: statusColor(order.order_status), border: `1px solid ${statusColor(order.order_status)}44` }}>
                                            {statusIcon(order.order_status)} {order.order_status.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <span style={S.amount}>{Number(order.total_amount).toLocaleString()} ETB</span>
                                </div>
                                <p style={S.sub}>
                                    👤 {order.customers?.users?.first_name} {order.customers?.users?.last_name}
                                    &nbsp;•&nbsp; 🕐 {new Date(order.order_date).toLocaleDateString()}
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
                                            style={{ ...S.sBtn, ...(order.order_status === s ? { background: statusColor(s), color: "white", border: `1px solid ${statusColor(s)}` } : {}) }}>
                                            {statusIcon(s)} {s.replace(/_/g, " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Menu Tab */}
                {tab === "menu" && (
                    <div>
                        <div style={S.tabHeader}>
                            <h2 style={S.heading}>Menu Items</h2>
                            <button onClick={() => { setShowAddForm(!showAddForm); setEditItem(null); setForm({ name: "", description: "", price: "", preparation_time: "15" }); }}
                                style={S.addBtn}>
                                {showAddForm ? "✕ Cancel" : "+ Add Item"}
                            </button>
                        </div>

                        {/* Add / Edit Form */}
                        {(showAddForm || editItem) && (
                            <div style={S.formCard}>
                                <h3 style={S.formTitle}>{editItem ? "✏️ Edit Item" : "➕ Add New Item"}</h3>
                                <form onSubmit={editItem ? saveEdit : addMenuItem}>
                                    <div style={S.formRow}>
                                        <div style={S.formField}>
                                            <label style={S.label}>Item Name</label>
                                            <input className="input-field" style={S.input} placeholder="e.g. Tibs"
                                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                        </div>
                                        <div style={S.formField}>
                                            <label style={S.label}>Price (ETB)</label>
                                            <input className="input-field" style={S.input} type="number" placeholder="250"
                                                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                                        </div>
                                        <div style={S.formField}>
                                            <label style={S.label}>Prep Time (min)</label>
                                            <input className="input-field" style={S.input} type="number" placeholder="15"
                                                value={form.preparation_time} onChange={e => setForm({ ...form, preparation_time: e.target.value })} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={S.label}>Description</label>
                                        <textarea className="input-field" style={S.textarea} placeholder="Describe the dish..."
                                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                    </div>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button type="submit" style={S.submitBtn}>
                                            {editItem ? "💾 Save Changes" : "✅ Add to Menu"}
                                        </button>
                                        <button type="button" onClick={() => { setShowAddForm(false); setEditItem(null); }} style={S.cancelBtn}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Menu Grid */}
                        <div style={S.menuGrid}>
                            {menu.map((item, i) => (
                                <div key={item.menu_item_id} className="menu-card" style={{ ...S.menuCard, animationDelay: `${i * 0.05}s` }}>
                                    <div style={{ ...S.menuCardImg, background: `hsl(${(i * 47) % 360}, 60%, 65%)` }}>
                                        <span style={{ fontSize: "40px" }}>{emojis[i % emojis.length]}</span>
                                        <div style={{ ...S.availBadge, background: item.availability_status ? "#10b98122" : "#ef444422", color: item.availability_status ? "#10b981" : "#ef4444" }}>
                                            {item.availability_status ? "Available" : "Unavailable"}
                                        </div>
                                    </div>
                                    <div style={S.menuCardBody}>
                                        <h3 style={S.menuItemName}>{item.name}</h3>
                                        <p style={S.menuItemDesc}>{item.description || "No description"}</p>
                                        <div style={S.menuCardFooter}>
                                            <span style={S.menuPrice}>{Number(item.price).toLocaleString()} ETB</span>
                                            <span style={S.prepTime}>⏱ {item.preparation_time} min</span>
                                        </div>
                                        <div style={S.menuActions}>
                                            <button onClick={() => startEdit(item)} style={S.editBtn}>✏️ Edit</button>
                                            <button onClick={() => deleteItem(item.menu_item_id)} style={S.deleteBtn}>🗑 Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {menu.length === 0 && !showAddForm && (
                            <div style={S.empty}>
                                🍽️ No menu items yet. Click "+ Add Item" to get started!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const S = {
    page: { display: "flex", minHeight: "100vh", background: "#f0f2f5", fontFamily: "sans-serif" },
    sidebar: { width: "240px", background: "#1a1a2e", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" },
    brand: { display: "flex", alignItems: "center", gap: "10px", padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "18px", fontWeight: "800", color: "white" },
    navSection: { padding: "16px 12px", flex: 1 },
    navBtn: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "none", background: "transparent", color: "#8892a4", cursor: "pointer", textAlign: "left", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px", position: "relative", marginBottom: "4px", transition: "all 0.2s" },
    navActive: { background: "rgba(255,107,53,0.12)", color: "#ff6b35" },
    navDot: { position: "absolute", right: "12px", width: "6px", height: "6px", borderRadius: "50%", background: "#ff6b35" },
    sidebarBottom: { padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" },
    restaurantInfo: { background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px", marginBottom: "12px" },
    restaurantName: { color: "white", fontWeight: "700", fontSize: "14px", margin: "0 0 4px" },
    restaurantStatus: { color: "#8892a4", fontSize: "12px", margin: 0 },
    backBtn: { width: "100%", padding: "10px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#8892a4", cursor: "pointer", fontSize: "13px", fontWeight: "600", textAlign: "left" },
    main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
    toast: { position: "fixed", top: "20px", right: "20px", background: "#1a1a2e", color: "white", padding: "12px 24px", borderRadius: "50px", fontSize: "14px", fontWeight: "600", zIndex: 999, boxShadow: "0 8px 30px rgba(0,0,0,0.2)", animation: "toastIn 0.3s ease" },
    tabHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" },
    heading: { fontSize: "22px", fontWeight: "800", color: "#1a1a2e", margin: 0 },
    tabCount: { background: "#ff6b35", color: "white", borderRadius: "20px", padding: "3px 12px", fontSize: "13px", fontWeight: "700" },
    addBtn: { background: "linear-gradient(135deg, #ff6b35, #e55a28)", color: "white", border: "none", padding: "10px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 12px rgba(255,107,53,0.3)" },
    card: { background: "white", borderRadius: "16px", padding: "20px", marginBottom: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", animation: "fadeIn 0.5s ease both" },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
    cardTopLeft: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
    orderId: { fontWeight: "800", fontSize: "16px", color: "#1a1a2e" },
    badge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
    amount: { fontWeight: "900", color: "#ff6b35", fontSize: "18px" },
    sub: { color: "#999", fontSize: "13px", margin: "4px 0 10px" },
    itemsList: { display: "flex", flexWrap: "wrap", gap: "6px", margin: "8px 0" },
    itemTag: { background: "#f5f5f0", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", color: "#555", fontWeight: "500" },
    statusBtns: { display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #f5f5f0" },
    sBtn: { padding: "6px 14px", borderRadius: "20px", border: "1px solid #e8e8e8", background: "white", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#666", transition: "all 0.15s" },
    formCard: { background: "white", borderRadius: "16px", padding: "24px", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", animation: "fadeIn 0.3s ease" },
    formTitle: { fontSize: "18px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 20px" },
    formRow: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "14px", marginBottom: "14px" },
    formField: {},
    label: { display: "block", fontSize: "11px", fontWeight: "700", color: "#666", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
    input: { width: "100%", padding: "11px 14px", border: "2px solid #e8e8e8", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box", transition: "all 0.2s" },
    textarea: { width: "100%", padding: "11px 14px", border: "2px solid #e8e8e8", borderRadius: "10px", fontSize: "14px", boxSizing: "border-box", resize: "vertical", minHeight: "80px", transition: "all 0.2s", fontFamily: "sans-serif" },
    submitBtn: { padding: "12px 24px", background: "linear-gradient(135deg, #ff6b35, #e55a28)", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 12px rgba(255,107,53,0.3)" },
    cancelBtn: { padding: "12px 20px", background: "#f5f5f0", color: "#666", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
    menuGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" },
    menuCard: { background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "all 0.2s", animation: "fadeIn 0.5s ease both" },
    menuCardImg: { height: "120px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" },
    availBadge: { position: "absolute", top: "8px", right: "8px", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" },
    menuCardBody: { padding: "16px" },
    menuItemName: { fontSize: "15px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 4px" },
    menuItemDesc: { fontSize: "12px", color: "#aaa", margin: "0 0 12px", lineHeight: 1.4 },
    menuCardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
    menuPrice: { fontSize: "16px", fontWeight: "800", color: "#ff6b35" },
    prepTime: { fontSize: "12px", color: "#888", background: "#f5f5f0", padding: "3px 8px", borderRadius: "20px" },
    menuActions: { display: "flex", gap: "8px" },
    editBtn: { flex: 1, padding: "7px", background: "#eff6ff", color: "#3b82f6", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontWeight: "700" },
    deleteBtn: { flex: 1, padding: "7px", background: "#fef2f2", color: "#ef4444", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontWeight: "700" },
    empty: { textAlign: "center", padding: "60px", color: "#aaa", fontSize: "16px" },
};

export default RestaurantOwnerDashboard;