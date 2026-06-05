import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye, Star, Pencil, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductImageUrl } from "../api/productApi";

export default function ProductCard({ product, onDelete, animDelay = 0 }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = Math.floor(Math.random() * 25) + 10; // fake discount for UI flair
  const mrp = (product.price * (1 + discount / 100)).toFixed(0);

  return (
    <div
      className="fade-up"
      style={{ ...styles.card, animationDelay: `${animDelay}ms` }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Image */}
      <div style={styles.imgWrap}>
        {!imgErr ? (
          <img
            src={getProductImageUrl(product.id)}
            alt={product.name}
            style={styles.img}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div style={styles.imgPlaceholder}>
            <span style={{ fontSize: 40 }}>📦</span>
          </div>
        )}
        {!product.available && (
          <div style={styles.outBadge}>Out of Stock</div>
        )}
        <div style={styles.catBadge}>{product.category}</div>
        {/* Quick actions overlay */}
        <div style={styles.overlay}>
          <Link to={`/product/${product.id}`} style={styles.overlayBtn} title="View">
            <Eye size={17} />
          </Link>
          <Link to={`/edit-product/${product.id}`} style={styles.overlayBtn} title="Edit">
            <Pencil size={17} />
          </Link>
          {onDelete && (
            <button style={{ ...styles.overlayBtn, background: "#ffe4ec", color: "var(--pink)" }} onClick={() => onDelete(product.id)} title="Delete">
              <Trash2 size={17} />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={styles.body}>
        <div style={styles.brand}>{product.brand}</div>
        <div style={styles.name}>{product.name}</div>

        {/* Stars */}
        <div style={styles.stars}>
          {"★★★★".split("").map((s, i) => <span key={i} style={{ color: "#f59e0b", fontSize: 13 }}>{s}</span>)}
          <span style={{ color: "#ccc", fontSize: 13 }}>★</span>
          <span style={styles.ratingCount}>(128)</span>
        </div>

        {/* Price */}
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{product.price?.toLocaleString("en-IN")}</span>
          <span style={styles.mrp}>₹{Number(mrp).toLocaleString("en-IN")}</span>
          <span style={styles.discount}>{discount}% off</span>
        </div>

        <div style={styles.qty}>
          {product.available ? (
            <span style={{ color: "var(--green)", fontWeight: 600, fontSize: 12 }}>✓ In Stock ({product.quantity})</span>
          ) : (
            <span style={{ color: "#ef4444", fontWeight: 600, fontSize: 12 }}>✗ Out of Stock</span>
          )}
        </div>

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button
            style={added ? styles.btnAdded : styles.btnCart}
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            <ShoppingCart size={15} />
            {added ? "Added! ✓" : "Add to Cart"}
          </button>
          <Link to={`/product/${product.id}`} style={styles.btnView}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    cursor: "pointer",
    position: "relative",
  },
  imgWrap: {
    position: "relative",
    height: 210,
    background: "#f8f8f8",
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  imgPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #fff0f3 0%, #fafafa 100%)",
  },
  outBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#ef4444",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 20,
  },
  catBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "rgba(255,255,255,0.92)",
    color: "var(--pink)",
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 20,
    border: "1px solid #ffe4ec",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
    display: "flex",
    gap: 6,
    padding: "16px 10px 10px",
    opacity: 0,
    transition: "opacity 0.25s",
  },
  overlayBtn: {
    background: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 10px",
    display: "flex",
    alignItems: "center",
    color: "var(--navy)",
    fontSize: 12,
    fontWeight: 600,
    transition: "background 0.2s",
  },
  body: { padding: "14px 14px 16px" },
  brand: { fontSize: 11, color: "var(--gray)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  name: { fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 6, lineHeight: 1.3 },
  stars: { display: "flex", alignItems: "center", gap: 1, marginBottom: 8 },
  ratingCount: { fontSize: 11, color: "var(--gray)", marginLeft: 4 },
  priceRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" },
  price: { fontSize: 18, fontWeight: 800, color: "var(--navy)" },
  mrp: { fontSize: 12, color: "var(--gray)", textDecoration: "line-through" },
  discount: { fontSize: 12, fontWeight: 700, color: "var(--green)" },
  qty: { marginBottom: 12 },
  btnRow: { display: "flex", gap: 8 },
  btnCart: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    background: "var(--pink)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 0",
    fontWeight: 700,
    fontSize: 13,
    transition: "background 0.2s, transform 0.15s",
  },
  btnAdded: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    background: "var(--green)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "9px 0",
    fontWeight: 700,
    fontSize: 13,
  },
  btnView: {
    padding: "9px 16px",
    border: "2px solid var(--pink)",
    borderRadius: 8,
    color: "var(--pink)",
    fontWeight: 700,
    fontSize: 13,
    background: "transparent",
    display: "flex",
    alignItems: "center",
  },
};
