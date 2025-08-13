const express = require('express');
const Product = require('../models/product.model');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = {};
        if (query) {
            const [key, value] = String(query).split(':');
            if (key && value !== undefined) {
                if (key === 'status') filter.status = value === 'true';
                else if (key === 'category') filter.category = value;
                else filter.title = { $regex: query, $options: 'i' };
            } else {
                filter.title = { $regex: query, $options: 'i' };
            }
        }

        let sortOption = {};
        if (sort === 'asc') sortOption.price = 1;
        if (sort === 'desc') sortOption.price = -1;

        const options = {
            page: Number(page),
            limit: Number(limit),
            sort: Object.keys(sortOption).length ? sortOption : undefined,
            lean: true
        };

        const result = await Product.paginate(filter, options);

        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        const link = (p) =>
            `${baseUrl}?page=${p}&limit=${options.limit}` +
            (sort ? `&sort=${sort}` : '') +
            (query ? `&query=${encodeURIComponent(query)}` : '');

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? link(result.prevPage) : null,
            nextLink: result.hasNextPage ? link(result.nextPage) : null
        });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const p = await Product.findById(req.params.pid).lean();
        if (!p) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        res.json({ status: 'success', payload: p });
    } catch {
        res.status(400).json({ status: 'error', error: 'ID inválido' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !code || price == null) {
            return res.status(400).json({ status: 'error', error: 'title, code y price son obligatorios' });
        }
        const created = await Product.create({ title, description, code, price, status, stock, category, thumbnails });
        res.status(201).json({ status: 'success', payload: created });
    } catch (err) {
        res.status(400).json({ status: 'error', error: err.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true }).lean();
        if (!updated) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        res.json({ status: 'success', payload: updated });
    } catch {
        res.status(400).json({ status: 'error', error: 'ID inválido' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const del = await Product.findByIdAndDelete(req.params.pid).lean();
        if (!del) return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
        res.json({ status: 'success', payload: del });
    } catch {
        res.status(400).json({ status: 'error', error: 'ID inválido' });
    }
});

module.exports = router;

