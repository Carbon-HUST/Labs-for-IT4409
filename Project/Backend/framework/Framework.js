const http = require('http');
const fs = require('fs');
const BodyParser = require('./middlewares/BodyParser');
const QueryParser = require('./middlewares/QueryParser');
const ErrorHandler = require('./ErrorHandler');

class Framework {
    constructor(router, controllersPath = "controllers/") {
        this._router = router;
        this._controllersPath = controllersPath;

        // framework data
        this._controllers = [];
        this._middlewares = [BodyParser, QueryParser];

        // helpers
        this.logger = {
            info: (msg) => console.log(`INFO - ${msg}`),
            error: (msg) => console.log(`ERROR - ${msg}`),
            debug: (msg) => console.log(`DEBUG - ${msg}`),
            log: (msg) => console.log(msg),
        };
    }

    // PUBLIC METHODS

    async listen(port = 3000, callback) {
        this._controllers = this._autoLoad(this._controllersPath);

        const server = http.createServer(async (req, res) => {
            this.logger.info(`${req.method} - ${req.url}`);
            res.setHeader('Content-Type', 'application/json');
            //req.setEncoding("utf-8");
            req.controller = {
                body: {},
                params: {},
                query: {},
                files: {}
            };
            try {
                // Execute global middlewares, 
                // then determine which controller (and local middlewares) to use
                this._processMiddlewares(req, res, this._middlewares, this._resolveResponse.bind(this));
            } catch (err) {
                ErrorHandler(req, res, null, err);
            }
        });

        if (!callback)
            callback = () => {
                this.logger.info(`Server is running`);
            }

        if (typeof callback !== "function")
            throw new Error("Third argument of listen method must be a function");

        server.listen(port, callback);
    }

    useMiddleware(middleware) {
        this._middlewares.push(middleware);
    }

    // PRIVATE METHODS
    _processMiddlewares(req, res, middlewares, endFunc, err) {
        let index = 0, middleware;
        const handleMiddlewares = () => {
            const next = () => {
                middleware = middlewares[index++];
                if (!middleware) {
                    try {
                        endFunc(req, res, err);
                    } catch (err) {
                        ErrorHandler(req, res, null, err);
                    }
                    return;
                }
                try {
                    middleware(req, res, next, err);
                } catch (err) {
                    ErrorHandler(req, res, null, err);
                }
            }
            // start
            try {
                next();
            } catch (err) {
                ErrorHandler(req, res, null, err);
            }
        }
        handleMiddlewares();
    }

    async _resolveResponse(req, res) {
        if (req.controller.done)
            return;
        const requestTime = new Date().getTime();
        // Get name of controller, action, local middlewares
        const resolveData = req.resolveData = this._router.resolve(req.method, req.controller.path);

        if (resolveData == null) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                msg: "Route does not exist"
            }));
        }
        else {
            this.logger.info(`Request processing ${resolveData.controller}#${resolveData.action}`);
            try {
                // Execute local middlewares,
                // then run controller
                this._processMiddlewares(req, res, resolveData.middlewares, this._evokeController.bind(this));
            } catch (err) {
                throw err;
            }
        }

        let elapsedTime = (new Date().getTime() - requestTime) / 1000.0;
        this.logger.info(`Request finished in ${elapsedTime} seconds`);
    }

    async _evokeController(req, res) {
        const resolveData = req.resolveData;
        const controller = new this._controllers[resolveData.controller]();
        req.controller.params = { ...req.controller.params, ...resolveData.params };
        try {
            await controller.run(resolveData.action, req.controller); // data: params, query, body
            req.controller.done = true;
        } catch (err) {
            ErrorHandler(req, res, null, err);
            return;
        }

        switch (controller._responseData.statusCode) {
            case 301:
                res.writeHead(301, controller._responseData.headers);
                res.end();
                break;

            case 500:
                res.statusCode = 500;
                // res.setHeader('Content-Type', controller._responseData.contentType);
                res.end(JSON.stringify({
                    msg: controller._responseData.data,
                }));
                break;

            default:
                res.statusCode = controller._responseData.statusCode;
                // res.setHeader('Content-Type', controller._responseData.contentType);
                res.end(JSON.stringify(controller._responseData.data));
        }
    }

    _autoLoad(folder) {
        let files = {};
        fs.readdirSync(`./${folder}`).forEach((file) => {
            let _require = require(`../${folder}${file}`);
            files[file.replace('.js', '')] = _require;
        });
        return files;
    }
}

module.exports = Framework;