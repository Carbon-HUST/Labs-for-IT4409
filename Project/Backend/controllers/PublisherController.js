const BaseController = require('../framework').BaseController;
const Publisher = require('../models/publisher');
const CustomError = require('../framework').CustomError;

class PublisherController extends BaseController {
    async getAll() {
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const publishers = await Publisher.getAll();

        const count = publishers.length;
        const totalPage = Math.floor(count / limit) + ((count % limit == 0) ? 0 : 1);
        if (page > totalPage) page = 1;
        const skip = (page - 1) * limit;

        const returnPublishers = publishers.slice(skip, skip + limit);
        return this.ok({
            page,
            pageSize: limit,
            publishers: returnPublishers,
            totalPage
        });
    }

    async get() {
        const publisherId = this.params.publisherId;
        if (!publisherId ||publisherId < 0) {
            throw new CustomError.BadRequestError("Publisher id is invalid");
        }

        const publisher = await Publisher.findById(publisherId);
        if (publisher == null) {
            throw new CustomError.NotFoundError("publisher not found");
        }

        return this.ok(publisher);
    }

    async create() {
        const publisherName = this.body.name;
        if (!publisherName) {
            throw new CustomError.BadRequestError("publisher's name is missing");
        }

        const insertedId = await Publisher.create(publisherName);
        if (insertedId) {
            return this.created({ insertedId });
        }

        throw new Error("Something went wrong! Please try again!");
    }

    async update() {
        const publisherName = this.body.name;
        const publisherId = this.body.publisherId;

        if (!publisherId || !publisherName) {
            throw new CustomError.BadRequestError("publisher's name or id is missing");
        }

        if ((await Publisher.findById(publisherId)) == null) {
            throw new CustomError.BadRequestError("publisher not found");
        }

        if (await Publisher.update(publisherId, publisherName)) {
            return this.noContent();
        }

        throw new Error("Something went wrong! Please try again!");
    }

    async delete() {
        const publisherId = this.params.publisherId;
        if (!publisherId) {
            return new CustomError.BadRequestError("publisher's name is missing");
        }

        if ((await Publisher.findById(publisherId)) == null) {
            throw new CustomError.BadRequestError("publisher not found");
        }

        if (await Publisher.delete(publisherId)) {
            return this.noContent();
        }

        throw new Error("Something went wrong! Please try again!");
    }
}

module.exports = PublisherController;