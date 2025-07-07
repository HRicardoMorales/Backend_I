const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

router.get('/', async (req, res, next) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (err) {
        next(err);
    }
});

router.get('/:pid', async (req, res, next) => {
    try {
        const product = await productManager.getProductById(parseInt(req.params.pid));
        product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:pid', async (req, res, next) => {
    try {
        const updated = await productManager.updateProduct(parseInt(req.params.pid), req.body);
        updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
    } catch (err) {
        next(err);
    }
});

router.delete('/:pid', async (req, res, next) => {
    try {
        const deleted = await productManager.deleteProduct(parseInt(req.params.pid));
        deleted ? res.json({ mensaje: 'Producto eliminado' }) : res.status(404).json({ error: 'Producto no encontrado' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;