const express = require('express');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const router = express.Router();

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, cid } = req.query;

        const filter = {};
        if (query) {
            const [key, value] = String(query).split(':');
            if (key && value !== undefined) {
                if (key === 'status') filter.status = value === 'true';
                else if (key === 'category') filter.category = value;
                else filter.title = { $regex: query, $options: 'i' };
            }
        }

        let sortOption = {};
        if (sort === 'asc') sortOption.price = 1;
        if (sort === 'desc') sortOption.price = -1;

        const options = { page: Number(page), limit: Number(limit), sort: Object.keys(sortOption).length ? sortOption : undefined, lean: true };
        const result = await Product.paginate(filter, options);

        const base = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        const keep = (p) =>
            `${base}?page=${p}&limit=${options.limit}` +
            (sort ? `&sort=${sort}` : '') +
            (query ? `&query=${encodeURIComponent(query)}` : '') +
            (cid ? `&cid=${cid}` : '');

        res.render('products', {
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? keep(result.prevPage) : null,
            nextLink: result.hasNextPage ? keep(result.nextPage) : null,
            cid: cid || ''
        });
    } catch (err) {
        res.status(500).send('Error cargando productos: ' + err.message);
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).send('Producto no encontrado');
        const { cid } = req.query;
        res.render('productDetail', { product, cid: cid || '' });
    } catch {
        res.status(400).send('ID inválido');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).send('Carrito no encontrado');

        const items = (cart.products || []).map(p => ({
            _id: p.product?._id,
            title: p.product?.title,
            price: p.product?.price ?? 0,
            quantity: p.quantity,
            subtotal: (p.product?.price ?? 0) * p.quantity
        }));
        const total = items.reduce((acc, it) => acc + it.subtotal, 0);

        res.render('cart', { cid: cart._id.toString(), items, total });
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

module.exports = router;
