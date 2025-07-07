const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

router.post('/', async (req, res, next) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    next(err);
  }
});

router.get('/:cid', async (req, res, next) => {
  try {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
  } catch (err) {
    next(err);
  }
});

router.post('/:cid/product/:pid', async (req, res, next) => {
  try {
    const cart = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;