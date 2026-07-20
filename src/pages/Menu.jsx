import { useEffect, useState } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";

function Menu() {
  const { restaurantId } = useParams();
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState("");
  const [adding, setAdding] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/menu?restaurant_id=${restaurantId}`).then((res) => setItems(res.data));
  }, [restaurantId]);

  const addToCart = async (item) => {
    setAdding(item.menu_item_id);
    try {
      await API.post("/cart", {
        restaurant_id: parseInt(restaurantId),
        menu_item_id: item.menu_item_id,
        quantity: 1,
      });
      setToast(`${item.name} added to cart!`);
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setToast("Failed to add item");
    } finally {
      setAdding(null);
    }
  };

  const emojis = ["🍔","🍕","🌮","🍜","🥗","🍣","🥩","🍗","🧆","🥙"];

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <button onClick={() => navigate("/restaurants")} style={styles.backBtn}>
          ← Back
        </button>
        <span style={styles.logo}>🍜 Foody</span>
        <button onClick={() => navigate("/cart")} style={styles.cartBtn}>
          🛒 Cart
        </button>
      </nav>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Our Menu</h1>
        <p style={styles.headerSub}>{items.length} delicious items available</p>
      </div>

      {/* Toast */}
      {toast && (
        <div style={styles.toast}>
          ✅ {toast}
        </div>
      )}

      {/* Items Grid */}
      <div style={styles.content}>
        <div style={styles.grid}>
          {items.map((item, i) => (
            <div key={item.menu_item_id} style={styles.card}>
              <div style={{...styles.cardImg, background: `hsl(${(i * 47) % 360}, 60%, 65%)`}}>
                <span style={styles.itemEmoji}>{emojis[i % emojis.length]}</span>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemDesc}>{item.description || "Freshly prepared with the finest ingredients"}</p>
                <div style={styles.cardBottom}>
                  <span style={styles.price}>{item.price} ETB</span>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={adding === item.menu_item_id}
                    style={adding === item.menu_item_id ? {...styles.addBtn, opacity:0.7} : styles.addBtn}
                  >
                    {adding === item.menu_item_id ? "Adding..." : "+ Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div style={styles.empty}>
            <span style={{fontSize:"60px"}}>🍽️</span>
            <p>No menu items available</p>
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
  header: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
    padding: "40px", textAlign: "center",
  },
  headerTitle: {
    fontSize: "40px", fontWeight: "bold", color: "white", margin: "0 0 8px",
    fontFamily: "'Georgia', serif", letterSpacing: "-1px",
  },
  headerSub: { fontSize: "16px", color: "rgba(255,255,255,0.6)", margin: 0 },
  toast: {
    position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
    background: "#1a1a2e", color: "white", padding: "12px 24px",
    borderRadius: "30px", fontSize: "14px", fontWeight: "600", zIndex: 999,
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
  },
  content: { maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px",
  },
  card: {
    background: "white", borderRadius: "20px", overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transition: "transform 0.2s",
  },
  cardImg: {
    height: "140px", display: "flex", alignItems: "center", justifyContent: "center",
  },
  itemEmoji: { fontSize: "60px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" },
  cardBody: { padding: "20px" },
  itemName: { fontSize: "18px", fontWeight: "bold", color: "#1a1a2e", margin: "0 0 6px" },
  itemDesc: { fontSize: "13px", color: "#999", margin: "0 0 16px", lineHeight: 1.5 },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: "20px", fontWeight: "bold", color: "#ff6b35" },
  addBtn: {
    background: "linear-gradient(135deg, #ff6b35, #e55a28)", color: "white",
    border: "none", padding: "8px 20px", borderRadius: "20px",
    cursor: "pointer", fontWeight: "bold", fontSize: "14px",
    boxShadow: "0 4px 12px rgba(255,107,53,0.3)",
  },
  empty: { textAlign: "center", padding: "60px", color: "#aaa", fontSize: "18px" },
};

export default Menu;
