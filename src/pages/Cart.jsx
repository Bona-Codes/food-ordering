import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => setCart(null))
      .finally(() => setLoading(false));
  }, []);

  const placeOrder = async () => {
    setOrdering(true);
    try {
      await API.post("/orders");
      setToast("Order placed successfully!");
      setCart(null);
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      setToast("Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  const total = cart?.cart_items?.reduce((sum, i) => sum + Number(i.unit_price) * i.quantity, 0) || 0;
  const emojis = ["🍔","🍕","🌮","🍜","🥗","🍣","🥩","🍗"];

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button onClick={() => navigate("/restaurants")} style={styles.backBtn}>← Back</button>
        <span style={styles.logo}>🍜 Foody</span>
        <button onClick={() => navigate("/orders")} style={styles.ordersBtn}>📦 Orders</button>
      </nav>

      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.content}>
        <h1 style={styles.title}>Your Cart</h1>

        {loading ? (
          <div style={styles.empty}><span style={{fontSize:"40px"}}>⏳</span><p>Loading cart...</p></div>
        ) : !cart || cart.cart_items?.length === 0 ? (
          <div style={styles.empty}>
            <span style={{fontSize:"70px"}}>🛒</span>
            <h3 style={{color:"#1a1a2e", margin:"16px 0 8px"}}>Your cart is empty</h3>
            <p style={{color:"#aaa"}}>Add items from a restaurant to get started</p>
            <button onClick={() => navigate("/restaurants")} style={styles.browseBtn}>
              Browse Restaurants →
            </button>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Cart Items */}
            <div style={styles.itemsList}>
              <h2 style={styles.sectionTitle}>Items ({cart.cart_items.length})</h2>
              {cart.cart_items.map((item, i) => (
                <div key={item.cart_item_id} style={styles.itemCard}>
                  <div style={{...styles.itemIcon, background:`hsl(${(i*47)%360}, 60%, 65%)`}}>
                    <span style={{fontSize:"28px"}}>{emojis[i % emojis.length]}</span>
                  </div>
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemName}>{item.menu_items?.name}</h3>
                    <p style={styles.itemQty}>Quantity: {item.quantity}</p>
                  </div>
                  <div style={styles.itemPrice}>
                    {(Number(item.unit_price) * item.quantity).toLocaleString()} ETB
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={styles.summary}>
              <h2 style={styles.sectionTitle}>Order Summary</h2>
              <div style={styles.summaryCard}>
                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{total.toLocaleString()} ETB</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Delivery fee</span>
                  <span style={{color:"#4caf50"}}>Free</span>
                </div>
                <div style={styles.divider}></div>
                <div style={{...styles.summaryRow, fontWeight:"bold", fontSize:"20px"}}>
                  <span>Total</span>
                  <span style={{color:"#ff6b35"}}>{total.toLocaleString()} ETB</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={ordering}
                  style={ordering ? {...styles.orderBtn, opacity:0.7} : styles.orderBtn}
                >
                  {ordering ? "Placing Order..." : "🚀 Place Order"}
                </button>
                <p style={styles.note}>🔒 Secure checkout • Free delivery</p>
              </div>
            </div>
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
  ordersBtn: {
    background: "#fff5f0", border: "none", color: "#ff6b35", padding: "8px 16px",
    borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "14px",
  },
  toast: {
    position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
    background: "#1a1a2e", color: "white", padding: "12px 24px",
    borderRadius: "30px", fontSize: "14px", fontWeight: "600", zIndex: 999,
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
  },
  content: { maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" },
  title: { fontSize: "36px", fontWeight: "bold", color: "#1a1a2e", margin: "0 0 32px", fontFamily: "'Georgia', serif" },
  empty: { textAlign: "center", padding: "80px 20px" },
  browseBtn: {
    marginTop: "20px", background: "linear-gradient(135deg, #ff6b35, #e55a28)", color: "white",
    border: "none", padding: "12px 28px", borderRadius: "25px", cursor: "pointer",
    fontWeight: "bold", fontSize: "15px", boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
  },
  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" },
  sectionTitle: { fontSize: "18px", fontWeight: "bold", color: "#1a1a2e", margin: "0 0 16px" },
  itemsList: {},
  itemCard: {
    background: "white", borderRadius: "16px", padding: "16px",
    display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  itemIcon: {
    width: "60px", height: "60px", borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: "16px", fontWeight: "bold", color: "#1a1a2e", margin: "0 0 4px" },
  itemQty: { fontSize: "13px", color: "#aaa", margin: 0 },
  itemPrice: { fontSize: "16px", fontWeight: "bold", color: "#ff6b35", whiteSpace: "nowrap" },
  summary: {},
  summaryCard: {
    background: "white", borderRadius: "20px", padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  summaryRow: {
    display: "flex", justifyContent: "space-between", marginBottom: "12px",
    fontSize: "15px", color: "#444",
  },
  divider: { borderTop: "2px dashed #eee", margin: "16px 0" },
  orderBtn: {
    width: "100%", padding: "16px", background: "linear-gradient(135deg, #ff6b35, #e55a28)",
    color: "white", border: "none", borderRadius: "14px", fontSize: "16px",
    fontWeight: "bold", cursor: "pointer", marginTop: "16px",
    boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
  },
  note: { textAlign: "center", fontSize: "12px", color: "#aaa", marginTop: "12px" },
};

export default Cart;
