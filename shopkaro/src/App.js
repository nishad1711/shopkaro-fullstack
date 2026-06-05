import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import ProductForm from "./pages/ProductForm";
import Cart from "./pages/Cart";
import "./index.css";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "var(--font-body)",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: 14,
            },
            success: { style: { background: "#f0fdf4", color: "#16a34a", border: "2px solid #bbf7d0" } },
            error: { style: { background: "#fff0f3", color: "#e11d48", border: "2px solid #fecdd3" } },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/edit-product/:id" element={<ProductForm />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={
            <div style={{ textAlign: "center", padding: 80 }}>
              <div style={{ fontSize: 60 }}>🔍</div>
              <h2>404 — Page nahi mila!</h2>
              <a href="/" style={{ color: "var(--pink)", fontWeight: 700 }}>← Ghar Wapas Jao</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
