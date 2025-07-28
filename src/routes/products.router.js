const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsPath = path.join(__dirname, '../data/products.json');

function getAllProducts() {
    if (!fs.existsSync(productsPath)) return [];
    const data = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(data);
}

function saveProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

function validateProduct(req, res, next) {
    const { title, price } = req.body;

    if (!title || price == null) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: title o price' });
    }

    if (typeof title !== 'string') {
        return res.status(400).json({ error: 'El campo "title" debe ser un string' });
    }

    if (typeof price !== 'number' || isNaN(price)) {
        return res.status(400).json({ error: 'El campo "price" debe ser un número' });
    }

    const allowedFields = ['title', 'price'];
    const extraFields = Object.keys(req.body).filter(k => !allowedFields.includes(k));
    if (extraFields.length > 0) {
        return res.status(400).json({ error: `Campos no permitidos: ${extraFields.join(', ')}` });
    }

    next();
}

router.get('/', (req, res) => {
    const products = getAllProducts();
    res.json(products);
});

router.post('/', validateProduct, (req, res) => {
    const products = getAllProducts();
    products.push(req.body);
    saveProducts(products);
    res.status(201).json({ message: 'Producto creado' });
});

router.delete('/:title', (req, res) => {
    let products = getAllProducts();
    const { title } = req.params;
    products = products.filter(p => p.title !== title);
    saveProducts(products);
    res.json({ message: 'Producto eliminado' });
});

module.exports = router;

