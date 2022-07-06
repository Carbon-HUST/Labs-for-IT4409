const BaseController = require('../framework').BaseController;
const Author = require('../models/Author');
const CustomError = require('../framework').CustomError;

class AuthorController extends BaseController {
    async getAll() {
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const authors = await Author.where().all();

        const count = authors.length;
        const totalPage = Math.floor(count / limit) + ((count % limit == 0) ? 0 : 1);
        if (page > totalPage) page = 1;
        const skip = (page - 1) * limit;

        const returnedAuthors = authors.slice(skip, skip + limit);
        return this.ok({
            page,
            pageSize: limit,
            authors: returnedAuthors,
            totalPage
        });
    }

    async get() {
        const authorId = this.params.authorId;
        if (!authorId || authorId < 0) {
            throw new CustomError.BadRequestError("Author id is invalid");
        }

        const author = await Author.where({ id: authorId }).first();
        if (author == null) {
            throw new CustomError.NotFoundError("Author not found");
        }

        return this.ok(author);
    }

    async create() {
        const authorName = this.body.name;

        const result = await Author.create({ name: authorName });
        if (result.success) {
            return this.created({ insertedId: result.insertedId });
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }

    async update() {
        const authorName = this.body.name;
        const authorId = this.body.authorId;

        if (!authorId) {
            throw new CustomError.BadRequestError("Author's id is missing");
        }
        const result = await Author.update({ id: authorId }, { name: authorName });
        if (result.success) {
            return this.noContent();
        } else if (typeof (result.errors) === "string") {
            throw new CustomError.NotFoundError("Author not found");
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }

    async delete() {
        const authorId = this.params.authorId;
        if (!authorId) {
            return new CustomError.BadRequestError("Author's id is missing");
        }

        const result = await Author.delete({ id: authorId });
        if (result.success) {
            return this.noContent();
        } else if (typeof (result.errors) === "string") {
            throw new CustomError.NotFoundError("Author not found");
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }
}

module.exports = AuthorController;