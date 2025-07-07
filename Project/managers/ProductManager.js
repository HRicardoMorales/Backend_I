const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filename = 'products.json') {
        this.filePath = path.join(__dirname, filename);
    }

    async #readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async #writeFile(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async getProducts() {
        return await this.#readFile();
    }

    async getProductById(id) {
        const products = await this.#readFile();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
        for (const field of requiredFields) {
            if (!(field in product)) {
                throw new Error(`Falta el campo obligatorio: ${field}`);
            }
        }

        const products = await this.#readFile();
        const newId = (products.length > 0 ? products[products.length - 1].id + 1 : 1);
        const newProduct = { id: newId, ...product };
        products.push(newProduct);
        await this.#writeFile(products);
        return newProduct;
    }

    async updateProduct(id, update) {
        const products = await this.#readFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;
        delete update.id; // No se puede modificar el id
        products[index] = { ...products[index], ...update };
        await this.#writeFile(products);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.#readFile();
        const filtered = products.filter(p => p.id !== id);
        await this.#writeFile(filtered);
        return products.length !== filtered.length;
    }
}

module.exports = ProductManager;