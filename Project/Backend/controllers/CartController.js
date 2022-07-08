const Cart = require('../models/Cart');
const Book = require('../models/Book');
const CartItem = require('../models/CartItem');
const BaseController = require('../framework/BaseController');
const CustomError = require('../framework').CustomError;

class CartController extends BaseController {
    async addProduct() {
        const customerId = this.body.id;
        const productId = this.params.id;
        const quantity = parseInt(this.query.quantity) || 1;
        console.log(typeof(quantity));
        if(!customerId)
            throw new CustomError.BadRequestError("Cant access cart");

        if(quantity < 0)
            throw CustomError.BadRequestError("Invalid quantity");
        
        const cart = await Cart.select(["id"]).where({customer_id: customerId}).first();
        if(!cart)
            throw new CustomError.BadRequestError("Can not access cart");
        const cartId = cart['id'];

        let book = await Book.where({id: productId}).first();
        if(!book)
            throw new CustomError.NotFoundError("Book not found");
            
        const prodcheck = await CartItem.where({cart_id: cartId, book_id: productId}).all();
        if(prodcheck.length !== 0)
            throw new CustomError.BadRequestError("Product is already in cart");

        let stock = book['stock'];
        if(stock < quantity)
            throw new CustomError.BadRequestError("Out of stock");
        
        try {
            const addItemResult = await CartItem.create({cart_id: cartId, book_id: productId, quantity: quantity});
            book['stock'] -= quantity;
            const stockUpdateResult = await book.update();
            if(addItemResult.success && stockUpdateResult.success)
                return this.ok("Added to cart");
            else
                throw Error([addItemResult.errors, stockUpdateResult.errors]);
        } catch(err) {
            throw err;
        }
    }

    async getProductInCart() {
        const customerId = this.body.id;
        let page = this.query.page || 1;
        const limit = this.query.limit || 10;

        if(!customerId)
            throw new CustomError.BadRequestError("Can't access cart");
        
        const cart = await Cart.select(["id"]).where({customer_id: customerId}).first();
        if(!cart)
            throw new CustomError.BadRequestError("Can not access cart");
        const cartId = cart['id'];
        
        let cartItems = await CartItem.where({cart_id: cartId}).all();
        if(cartItems.length === 0)
            throw new CustomError.NotFoundError("Cart empty");
        
        const totalPage = Math.floor(cartItems.length / limit) + ((cartItems.length % limit == 0) ? 0 : 1);
        if(page <= 0 || page > totalPage) page = 1;
        let offset = (page - 1) * limit;
        
        cartItems = cartItems.slice(offset, offset + limit);

        let condition = [];
        cartItems.forEach(element => {
            condition.push(element['book_id']);
        });
        

        let products = await Book.select(['id', 'title', 'thumbnail', 'price']).where({id: {
            operator: 'IN',
            value: condition
        }}).all();

        let result = [];


        if(products.length === 0)
            throw Error('Can not get products');

        let total = 0;
        for(let i = 0; i < products.length; i++) {
            result.push({
                book_id: products[i]['id'],
                title: products[i]['title'],
                thumbnail: products[i]['thumbnail'],
                price: products[i]['price'],
                quantity: cartItems[i]['quantity']
            })
            total += products[i]['price'] * cartItems[i]['quantity'];
        }

        return this.ok({
            page,
            pageSize: limit,
            totalPage,
            result,
            total
        });
    }

    async removeProduct() {
        const productId = this.params.id;
        const customerId = this.body.id;
        
        if(!customerId)
            throw new CustomError.BadRequestError("Can't access cart");
        
        const cart = await Cart.select(["id"]).where({customer_id: customerId}).first();
        if(!cart)
            throw new CustomError.BadRequestError("Can not access cart");
        const cartId = cart['id'];

        const item = await CartItem.where({cart_id: cartId, book_id: productId}).first();
        if(!item)
            throw new CustomError.NotFoundError("Can not access product");
        
        const book = await Book.findById(productId);
        if(!book)
            throw new CustomError.NotFoundError("Can not access book");
        
        let itemId = item['id'];
        book['stock'] += item['quantity'];
        
        try {
            const deleteResult = await CartItem.delete({cart_id: cartId, book_id: productId});
            const updateStock = await book.update();

            if(deleteResult.success && updateStock.success)
                return this.ok("Removed");
            else 
                throw Error([deleteResult.errors, updateStock.errors]);
        } catch (error) {
            throw error;
        }
    }

    async changeProductQuantity() {
        const productId = this.params.id;
        const customerId = this.body.id;

        if(!this.query.quantity)
            return this.noContent();

        if(!customerId)
            throw new CustomError.BadRequestError("Can't access cart");
        
        const cart = await Cart.select(["id"]).where({customer_id: customerId}).first();
        if(!cart)
            throw new CustomError.BadRequestError("Can not access cart");
        const cartId = cart['id'];

        let item = await CartItem.where({cart_id: cartId, book_id: productId}).first();
        if(!item)
            throw new CustomError.NotFoundError("Can not access product");
        
        let book = await Book.where({id: productId}).first();
        if(!book)
            throw new CustomError.NotFoundError("Cant access book");
        

        if(book['stock'] - (this.query.quantity - item['quantity']) < 0)
            throw new CustomError.BadRequestError("Out of stock"); 

        if(this.query.quantity <= 0)
            throw new CustomError.BadRequestError("Invalid Quantity");

        book['stock'] -= this.query.quantity - item['quantity']; 
        item['quantity'] = parseInt(this.query.quantity);

        try {
            const itemUpdateResult = await item.update();
            const stockUpdateResult = await book.update();
            if(itemUpdateResult.success && stockUpdateResult.success)
                return this.noContent();
            else 
                throw Error([itemUpdateResult.errors, stockUpdateResult.errors]);
        } catch (err) {
            throw err;
        }
    }


}

module.exports = CartController;