import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE || "https://ingenious-luck-production.up.railway.app/api";
const api = axios.create({ baseURL: BASE_URL });

// GET /api/products
export const getAllProducts = () => api.get("/products");

// GET /api/product/:id
export const getProductById = (id) => api.get(`/product/${id}`);

// GET /api/product/:id/image
export const getProductImageUrl = (id) => `${BASE_URL}/product/${id}/image`;

// POST /api/product  (multipart: product JSON + file)
export const addProduct = (productData, file) => {
  const form = new FormData();
  form.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
  form.append("file", file);
  return api.post("/product", form);
};

// PUT /api/product/:id  (multipart: product JSON + file)
export const updateProduct = (id, productData, file) => {
  const form = new FormData();
  form.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
  form.append("file", file);
  return api.put(`/product/${id}`, form);
};

// DELETE /api/product/:id
export const deleteProduct = (id) => api.delete(`/product/${id}`);

// GET /api/products/keyword?keyword=...
export const searchProducts = (keyword) => api.get(`/products/keyword?keyword=${encodeURIComponent(keyword)}`);
