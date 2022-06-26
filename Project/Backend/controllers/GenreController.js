const BaseController = require('../framework').BaseController;
const Genre = require('../models/Genre');
const CustomError = require('../framework').CustomError;

class GenreController extends BaseController {
    async getAll() {
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const genres = await Genre.getAll();

        const count = genres.length;
        const totalPage = Math.floor(count / limit) + ((count % limit == 0) ? 0 : 1);
        if (page > totalPage) page = 1;
        const skip = (page - 1) * limit;

        const returnGenres = genres.slice(skip, skip + limit);
        return this.ok({
            page,
            pageSize: limit,
            genres: returnGenres,
            totalPage
        });
    }

    async get() {
        const genreId = this.params.genreId;
        if (!genreId ||genreId < 0) {
            throw new CustomError.BadRequestError("Genre id is invalid");
        }

        const genre = await Genre.findById(genreId);
        if (genre == null) {
            throw new CustomError.NotFoundError("Genre not found");
        }

        return this.ok(genre);
    }

    async create() {
        const genreName = this.body.name;
        if (!genreName) {
            throw new CustomError.BadRequestError("Genre's name is missing");
        }

        const insertedId = await Genre.create(genreName);
        if (insertedId) {
            return this.created({ insertedId });
        }

        throw new Error("Something went wrong! Please try again!");
    }

    async update() {
        const genreName = this.body.name;
        const genreId = this.body.genreId;

        if (!genreId || !genreName) {
            throw new CustomError.BadRequestError("Genre's name or id is missing");
        }

        if ((await Genre.findById(genreId)) == null) {
            throw new CustomError.BadRequestError("Genre not found");
        }

        if (await Genre.update(genreId, genreName)) {
            return this.noContent();
        }

        throw new Error("Something went wrong! Please try again!");
    }

    async delete() {
        const genreId = this.params.genreId;
        if (!genreId) {
            return new CustomError.BadRequestError("Genre's name is missing");
        }

        if ((await Genre.findById(genreId)) == null) {
            throw new CustomError.BadRequestError("Genre not found");
        }

        if (await Genre.delete(genreId)) {
            return this.noContent();
        }

        throw new Error("Something went wrong! Please try again!");
    }
}

module.exports = GenreController;