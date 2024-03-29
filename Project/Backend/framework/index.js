const Framework = require('./Framework');
const Router = require('./Router');
const BaseController = require('./BaseController');
const fs = require('fs');
const CustomError = require('./errors');
const BaseModel = require('./BaseModel');
const ModelHelpers = require('./ModelHelpers');

function createApplication(routePath = "routes/", controllersPath = "controllers/") {
    fs.readdirSync(routePath).forEach((file) => {
        require(`../${routePath}${file}`);
    });

    return new Framework(Router, controllersPath);
}

exports = module.exports = createApplication;
exports.Router = Router;
exports.BaseController = BaseController;
exports.CustomError = CustomError;
exports.BaseModel = BaseModel;
exports.ModelHelpers = ModelHelpers;