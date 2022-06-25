const BaseController = require('../framework').BaseController;
const Author = require('../models/Author');
const CustomError = require('../framework').CustomError;

class AuthorController extends BaseController {
    async getAll() {
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const authors = await Author.getAll();

        const count = authors.length;
        const totalPage = count / limit + ((count % limit == 0) ? 0 : 1);
        if (page > totalPage) page = 1;
        const skip = (page - 1) * limit;

        const returnAuthors = authors.slice(skip, skip + limit);
        return this.ok(returnAuthors);
    }

    async get() {
        const authorId = this.params.authorId;
        if (!authorId ||authorId < 0) {
            return new CustomError.BadRequestError("Author id is invalid");
        }

        const author = await Author.findById(id);
        if (author == null) {
            return new CustomError.NotFoundError("Author not found");
        }

        return this.ok(author);
    }

    async create() {
        const authorName = this.body.name;
        if (!authorName) {
            return new CustomError.BadRequestError("Author's name is missing");
        }

        if (await Author.create(authorName)) {
            return this.created({});
        }

        throw new Error("Something went wrong! Please try again!");
    }

    async update() {
        const authorName = this.body.name;
        const authorId = this.body.id;

        if (!authorId || !authorName) {
            return new CustomError.BadRequestError("Author's name or id is missing");
        }

        if (await Author.update(authorId, authorName)) {
            return this.noContent();
        }

        throw new Error("Something went wrong! Please try again!");
    }

    async delete() {
        const authorId = this.params.authorId;
        if (!authorId) {
            return new CustomError.BadRequestError("Author's name is missing");
        }

        if (await Author.delete(authorId)) {
            return this.noContent();
        }

        throw new Error("Something went wrong! Please try again!");
    }
}

module.exports = AuthorController;