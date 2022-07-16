const BaseController = require('../framework').BaseController;
const Genre = require('../models/Genre');
const CustomError = require('../framework').CustomError;

class GenreController extends BaseController {
    async getAll() {
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const genres = await Genre.where().all();

        const count = genres.length;
        const totalPage = Math.floor(count / limit) + ((count % limit == 0) ? 0 : 1);
        if (page > totalPage) page = 1;
        const skip = (page - 1) * limit;

        const returnGenres = genres.slice(skip, skip + limit);
        return this.ok({
            page,
            pageSize: limit,
            results: returnGenres,
            totalPage
        });
    }

    async get() {
        const genreId = this.params.genreId;
        if (!genreId) {
            throw new CustomError.BadRequestError("Genre id is invalid");
        }

        const genre = await Genre.findById(genreId);
        if (genre == null) {
            throw new CustomError.NotFoundError("Genre not found");
        }

        return this.ok({ result: genre });
    }

    async create() {
        const result = await Genre.create({ name: this.body.name });
        if (result.success) {
            return this.created({ insertedId: result.insertedId });
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }

    async update() {
        const genreName = this.body.name;
        const genreId = this.body.genreId;

        if (!genreId) {
            throw new CustomError.BadRequestError("Genre's id is missing");
        }

        const result = await Genre.update({ id: genreId }, { name: genreName });
        if (result.success) {
            return this.noContent();
        } else if (typeof (result.errors) === "string") {
            throw new CustomError.NotFoundError("Genre not found");
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }

    async delete() {
        const genreId = this.params.genreId;
        if (!genreId) {
            throw new CustomError.BadRequestError("Genre's name is missing");
        }

        const result = await Genre.delete({ id: genreId });
        if (result.success) {
            return this.noContent();
        } else if (typeof (result.errors) === "string") {
            throw new CustomError.NotFoundError("Genre not found");
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }
}

module.exports = GenreController;