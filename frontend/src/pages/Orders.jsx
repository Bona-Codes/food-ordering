import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    pending:   { color: "#ff9800", bg: "#fff8e1", icon: "⏳", label: "Pending" },
    confirmed: { color: "#2196f3", bg: "#e3f2fd", icon: "✅", label: "Confirmed" },
    preparing: { color: "#9c27b0", bg: "#f3e5f5", icon: "👨‍🍳", label: "Preparing" },
    delivered: { color: "#4caf50", bg: "#e8f5e9", icon: "🎉", label: "Delivered" },
    cancelled: { color: "#f44336", bg: "#ffebee", icon: "❌", label: "Cancelled" },
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button onClick={() => navigate("/restaurants")} style={styles.backBtn}>← Back</button>
        <span style={styles.logo}>🍜 Foody</span>
        <button onClick={() => navigate("/cart")} style={styles.cartBtn}>🛒 Cart</button>
      </nav>

      <div style={styles.content}>
        <div style={styles.titleRow}>
          <h1 style={styles.title}>My Orders</h1>
          {orders.length > 0 && (
            <span style={styles.badge}>{orders.length} orders</span>
          )}
        </div>

        {loading ? (
          <div style={styles.empty}><span style={{fontSize:"40px"}}>⏳</span><p>Loading orders...</p></div>
        ) : orders.length === 0 ? (
          <div style={styles.empty}>
            <span style={{fontSize:"70px"}}>📦</span>
            <h3 style={{color:"#1a1a2e", margin:"16px 0 8px"}}>No orders yet</h3>
            <p style={{color:"#aaa", marginBottom:"24px"}}>Your order history will appear here</p>
            <button onClick={() => navigate("/restaurants")} style={styles.browseBtn}>
              Order Now →
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {orders.map((order) => {
              const s = statusConfig[order.order_status] || statusConfig.pending;
              return (
                <div key={order.order_id} style={styles.card}>
                  {/* Card Header */}
                  <div style={styles.cardHeader}>
                    <div>
                      <span style={styles.orderNum}>Order #{order.order_id}</span>
                      <p style={styles.orderDate}>{formatDate(order.order_date)}</p>
                    </div>
                    <div style={{...styles.statusBadge, background: s.bg, color: s.color}}>
                      {s.icon} {s.label}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={styles.itemsSection}>
                    {order.order_items?.map((item, i) => (
                      <div key={item.order_item_id || i} style={styles.itemRow}>
                        <span style={styles.itemDot}>•</span>
                        <span style={styles.itemText}>
                          {item.menu_items?.name || "Item"} × {item.quantity}
                        </span>
                        <span style={styles.itemAmt}>
                          {(Number(item.price) * item.quantity).toLocaleString()} ETB
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={styles.cardFooter}>
                    <div style={styles.totalSection}>
                      <span style={styles.totalLabel}>Total Amount</span>
                      <span style={styles.totalAmount}>{Number(order.total_amount).toLocaleString()} ETB</span>
                    </div>
                    {/* Progress Bar */}
                    <div style={styles.progress}>
                      {["pending","confirmed","preparing","delivered"].map((step, i) => (
                        <div key={step} style={styles.progressStep}>
                          <div style={{
                            ...styles.progressDot,
                            background: ["pending","confirmed","preparing","delivered"]
                              .indexOf(order.order_status) >= i ? "#ff6b35" : "#e0e0e0"
                          }}></div>
                          <span style={styles.progressLabel}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f5f5f0", fontFamily: "sans-serif" },
  nav: {
    background: "white", padding: "0 40px", height: "68px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    boxShadow: "0 2px 20px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100,
  },
  backBtn: {
    background: "#f5f5f0", border: "none", color: "#444", padding: "8px 16px",
    borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
  },
  logo: { fontSize: "22px", fontWeight: "bold", color: "#1a1a2e", fontFamily: "'Georgia', serif" },
  cartBtn: {
    background: "#fff5f0", border: "none", color: "#ff6b35", padding: "8px 16px",
    borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
  },
  content: { maxWidth: "800px", margin: "0 auto", padding: "40px 20px" },
  titleRow: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" },
  title: { fontSize: "36px", fontWeight: "bold", color: "#1a1a2e", margin: 0, fontFamily: "'Georgia', serif" },
  badge: {
    background: "#ff6b35", color: "white", borderRadius: "20px",
    padding: "4px 14px", fontSize: "14px", fontWeight: "600",
  },
  empty: { textAlign: "center", padding: "80px 20px" },
  browseBtn: {
    background: "linear-gradient(135deg, #ff6b35, #e55a28)", color: "white",
    border: "none", padding: "12px 28px", borderRadius: "25px", cursor: "pointer",
    fontWeight: "bold", fontSize: "15px", boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
  },
  list: { display: "flex", flexDirection: "column", gap: "20px" },
  card: {
    background: "white", borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden",
  },
  cardHeader: {
    padding: "20px 24px", display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", borderBottom: "1px solid #f0f0f0",
  },
  orderNum: { fontSize: "18px", fontWeight: "bold", color: "#1a1a2e" },
  orderDate: { fontSize: "13px", color: "#aaa", margin: "4px 0 0" },
  statusBadge: {
    padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "600",
  },
  itemsSection: { padding: "16px 24px" },
  itemRow: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "6px 0", borderBottom: "1px solid #f9f9f9",
  },
  itemDot: { color: "#ff6b35", fontWeight: "bold" },
  itemText: { flex: 1, fontSize: "14px", color: "#444" },
  itemAmt: { fontSize: "14px", fontWeight: "600", color: "#666" },
  cardFooter: {
    padding: "16px 24px", background: "#fafaf8",
    borderTop: "1px solid #f0f0f0",
  },
  totalSection: { display: "flex", justifyContent: "space-between", marginBottom: "16px" },
  totalLabel: { fontSize: "14px", color: "#888" },
  totalAmount: { fontSize: "20px", fontWeight: "bold", color: "#ff6b35" },
  progress: { display: "flex", justifyContent: "space-between" },
  progressStep: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  progressDot: { width: "10px", height: "10px", borderRadius: "50%" },
  progressLabel: { fontSize: "10px", color: "#aaa", textTransform: "capitalize" },
};

export default Orders;
