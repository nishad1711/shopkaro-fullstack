import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addProduct, updateProduct, getProductById } from "../api/productApi";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { Upload, Save, ArrowLeft } from "lucide-react";

const CATEGORIES = ["Electronics", "Clothing", "Home Appliances", "Books", "Sports", "Beauty", "Other"];

const EMPTY = { name: "", brand: "", price: "", category: "Electronics", description: "", quantity: "", available: true, releaseDate: "" };

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    getProductById(id)
      .then((res) => setForm({ ...EMPTY, ...res.data }))
      .catch(() => toast.error("Could not load product"))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !file) { toast.error("Please upload a product image!"); return; }
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), quantity: Number(form.quantity) };
      if (isEdit) {
        await updateProduct(id, payload, file || new File([""], "placeholder.jpg", { type: "image/jpeg" }));
        toast.success("Product updated! ✓");
      } else {
        await addProduct(payload, file);
        toast.success("Product added! 🎉");
      }
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={styles.page}><Navbar /><div style={styles.loading}>Loading...</div></div>;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>{isEdit ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
            <p style={styles.subtitle}>Apna product add karo aur sale shuru karo!</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.grid}>
              {/* Left: Image Upload */}
              <div style={styles.imgCol}>
                <label style={styles.label}>Product Image</label>
                <div
                  style={styles.dropzone}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {preview ? (
                    <img src={preview} alt="preview" style={styles.previewImg} />
                  ) : (
                    <div style={styles.dropContent}>
                      <Upload size={32} color="var(--pink)" />
                      <p style={{ fontWeight: 600, marginTop: 8 }}>Click to upload image</p>
                      <p style={{ fontSize: 12, color: "var(--gray)" }}>PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
                {preview && (
                  <button type="button" style={styles.changeImgBtn} onClick={() => document.getElementById("fileInput").click()}>
                    Change Image
                  </button>
                )}
              </div>

              {/* Right: Form fields */}
              <div style={styles.fieldsCol}>
                <Field label="Product Name *" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Samsung Galaxy S24" />
                <Field label="Brand *" name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Samsung" />
                <Field label="Price (₹) *" name="price" type="number" value={form.price} onChange={handleChange} required placeholder="e.g. 29999" min="0" step="0.01" />
                <Field label="Quantity *" name="quantity" type="number" value={form.quantity} onChange={handleChange} required placeholder="e.g. 100" min="0" />
                <Field label="Release Date" name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} />

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Category *</label>
                  <select style={styles.select} name="category" value={form.category} onChange={handleChange} required>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    style={styles.textarea}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe the product..."
                  />
                </div>

                <div style={styles.toggleRow}>
                  <label style={styles.label}>Available</label>
                  <div style={styles.toggle}>
                    <input type="checkbox" id="available" name="available" checked={form.available} onChange={handleChange} style={{ display: "none" }} />
                    <label htmlFor="available" style={{ ...styles.toggleLabel, background: form.available ? "var(--green)" : "#e5e7eb" }}>
                      <div style={{ ...styles.toggleDot, transform: form.available ? "translateX(20px)" : "translateX(0)" }} />
                    </label>
                    <span style={{ fontSize: 14, fontWeight: 600, color: form.available ? "var(--green)" : "var(--gray)" }}>
                      {form.available ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.formActions}>
              <button type="button" style={styles.cancelBtn} onClick={() => navigate("/")}>Cancel</button>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                <Save size={16} />
                {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 6 }}>{label}</label>
      <input
        style={{
          width: "100%",
          border: "2px solid #e5e7eb",
          borderRadius: 8,
          padding: "9px 12px",
          fontSize: 14,
          fontFamily: "var(--font-body)",
          outline: "none",
          transition: "border-color 0.2s",
          background: "#fff",
        }}
        {...props}
        onFocus={(e) => e.target.style.borderColor = "var(--pink)"}
        onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
      />
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#fafafa" },
  loading: { textAlign: "center", padding: 80, color: "var(--gray)" },
  container: { maxWidth: 900, margin: "0 auto", padding: "24px 24px 60px" },
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
    cursor: "pointer",
  },
  card: { background: "#fff", borderRadius: 18, boxShadow: "0 4px 32px rgba(0,0,0,0.07)", overflow: "hidden" },
  cardHeader: {
    background: "linear-gradient(135deg, var(--pink) 0%, #ff6b9d 100%)",
    padding: "28px 36px",
  },
  title: { fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, color: "#fff" },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 },
  form: { padding: 32 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 32 },
  imgCol: { display: "flex", flexDirection: "column" },
  fieldsCol: {},
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 6 },
  dropzone: {
    border: "2px dashed #ffc0cb",
    borderRadius: 12,
    minHeight: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "#fff9fb",
    transition: "border-color 0.2s",
    overflow: "hidden",
    marginBottom: 10,
  },
  dropContent: { textAlign: "center", color: "var(--gray)", padding: 20 },
  previewImg: { width: "100%", height: "100%", objectFit: "cover", maxHeight: 260 },
  changeImgBtn: {
    background: "var(--pink-light)",
    color: "var(--pink)",
    border: "2px solid var(--pink)",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
  },
  fieldGroup: { marginBottom: 16 },
  select: {
    width: "100%",
    border: "2px solid #e5e7eb",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    background: "#fff",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    border: "2px solid #e5e7eb",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    resize: "vertical",
    background: "#fff",
  },
  toggleRow: { display: "flex", alignItems: "center", gap: 16, marginBottom: 8 },
  toggle: { display: "flex", alignItems: "center", gap: 10 },
  toggleLabel: {
    display: "inline-block",
    width: 44,
    height: 24,
    borderRadius: 12,
    cursor: "pointer",
    position: "relative",
    transition: "background 0.3s",
  },
  toggleDot: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    transition: "transform 0.3s",
  },
  formActions: { display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24, paddingTop: 24, borderTop: "2px solid #f0f0f0" },
  cancelBtn: {
    padding: "11px 24px",
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    background: "#fff",
    color: "var(--gray)",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 28px",
    background: "var(--pink)",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};
