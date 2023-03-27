"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.Inject = exports.Service = void 0;
require("reflect-metadata");
const di_1 = require("@finwo/di");
// Re-export the DI methods we're using
var di_2 = require("@finwo/di");
Object.defineProperty(exports, "Service", { enumerable: true, get: function () { return di_2.Service; } });
Object.defineProperty(exports, "Inject", { enumerable: true, get: function () { return di_2.Inject; } });
__exportStar(require("./decorators"), exports);
// Actually attach the routes we define to a router
function plugin(router, controllers, done) {
    for (const controller of controllers) {
        // Sanity check
        if (!Reflect.hasMetadata('controller:routes', controller)) {
            throw new Error('Given controller is not configured to be a controller! Please use the @Controller() decorator to configure it.');
        }
        // Fetch controller config
        const routeKeys = Reflect.getMetadata('controller:routes', controller);
        const prefix = Reflect.getMetadata('controller:prefix', controller) || '';
        // Register each of the controller's routes
        for (const routeKey of routeKeys) {
            // Minimal config
            const routeOpts = {
                method: Reflect.getMetadata('route:method', controller, routeKey),
                url: prefix + Reflect.getMetadata('route:path', controller, routeKey),
                handler: (req, res) => {
                    // Maps params according to our param decorators
                    const paramTypes = Reflect.getMetadata('design:paramtypes', controller, routeKey) || [];
                    const instance = di_1.Container.get(controller);
                    return instance[routeKey](...(paramTypes.map((paramType) => {
                        switch (paramType) {
                            case 'req': return req;
                            case 'res': return res;
                            default: return undefined;
                        }
                    })));
                },
            };
            // Optional version
            if (Reflect.hasMetadata('route:version', controller, routeKey)) {
                routeOpts.constraints = routeOpts.constraints || {};
                routeOpts.constraints.version = Reflect.getMetadata('route:version', controller, routeKey);
            }
            // Register express-style middleware method filter
            // Reverse, because we're modding the handler
            const middleware = [
                Reflect.getMetadata('controller:middleware', controller) || [],
                Reflect.getMetadata('route:middleware', controller, routeKey) || [],
            ].flat().reverse();
            for (const mw of middleware) {
                const previousHandler = routeOpts.handler;
                routeOpts.handler = (...args) => __awaiter(this, void 0, void 0, function* () {
                    return yield new Promise((resolve, reject) => {
                        mw(args[0], args[1], (err) => {
                            if (err)
                                return reject(err);
                            // @ts-ignore This is valid, copied arguments from original
                            resolve(previousHandler(...args));
                        });
                    });
                });
            }
            // The actual registration
            router.route(routeOpts);
        }
    }
    done();
}
exports.plugin = plugin;
exports.default = plugin;
//# sourceMappingURL=index.js.map