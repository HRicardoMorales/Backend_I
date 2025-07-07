const ProductManager = require('./ProductManager');
const productManager = new ProductManager();

class CartManager {
    constructor(filename = 'carts.json') {
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

    async createCart() {
        const carts = await this.#readFile();
        const newId = (carts.length > 0 ? carts[carts.length - 1].id + 1 : 1);
        const newCart = { id: newId, products: [] };
        carts.push(newCart);
        await this.#writeFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.#readFile();
        return carts.find(c => c.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.#readFile();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;

        const product = await productManager.getProductById(productId);
        if (!product) throw new Error('Producto no existe');

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.#writeFile(carts);
        return cart;
    }
}

module.exports = CartManager;
