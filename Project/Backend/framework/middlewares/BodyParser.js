const { StringDecoder } = require('string_decoder');
const form = require('../config/FormidableConfig');
const { BadRequestError, UnsupportedMediaTypeError } = require('../errors');

const BodyParser = (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (!contentType) {
        next();
    }
    else if (contentType === "application/json") {
        const decoder = new StringDecoder('utf-8');
        let payload = '';
        if (!req.controller.params) {
            req.controller.params = {};
        }

        req.on('data', (data) => {
            payload += decoder.write(data);
        });

        req.on('end', () => {
            payload += decoder.end();
            req.controller.body = {...req.controller.body, ...JSON.parse(payload)}
            next();
        });
    }
    else if (contentType.startsWith("multipart/form-data")) {
        const files = [];
        if (!req.controller.files)
            req.controller.files = {};

        form
            .on('file', (filename, file) => {
                files.push({filename, file});
            })
            .on('end', () => {
                req.controller.files = files;
                next();
            });

        form.parse(req, (err, fields, files) => {
            if (err) {
                throw new BadRequestError(err);
            }
        });

    }
    else {
        throw new UnsupportedMediaTypeError("Content type unsupported");
    }
}

module.exports = BodyParser;