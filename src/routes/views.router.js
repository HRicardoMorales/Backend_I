const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products.json');

function getAllProducts() {
    if (!fs.existsSync(productsPath)) return [];
    const data = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(data);
}

router.get('/home', (req, res) => {
    const products = getAllProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;
