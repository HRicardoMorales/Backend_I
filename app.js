const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const viewsRouter = require('./src/routes/views.router');
const productsRouter = require('./src/routes/products.router');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = create({ extname: '.handlebars' });

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

let productos = [];

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.emit('updateProducts', productos);

    socket.on('newProduct', (data) => {
        const { title, price } = data;
        if (
            !title || price == null ||
            typeof title !== 'string' ||
            typeof price !== 'number' || isNaN(price)
        ) return;

        productos.push({ title, price });
        io.emit('updateProducts', productos);
    });

    socket.on('deleteProduct', (title) => {
        productos = productos.filter(p => p.title !== title);
        io.emit('updateProducts', productos);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});