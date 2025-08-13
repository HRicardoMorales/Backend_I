const express = require('express');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const router = express.Router();

router.post('/', async (_req, res) => {
    try {
        const cart = await Cart.create({ products: [] });
        return res.status(201).json({ status: 'success', payload: cart });
    } catch (err) {
        return res.status(500).json({ status: 'error', error: err.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        return res.json({ status: 'success', payload: cart });
    } catch {
        return res.status(400).json({ status: 'error', error: 'ID inválido' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        const exists = await Product.exists({ _id: pid });
        if (!exists) return res.status(404).json({ status: 'error', error: 'Producto no existe' });

        const idx = cart.products.findIndex(p => p.product.toString() === pid);
        if (idx >= 0) cart.products[idx].quantity += 1;
        else cart.products.push({ product: pid, quantity: 1 });

        await cart.save();
        return res.status(201).json({ status: 'success', payload: cart });
    } catch (err) {
        return res.status(400).json({ status: 'error', error: err.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body;
        if (!Array.isArray(products)) {
            return res.status(400).json({ status: 'error', error: 'products debe ser un array' });
        }
        const cart = await Cart.findByIdAndUpdate(req.params.cid, { products }, { new: true, runValidators: true }).lean();
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        return res.json({ status: 'success', payload: cart });
    } catch (err) {
        return res.status(400).json({ status: 'error', error: err.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ status: 'error', error: 'quantity debe ser >= 1' });
        }
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        const idx = cart.products.findIndex(p => p.product.toString() === req.params.pid);
        if (idx === -1) return res.status(404).json({ status: 'error', error: 'Producto no está en el carrito' });

        cart.products[idx].quantity = quantity;
        await cart.save();
        return res.json({ status: 'success', payload: cart });
    } catch (err) {
        return res.status(400).json({ status: 'error', error: err.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();
        return res.json({ status: 'success', payload: cart });
    } catch (err) {
        return res.status(400).json({ status: 'error', error: err.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: [] }, { new: true }).lean();
        if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        return res.json({ status: 'success', payload: cart });
    } catch (err) {
        return res.status(400).json({ status: 'error', error: err.message });
    }
});

module.exports = router;

