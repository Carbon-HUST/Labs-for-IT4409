const {match} = require('path-to-regexp');

class Router {
    constructor() {
        this.routes = {
            "GET": {},
            "POST": {},
            "PUT": {},
            "PATCH": {},
            "DELETE": {},
        };
    }

    // add a path associated with method GET, and its resolve (controller, action) and local middlewares
    get(path, resolve, middlewares=[]) {
        if (!this.routes["GET"][path]) {
            this.routes["GET"][path] = {
                middlewares,
                resolve
            };
        }
    }

    post(path, resolve, middlewares=[]) {
        if (!this.routes["POST"][path]) {
            this.routes["POST"][path] = {
                middlewares,
                resolve
            };
        }
    }

    put(path, resolve, middlewares=[]) {
        if (!this.routes["PUT"][path]) {
            this.routes["PUT"][path] = {
                middlewares,
                resolve
            };
        }
    }

    delete(path, resolve, middlewares=[]) {
        if (!this.routes["DELETE"][path]) {
            this.routes["DELETE"][path] = {
                middlewares,
                resolve
            };
        }
    }

    resolve(method, path) {
        // get all paths associated with method
        const routes = this.routes[method];

        // compare requested path to each path in routes
        for (let routePath in routes) {
            const matcher = match(routePath, { decode: decodeURIComponent});
            let result = matcher(path);

            if (result) { // if matched
                const route = routes[routePath];
                const resolve = route.resolve.split('#');
                return {
                    controller: resolve[0],
                    action: resolve[1],
                    params: result.params,
                    middlewares: route.middlewares
                }
            }
        }
        return null;
    }
}

// only one Router instance created among application --> singleton
module.exports = new Router();