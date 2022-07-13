const BaseController = require('../framework').BaseController;
const Publisher = require('../models/Publisher');
const CustomError = require('../framework').CustomError;

class PublisherController extends BaseController {
    async getAll() {
        let page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const publishers = await Publisher.where().all();

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
        if (!publisherId) {
            throw new CustomError.BadRequestError("Publisher id is missing");
        }

        const publisher = await Publisher.findById(publisherId);
        if (publisher == null) {
            throw new CustomError.NotFoundError("Publisher not found");
        }

        return this.ok(publisher);
    }

    async create() {
        const result = await Publisher.create({ name: this.body.name });
        if (result.success) {
            return this.created({ insertedId: result.insertedId });
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }

    async update() {
        const publisherName = this.body.name;
        const publisherId = this.body.publisherId;

        if (!publisherId) {
            throw new CustomError.BadRequestError("publisher's id is missing");
        }

        if (!publisherName) {
            return this.noContent();
        }

        const result = await Publisher.update({ id: publisherId }, { name: publisherName });
        if (result.success) {
            return this.noContent();
        } else if (typeof (result.errors) === "string") {
            throw new CustomError.NotFoundError("Publisher not found");
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }

    async delete() {
        const publisherId = this.params.publisherId;
        if (!publisherId) {
            return new CustomError.BadRequestError("Publisher's id is missing");
        }

        const result = await Publisher.delete({ id: publisherId });
        if (result.success) {
            return this.noContent();
        } else if (typeof (result.errors) === "string") {
            throw new CustomError.NotFoundError("Publisher not found");
        } else {
            throw new CustomError.BadRequestError(result.errors);
        }
    }
}

module.exports = PublisherController;