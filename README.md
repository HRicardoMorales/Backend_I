# Proyecto Backend_1 — E-commerce básico con Express, Handlebars y MongoDB

Este proyecto es una API RESTful construida con **Node.js**, **Express**, **MongoDB Atlas** y **Handlebars** para la entrega final del curso de backend.

---

## 🔧 Funcionalidades principales

### 📦 Productos
- CRUD completo (crear, leer, actualizar y eliminar)
- Soporte para paginación, filtros y ordenamiento
- Vistas en Handlebars para mostrar productos

### 🛒 Carritos
- Crear carritos y agregar productos
- Actualizar cantidades o productos en el carrito
- Eliminar productos o vaciar carrito
- `populate` para ver el detalle de los productos agregados

### 🎨 Vistas dinámicas
- Home con productos paginados
- Carrito renderizado desde MongoDB
- Soporte para `cid` en la URL para agregar productos desde el cliente

---

## 📁 Estructura de carpetas

Backend_1/
│── app.js
│── package.json
│── .env
│
├── routes/
│ ├── products.router.js
│ └── carts.router.js
│
├── models/
│ ├── product.model.js
│ └── cart.model.js
│
├── views/
│ ├── layouts/
│ │ └── main.handlebars
│ ├── products.handlebars
│ └── carts.handlebars
│
├── public/
│ └── css/
│ └── style.css
│
└── README.md

---

## 🧪 Testing con Postman

1. Importar la colección preparada para pruebas (CRUD de productos, carritos y vistas).
2. Usar el **Environment** `Backend_1 (local)` con variables:
base_url = http://localhost:8080
pid = (vacío, se llena en tests)
cid = (vacío, se llena en tests)

---

## 🚀 Endpoints principales

### Productos
- `GET /api/products` → listar productos
- `GET /api/products/:pid` → obtener producto por ID
- `POST /api/products` → crear producto
- `PUT /api/products/:pid` → actualizar producto
- `DELETE /api/products/:pid` → eliminar producto

### Carritos
- `POST /api/carts` → crear carrito
- `GET /api/carts/:cid` → obtener carrito (con `populate`)
- `POST /api/carts/:cid/product/:pid` → agregar producto
- `PUT /api/carts/:cid` → reemplazar productos
- `PUT /api/carts/:cid/products/:pid` → actualizar cantidad
- `DELETE /api/carts/:cid/products/:pid` → eliminar producto
- `DELETE /api/carts/:cid` → vaciar carrito

---

## 📌 Tecnologías usadas
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Mongoose](https://mongoosejs.com/)
- [Handlebars](https://handlebarsjs.com/)

---

