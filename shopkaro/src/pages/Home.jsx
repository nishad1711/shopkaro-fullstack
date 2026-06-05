import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, searchProducts, deleteProduct } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { Filter, RefreshCw, TrendingUp } from "lucide-react";

const CATEGORIES = ["All", "Electronics", "Clothing", "Home Appliances", "Books", "Sports", "Beauty"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const fetchProducts = useCallback(async (keyword = "") => {
    setLoading(true);
    try {
      const res = keyword
        ? await searchProducts(keyword)
        : await getAllProducts();
      setProducts(res.data || []);
    } catch {
      toast.error("Could not connect to backend. Showing demo data.");
      setProducts(DEMO_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const kw = searchParams.get("search") || "";
    setSearchQuery(kw);
    fetchProducts(kw);
  }, [searchParams, fetchProducts]);

  const handleSearch = (q) => {
    setSearchParams(q ? { search: q } : {});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted!");
      fetchProducts(searchQuery);
    } catch {
      toast.error("Delete failed.");
    }
  };

  let displayed = [...products];
  if (activeCategory !== "All") {
    displayed = displayed.filter((p) => p.category === activeCategory);
  }
  if (sortBy === "price-asc") displayed.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") displayed.sort((a, b) => b.price - a.price);
  if (sortBy === "name") displayed.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={styles.page}>
      <Navbar onSearch={handleSearch} />

      {/* Hero Banner */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroLeft}>
            <div style={styles.heroPill}>🔥 New Arrivals</div>
            <h1 style={styles.heroTitle}>
              Style mein <span style={{ color: "var(--pink)" }}>jiyo</span>,<br />
              Budget mein <span style={{ color: "#ffd700" }}>khelo!</span>
            </h1>
            <p style={styles.heroSub}>Kharidne mein hi maza hai — best deals, top brands, delivered fast.</p>
            <div style={styles.heroBtns}>
              <button style={styles.heroBtnPink} onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}>
                Shop Now →
              </button>
              <button style={styles.heroBtnOutline} onClick={() => handleSearch("Electronics")}>
                Top Electronics
              </button>
            </div>
          </div>
          <div style={styles.heroRight}>
            <div style={styles.heroStats}>
              {[["10K+", "Products"], ["500+", "Brands"], ["2M+", "Happy Customers"]].map(([n, l]) => (
                <div key={l} style={styles.heroStat}>
                  <span style={styles.heroStatNum}>{n}</span>
                  <span style={styles.heroStatLabel}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Chips */}
      <div style={styles.categoryBar}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            style={cat === activeCategory ? styles.chipActive : styles.chip}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters & Sort */}
      <div style={styles.toolbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={16} color="var(--pink)" />
          <span style={styles.resultCount}>
            {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
            {" "}· <b>{displayed.length}</b> items
          </span>
        </div>
        <div style={styles.sortWrap}>
          <Filter size={15} color="var(--gray)" />
          <select style={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort: Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
          <button style={styles.refreshBtn} onClick={() => fetchProducts("")} title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div style={styles.container}>
        {loading ? (
          <div style={styles.grid}>
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayed.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 60 }}>🛒</div>
            <h3>Koi product nahi mila!</h3>
            <p>Try a different search or category.</p>
            <button style={styles.heroBtnPink} onClick={() => { setSearchParams({}); setActiveCategory("All"); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {displayed.map((p, i) => (
              <ProductCard key={p.id} product={p} onDelete={handleDelete} animDelay={i * 60} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={styles.skeleton}>
      <div style={styles.skelImg} />
      <div style={{ padding: 14 }}>
        <div style={{ ...styles.skelLine, width: "40%", marginBottom: 8 }} />
        <div style={{ ...styles.skelLine, width: "80%", marginBottom: 10 }} />
        <div style={{ ...styles.skelLine, width: "55%" }} />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerInner}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "var(--pink)" }}>ShopKaro</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>Kharidne mein hi maza hai! 🛍️</div>
        </div>
        <div style={styles.footerLinks}>
          {["About Us", "Contact", "Privacy Policy", "Returns", "FAQ"].map((l) => (
            <button key={l} style={styles.footerLink} onClick={() => alert(`${l} — Coming soon!`)}>{l}</button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#999" }}>© 2024 ShopKaro. Made with ❤️</div>
      </div>
    </footer>
  );
}

// Demo products shown if backend is offline
const DEMO_PRODUCTS = [
  { id: 1, name: "Galaxy S23", brand: "Samsung", price: 999.99, category: "Electronics", available: true, quantity: 150, description: "Flagship phone" },
  { id: 2, name: 'MacBook Pro 14"', brand: "Apple", price: 1999.99, category: "Electronics", available: true, quantity: 85, description: "Pro laptop" },
  { id: 3, name: "Blue Cotton T-Shirt", brand: "Nike", price: 29.99, category: "Clothing", available: true, quantity: 300, description: "Casual tee" },
  { id: 4, name: "Blender Pro 5000", brand: "KitchenAid", price: 129.99, category: "Home Appliances", available: true, quantity: 120, description: "Pro blender" },
  { id: 5, name: "Coffee Table Book: Modern Art", brand: "ArtHouse", price: 49.99, category: "Books", available: true, quantity: 75, description: "Art book" },
  { id: 6, name: "Wireless Earbuds Pro", brand: "Sony", price: 179.99, category: "Electronics", available: false, quantity: 0, description: "Pro earbuds" },
];

const styles = {
  page: { minHeight: "100vh", background: "#fafafa" },
  hero: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
    padding: "40px 24px",
  },
  heroInner: {
    maxWidth: 1280,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 32,
    flexWrap: "wrap",
  },
  heroLeft: { flex: 1, minWidth: 280 },
  heroPill: {
    display: "inline-block",
    background: "rgba(255,63,108,0.2)",
    color: "var(--pink)",
    border: "1px solid var(--pink)",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(28px, 5vw, 48px)",
    fontWeight: 900,
    color: "#fff",
    lineHeight: 1.2,
    marginBottom: 12,
  },
  heroSub: { fontSize: 15, color: "#94a3b8", marginBottom: 24, maxWidth: 420 },
  heroBtns: { display: "flex", gap: 12, flexWrap: "wrap" },
  heroBtnPink: {
    background: "var(--pink)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 24px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "transform 0.15s",
  },
  heroBtnOutline: {
    background: "transparent",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: 10,
    padding: "12px 24px",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  heroRight: { display: "flex", justifyContent: "center" },
  heroStats: { display: "flex", gap: 32 },
  heroStat: { textAlign: "center" },
  heroStatNum: { display: "block", fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "#fff" },
  heroStatLabel: { fontSize: 12, color: "#94a3b8", fontWeight: 500 },
  categoryBar: {
    display: "flex",
    gap: 8,
    padding: "16px 24px",
    maxWidth: 1280,
    margin: "0 auto",
    overflowX: "auto",
    flexWrap: "nowrap",
  },
  chip: {
    background: "#fff",
    border: "2px solid #e5e7eb",
    borderRadius: 20,
    padding: "7px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
    color: "var(--gray)",
  },
  chipActive: {
    background: "var(--pink)",
    border: "2px solid var(--pink)",
    borderRadius: 20,
    padding: "7px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#fff",
    whiteSpace: "nowrap",
  },
  toolbar: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 24px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  resultCount: { fontSize: 14, color: "var(--gray)" },
  sortWrap: { display: "flex", alignItems: "center", gap: 8 },
  sortSelect: {
    border: "2px solid #e5e7eb",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    fontFamily: "var(--font-body)",
    background: "#fff",
    cursor: "pointer",
    outline: "none",
  },
  refreshBtn: {
    background: "var(--pink-light)",
    border: "none",
    borderRadius: 8,
    padding: "7px 10px",
    display: "flex",
    alignItems: "center",
    color: "var(--pink)",
    cursor: "pointer",
  },
  container: { maxWidth: 1280, margin: "0 auto", padding: "0 24px 40px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: 20,
  },
  empty: {
    textAlign: "center",
    padding: "80px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    color: "var(--gray)",
  },
  skeleton: {
    background: "#fff",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  skelImg: {
    height: 210,
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "800px 100%",
    animation: "shimmer 1.4s infinite",
  },
  skelLine: {
    height: 14,
    borderRadius: 7,
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "800px 100%",
    animation: "shimmer 1.4s infinite",
  },
  footer: {
    background: "#1a1a2e",
    padding: "32px 24px",
    marginTop: 40,
  },
  footerInner: {
    maxWidth: 1280,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 20,
  },
  footerLinks: { display: "flex", gap: 16, flexWrap: "wrap" },
  footerLink: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: 13,
    cursor: "pointer",
    transition: "color 0.2s",
  },
};
