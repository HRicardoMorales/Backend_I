require('dotenv').config();
const express = require('express');
const { create } = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');

const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const viewsRouter = require('./src/routes/views.router');

const app = express();

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error Mongo:', err.message));

const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));

