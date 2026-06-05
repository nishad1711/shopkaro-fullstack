# ShopKaro 🛍️
> **Kharidne mein hi maza hai!**

A full-featured React frontend for your Spring Boot product API — inspired by Myntra, Flipkart, and Amazon.

---

## 🚀 Setup

### Prerequisites
- Node.js 16+
- Your Spring Boot backend running on `http://localhost:8080`

### Install & Run
```bash
cd shopkaro
npm install
npm start
```
Opens at **http://localhost:3000**

---

## 🔗 Spring Boot API Mapping

| Feature | Endpoint |
|---|---|
| List all products | `GET /api/products` |
| Product detail | `GET /api/product/:id` |
| Product image | `GET /api/product/:id/image` |
| Add product | `POST /api/product` (multipart) |
| Update product | `PUT /api/product/:id` (multipart) |
| Delete product | `DELETE /api/product/:id` |
| Search | `GET /api/products/keyword?keyword=...` |

To change the backend URL, edit `src/api/productApi.js`:
```js
const BASE_URL = "http://localhost:8080/api";
```

---

## 📁 Project Structure

```
src/
├── api/
│   └── productApi.js       ← All API calls to Spring Boot
├── context/
│   └── CartContext.jsx     ← Global cart state
├── components/
│   ├── Navbar.jsx          ← Top navigation bar
│   └── ProductCard.jsx     ← Product grid card
├── pages/
│   ├── Home.jsx            ← Product listing + search + filters
│   ├── ProductDetail.jsx   ← Single product page
│   ├── ProductForm.jsx     ← Add / Edit product form
│   └── Cart.jsx            ← Cart + checkout flow
├── App.js                  ← Routes
├── index.js
└── index.css               ← CSS variables + global styles
```

---

## ✨ Features
- 🏠 Home with hero banner, category filters, sort
- 🔍 Live search (uses `/api/products/keyword`)
- 🛍️ Add/Edit/Delete products with image upload
- 🛒 Cart with qty controls, price summary, GST
- ✅ Order success animation with Hindi messages
- 📱 Responsive design
- 🌐 Works offline with demo data if backend is down

---

## 🎨 Design
- **Fonts**: Playfair Display + DM Sans
- **Colors**: Hot pink (`#FF3F6C`), Navy, Emerald
- **Inspiration**: Myntra, Flipkart, Amazon India
