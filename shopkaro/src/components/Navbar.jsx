import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Plus, Home, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar({ onSearch }) {
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(q);
    else navigate(`/?search=${encodeURIComponent(q)}`);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>ShopKaro</span>
          <span style={styles.logoTag}>🛍️ Kharidne mein hi maza hai!</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            style={styles.searchInput}
            placeholder="Search products, brands..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" style={styles.searchBtn}>
            <Search size={18} color="#fff" />
          </button>
        </form>

        {/* Actions */}
        <div style={styles.actions}>
          <Link to="/" style={styles.navBtn} title="Home">
            <Home size={20} />
            <span style={styles.navBtnLabel}>Home</span>
          </Link>
          <Link to="/add-product" style={styles.navBtnPink} title="Add Product">
            <Plus size={20} />
            <span style={styles.navBtnLabel}>Add</span>
          </Link>
          <Link to="/cart" style={styles.cartBtn} title="Cart">
            <ShoppingBag size={22} />
            {count > 0 && <span style={styles.badge}>{count}</span>}
            <span style={styles.navBtnLabel}>Cart</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button style={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={styles.mobileMenu}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, padding: "0 16px 12px" }}>
            <input
              style={{ ...styles.searchInput, flex: 1 }}
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit" style={styles.searchBtn}><Search size={16} color="#fff" /></button>
          </form>
          <Link to="/" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>🏠 Home</Link>
          <Link to="/add-product" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>➕ Add Product</Link>
          <Link to="/cart" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>🛍️ Cart ({count})</Link>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    background: "#fff",
    borderBottom: "2px solid #ffe4ec",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 12px rgba(255,63,108,0.08)",
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    padding: "12px 24px",
    gap: 20,
  },
  logo: { display: "flex", flexDirection: "column", minWidth: 140 },
  logoText: {
    fontFamily: "var(--font-display)",
    fontSize: 26,
    fontWeight: 900,
    color: "var(--pink)",
    lineHeight: 1,
  },
  logoTag: { fontSize: 10, color: "var(--gray)", fontWeight: 500, whiteSpace: "nowrap" },
  searchForm: { flex: 1, display: "flex", maxWidth: 480 },
  searchInput: {
    flex: 1,
    border: "2px solid #ffe4ec",
    borderRight: "none",
    borderRadius: "8px 0 0 8px",
    padding: "9px 14px",
    fontSize: 14,
    outline: "none",
    fontFamily: "var(--font-body)",
    background: "#fff9fb",
    transition: "border-color 0.2s",
  },
  searchBtn: {
    background: "var(--pink)",
    border: "none",
    borderRadius: "0 8px 8px 0",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    transition: "background 0.2s",
  },
  actions: { display: "flex", gap: 8, alignItems: "center" },
  navBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "6px 12px",
    borderRadius: 8,
    color: "var(--gray)",
    fontWeight: 500,
    fontSize: 12,
    transition: "background 0.2s, color 0.2s",
    background: "transparent",
    border: "none",
  },
  navBtnPink: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "6px 12px",
    borderRadius: 8,
    color: "var(--pink)",
    fontWeight: 600,
    fontSize: 12,
    background: "var(--pink-light)",
    border: "none",
  },
  cartBtn: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "6px 14px",
    borderRadius: 8,
    color: "#fff",
    fontWeight: 600,
    fontSize: 12,
    background: "var(--pink)",
    border: "none",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "var(--navy)",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: "50%",
    width: 18,
    height: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnLabel: { fontSize: 11 },
  mobileToggle: { display: "none", background: "none", border: "none", color: "var(--pink)" },
  mobileMenu: {
    background: "#fff",
    borderTop: "1px solid #ffe4ec",
    display: "flex",
    flexDirection: "column",
  },
  mobileLink: {
    padding: "12px 24px",
    fontSize: 15,
    fontWeight: 500,
    borderBottom: "1px solid #f5f5f5",
    color: "var(--navy)",
  },
};
