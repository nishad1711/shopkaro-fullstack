import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { getProductImageUrl } from "../api/productApi";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, clearCart, total, count } = useCart();
  const navigate = useNavigate();
  const [ordered, setOrdered] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  const handleBuy = () => {
    setOrdered(true);
    setTimeout(() => {
      clearCart();
      setTimeout(() => {
        setOrdered(false);
        navigate("/");
      }, 2800);
    }, 1800);
  };

  const delivery = total > 500 ? 0 : 49;
  const tax = (total * 0.05).toFixed(2);
  const grand = (total + delivery + Number(tax)).toFixed(2);

  if (ordered) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successCard}>
          <CheckCircle size={72} color="var(--green)" strokeWidth={1.5} />
          <h2 style={styles.successTitle}>Order Placed Successfully! 🎉</h2>
          <p style={styles.successSub}>
            Kharidne mein hi maza hai! <br />
            Aapka order confirm ho gaya. Jaldi delivery aayegi!
          </p>
          <div style={styles.orderMeta}>
            <div style={styles.metaItem}><span>Total Paid</span><strong>₹{grand}</strong></div>
            <div style={styles.metaItem}><span>Items</span><strong>{count}</strong></div>
            <div style={styles.metaItem}><span>Estimated Delivery</span><strong>3-5 Days</strong></div>
          </div>
          <div style={styles.confetti}>🎊 🛍️ 🎊</div>
          <p style={{ fontSize: 13, color: "var(--gray)", marginTop: 12 }}>Redirecting to home...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.emptyCart}>
          <ShoppingBag size={80} color="#e5e7eb" strokeWidth={1} />
          <h3 style={styles.emptyTitle}>Aapka cart khali hai!</h3>
          <p style={styles.emptySub}>Kuch toh dalo, kharidne mein hi maza hai! 🛍️</p>
          <Link to="/" style={styles.shopBtn}>Abhi Kharido →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <Link to="/" style={styles.backBtn}><ArrowLeft size={16} /> Continue Shopping</Link>
        <h2 style={styles.pageTitle}>🛒 Mera Cart ({count} items)</h2>

        <div style={styles.layout}>
          {/* Cart Items */}
          <div style={styles.itemsCol}>
            {cartItems.map((item) => (
              <div key={item.id} style={styles.cartItem} className="fade-up">
                <div style={styles.itemImg}>
                  {!imgErrors[item.id] ? (
                    <img
                      src={getProductImageUrl(item.id)}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                      onError={() => setImgErrors(prev => ({ ...prev, [item.id]: true }))}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, background: "#fff0f3", borderRadius: 8 }}>📦</div>
                  )}
                </div>
                <div style={styles.itemInfo}>
                  <div style={styles.itemBrand}>{item.brand}</div>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemCat}>{item.category}</div>
                  <div style={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
                  <div style={styles.itemUnitPrice}>₹{item.price?.toLocaleString("en-IN")} each</div>
                </div>
                <div style={styles.itemControls}>
                  <div style={styles.qtyControl}>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty - 1)}>
                      <Minus size={14} />
                    </button>
                    <span style={styles.qtyNum}>{item.qty}</span>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={styles.summaryCol}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Price Details</h3>

              <div style={styles.summaryRows}>
                <div style={styles.summaryRow}>
                  <span>Price ({count} items)</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Delivery Charges</span>
                  <span style={{ color: delivery === 0 ? "var(--green)" : undefined }}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span>GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                {total > 500 && (
                  <div style={{ ...styles.summaryRow, color: "var(--green)", fontWeight: 600 }}>
                    <span>You saved</span>
                    <span>₹{delivery === 0 ? 49 : 0} on delivery</span>
                  </div>
                )}
              </div>

              <div style={styles.summaryDivider} />

              <div style={{ ...styles.summaryRow, fontSize: 18, fontWeight: 800 }}>
                <span>Total Amount</span>
                <span>₹{Number(grand).toLocaleString("en-IN")}</span>
              </div>

              {total > 500 && (
                <div style={styles.savingBadge}>🎉 Free delivery on this order!</div>
              )}

              <button style={styles.buyBtn} onClick={handleBuy}>
                <ShoppingBag size={18} />
                Place Order · ₹{Number(grand).toLocaleString("en-IN")}
              </button>

              <button style={styles.clearBtn} onClick={clearCart}>
                Clear Cart
              </button>

              <div style={styles.secureNote}>🔒 100% Secure Payments · Fast Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#fafafa" },
  container: { maxWidth: 1100, margin: "0 auto", padding: "24px 24px 60px" },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "var(--pink)",
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 16,
    padding: "6px 14px",
    border: "2px solid var(--pink)",
    borderRadius: 8,
    background: "var(--pink-light)",
  },
  pageTitle: { fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, marginBottom: 24 },
  layout: { display: "grid", gridTemplateColumns: "1fr 350px", gap: 24, alignItems: "start" },
  itemsCol: { display: "flex", flexDirection: "column", gap: 14 },
  cartItem: {
    background: "#fff",
    borderRadius: 14,
    padding: 18,
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  itemImg: { width: 90, height: 90, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "#f8f8f8" },
  itemInfo: { flex: 1 },
  itemBrand: { fontSize: 11, color: "var(--pink)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 },
  itemName: { fontSize: 15, fontWeight: 700, color: "var(--navy)", margin: "3px 0 4px" },
  itemCat: { fontSize: 11, color: "var(--gray)", marginBottom: 6 },
  itemPrice: { fontSize: 18, fontWeight: 800, color: "var(--navy)" },
  itemUnitPrice: { fontSize: 12, color: "var(--gray)" },
  itemControls: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    border: "2px solid #e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  qtyBtn: {
    background: "#f9fafb",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: "var(--navy)",
    transition: "background 0.2s",
  },
  qtyNum: { padding: "0 12px", fontWeight: 700, fontSize: 15, minWidth: 28, textAlign: "center" },
  removeBtn: {
    background: "#fef2f2",
    border: "none",
    borderRadius: 8,
    padding: "7px 10px",
    cursor: "pointer",
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
  },
  summaryCol: {},
  summaryCard: {
    background: "#fff",
    borderRadius: 14,
    padding: 24,
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 80,
  },
  summaryTitle: { fontWeight: 800, fontSize: 13, color: "var(--gray)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 18 },
  summaryRows: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--navy)" },
  summaryDivider: { height: 2, background: "#f0f0f0", marginBottom: 16 },
  savingBadge: {
    background: "#dcfce7",
    color: "var(--green)",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 600,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  buyBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    background: "var(--pink)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "14px 0",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 16,
    transition: "background 0.2s",
  },
  clearBtn: {
    width: "100%",
    background: "transparent",
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 0",
    fontWeight: 600,
    fontSize: 14,
    color: "var(--gray)",
    cursor: "pointer",
    marginTop: 8,
  },
  secureNote: { textAlign: "center", fontSize: 12, color: "var(--gray)", marginTop: 14 },
  emptyCart: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 24px",
    gap: 14,
    textAlign: "center",
  },
  emptyTitle: { fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "var(--navy)" },
  emptySub: { fontSize: 16, color: "var(--gray)" },
  shopBtn: {
    background: "var(--pink)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "13px 28px",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 8,
    display: "inline-block",
  },
  successPage: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff0f3 0%, #f0fdf4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCard: {
    background: "#fff",
    borderRadius: 24,
    padding: "56px 48px",
    textAlign: "center",
    maxWidth: 460,
    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
    animation: "fadeUp 0.5s ease",
  },
  successTitle: {
    fontFamily: "var(--font-display)",
    fontSize: 28,
    fontWeight: 900,
    color: "var(--navy)",
    marginTop: 20,
    marginBottom: 10,
  },
  successSub: { fontSize: 15, color: "var(--gray)", lineHeight: 1.7, marginBottom: 24 },
  orderMeta: {
    display: "flex",
    justifyContent: "center",
    gap: 24,
    background: "#f9fafb",
    borderRadius: 12,
    padding: "16px 20px",
    marginBottom: 20,
  },
  metaItem: { display: "flex", flexDirection: "column", gap: 4, alignItems: "center" },
  confetti: { fontSize: 32, letterSpacing: 8 },
};
