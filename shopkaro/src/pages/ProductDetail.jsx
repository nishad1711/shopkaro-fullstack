import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getProductImageUrl, deleteProduct } from "../api/productApi";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { ShoppingCart, ArrowLeft, Pencil, Trash2, Package, Tag, Calendar, CheckCircle2, XCircle } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Deleted!");
      navigate("/");
    } catch {
      toast.error("Delete failed.");
    }
  };

  if (loading) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.loading}>Loading product...</div>
    </div>
  );

  if (!product) return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.empty}><span>😕</span><p>Product not found.</p><Link to="/" style={styles.backLink}>← Back to home</Link></div>
    </div>
  );

  const discount = Math.floor(Math.random() * 25) + 10;
  const mrp = (product.price * (1 + discount / 100)).toFixed(0);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <Link to="/" style={styles.backBtn}><ArrowLeft size={16} /> Back to Products</Link>

        <div style={styles.card}>
          {/* Image */}
          <div style={styles.imgSection}>
            {!imgErr ? (
              <img
                src={getProductImageUrl(product.id)}
                alt={product.name}
                style={styles.img}
                onError={() => setImgErr(true)}
              />
            ) : (
              <div style={styles.imgPlaceholder}><span style={{ fontSize: 80 }}>📦</span></div>
            )}
            <div style={styles.imgBadge}>{product.category}</div>
          </div>

          {/* Details */}
          <div style={styles.details}>
            <div style={styles.brand}>{product.brand}</div>
            <h1 style={styles.name}>{product.name}</h1>

            {/* Stars */}
            <div style={styles.stars}>
              {"★★★★".split("").map((s, i) => <span key={i} style={{ color: "#f59e0b", fontSize: 18 }}>{s}</span>)}
              <span style={{ color: "#ccc", fontSize: 18 }}>★</span>
              <span style={styles.ratingText}>4.2 · 1,284 ratings</span>
            </div>

            <div style={styles.divider} />

            {/* Price */}
            <div style={styles.priceBlock}>
              <span style={styles.price}>₹{product.price?.toLocaleString("en-IN")}</span>
              <span style={styles.mrp}>₹{Number(mrp).toLocaleString("en-IN")}</span>
              <span style={styles.discBadge}>{discount}% OFF</span>
            </div>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 18 }}>Inclusive of all taxes</div>

            {/* Meta */}
            <div style={styles.metaGrid}>
              <MetaItem icon={<Package size={15} />} label="Quantity" value={`${product.quantity} units`} />
              <MetaItem icon={<Tag size={15} />} label="Category" value={product.category} />
              <MetaItem icon={<Calendar size={15} />} label="Release Date" value={product.releaseDate || product.releasedate || "—"} />
              <MetaItem
                icon={product.available ? <CheckCircle2 size={15} color="var(--green)" /> : <XCircle size={15} color="#ef4444" />}
                label="Availability"
                value={product.available ? "In Stock" : "Out of Stock"}
                valueColor={product.available ? "var(--green)" : "#ef4444"}
              />
            </div>

            {product.description && (
              <div style={styles.desc}>
                <div style={styles.descTitle}>Description</div>
                <p style={styles.descText}>{product.description}</p>
              </div>
            )}

            {/* CTA */}
            <div style={styles.ctaRow}>
              <button
                style={product.available ? styles.btnBuy : styles.btnDisabled}
                disabled={!product.available}
                onClick={() => { addToCart(product); toast.success("Added to cart!"); navigate("/cart"); }}
              >
                <ShoppingCart size={18} />
                {product.available ? "Add to Cart" : "Out of Stock"}
              </button>
              <Link to={`/edit-product/${product.id}`} style={styles.btnEdit}>
                <Pencil size={16} /> Edit
              </Link>
              <button style={styles.btnDelete} onClick={handleDelete}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value, valueColor }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
      <span style={{ color: "var(--gray)" }}>{icon}</span>
      <span style={{ fontSize: 13, color: "var(--gray)", minWidth: 90 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: valueColor || "var(--navy)" }}>{value}</span>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#fafafa" },
  loading: { textAlign: "center", padding: 80, color: "var(--gray)" },
  empty: { textAlign: "center", padding: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  backLink: { color: "var(--pink)", fontWeight: 600 },
  container: { maxWidth: 1100, margin: "0 auto", padding: "24px 24px 60px" },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "var(--pink)",
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 20,
    padding: "6px 14px",
    border: "2px solid var(--pink)",
    borderRadius: 8,
    background: "var(--pink-light)",
  },
  card: {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    overflow: "hidden",
    gap: 0,
  },
  imgSection: { position: "relative", minHeight: 400, background: "#f8f8f8" },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  imgPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff0f3", minHeight: 400 },
  imgBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    background: "var(--pink)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 20,
  },
  details: { padding: "36px 36px 32px" },
  brand: { fontSize: 12, fontWeight: 700, color: "var(--pink)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 },
  name: { fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 900, color: "var(--navy)", marginBottom: 12, lineHeight: 1.2 },
  stars: { display: "flex", alignItems: "center", gap: 2, marginBottom: 16 },
  ratingText: { fontSize: 13, color: "var(--gray)", marginLeft: 8 },
  divider: { height: 1, background: "#f0f0f0", marginBottom: 20 },
  priceBlock: { display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" },
  price: { fontSize: 32, fontWeight: 900, color: "var(--navy)" },
  mrp: { fontSize: 16, color: "var(--gray)", textDecoration: "line-through" },
  discBadge: { background: "#dcfce7", color: "var(--green)", fontWeight: 800, fontSize: 13, padding: "4px 10px", borderRadius: 20 },
  metaGrid: { marginBottom: 20 },
  desc: { background: "#f9fafb", borderRadius: 10, padding: "14px 16px", marginBottom: 24 },
  descTitle: { fontWeight: 700, fontSize: 13, color: "var(--navy)", marginBottom: 6 },
  descText: { fontSize: 14, color: "var(--gray)", lineHeight: 1.6 },
  ctaRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  btnBuy: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "var(--pink)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "13px 20px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    minWidth: 160,
  },
  btnDisabled: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "#e5e7eb",
    color: "#9ca3af",
    border: "none",
    borderRadius: 10,
    padding: "13px 20px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "not-allowed",
    minWidth: 160,
  },
  btnEdit: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "13px 20px",
    border: "2px solid var(--pink)",
    borderRadius: 10,
    color: "var(--pink)",
    fontWeight: 700,
    fontSize: 14,
    background: "var(--pink-light)",
  },
  btnDelete: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "13px 20px",
    border: "2px solid #ef4444",
    borderRadius: 10,
    color: "#ef4444",
    fontWeight: 700,
    fontSize: 14,
    background: "#fef2f2",
    cursor: "pointer",
  },
};
