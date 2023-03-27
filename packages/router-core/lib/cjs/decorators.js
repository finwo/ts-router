"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = exports.Put = exports.Post = exports.Patch = exports.Head = exports.Get = exports.Delete = exports.Res = exports.Req = exports.Version = exports.Middleware = exports.Route = exports.Controller = void 0;
require("reflect-metadata");
const di_1 = require("@finwo/di");
// Just mark a class as a router
function Controller(prefix) {
    return function (constructor) {
        (0, di_1.Service)()(constructor);
        Reflect.defineMetadata('controller:prefix', prefix || '', constructor);
        Reflect.defineMetadata('controller:routes', Reflect.getMetadata('controller:routes', constructor) || [], constructor);
        Reflect.defineMetadata('controller:middleware', Reflect.getMetadata('controller:middleware', constructor) || [], constructor);
    };
}
exports.Controller = Controller;
// Registers the controller's handler on the constructor
// Registers the method+path on the handler
function Route(method, path) {
    return function (target, propertyKey) {
        const constructor = target.constructor;
        // Register the handler
        const handlers = Reflect.getMetadata('controller:routes', constructor) || [];
        handlers.push(propertyKey);
        Reflect.defineMetadata('controller:routes', handlers, constructor);
        // Register the minimum route config
        Reflect.defineMetadata('route:method', method, constructor, propertyKey);
        Reflect.defineMetadata('route:path', path, constructor, propertyKey);
        Reflect.defineMetadata('route:middleware', Reflect.getMetadata('route:middleware', constructor, propertyKey) || [], constructor, propertyKey);
    };
}
exports.Route = Route;
// For now, only supports middleware on routes, not controllers
// export function Middleware(mw: Function | Function[]): MethodDecorator {
function Middleware(mw) {
    return function (target, propertyKey) {
        if (!Array.isArray(mw))
            mw = [mw].filter(e => e);
        const constructor = target.constructor;
        const wares = Reflect.getMetadata('route:middleware', constructor, propertyKey) || [];
        Reflect.defineMetadata('route:middleware', [mw, wares].flat(), constructor, propertyKey);
    };
}
exports.Middleware = Middleware;
// Mark the route as being a specific version
function Version(version) {
    return function (target, propertyKey) {
        const constructor = target.constructor;
        Reflect.defineMetadata('route:version', version, constructor, propertyKey);
    };
}
exports.Version = Version;
// Mark a handler parameter as wanting the request there
function Req() {
    return function (target, key, index) {
        const constructor = target.constructor;
        const paramTypes = Reflect.getMetadata('design:paramtypes', constructor, key) || [];
        paramTypes[index] = 'req';
        Reflect.defineMetadata('design:paramtypes', paramTypes, constructor, key);
    };
}
exports.Req = Req;
function Res() {
    return function (target, key, index) {
        const constructor = target.constructor;
        const paramTypes = Reflect.getMetadata('design:paramtypes', constructor, key) || [];
        paramTypes[index] = 'res';
        Reflect.defineMetadata('design:paramtypes', paramTypes, constructor, key);
    };
}
exports.Res = Res;
// Method shorthand
function Delete(path = '/') {
    return Route('DELETE', path);
}
exports.Delete = Delete;
// Method shorthand
function Get(path = '/') {
    return Route('GET', path);
}
exports.Get = Get;
// Method shorthand
function Head(path = '/') {
    return Route('HEAD', path);
}
exports.Head = Head;
// Method shorthand
function Patch(path = '/') {
    return Route('PATCH', path);
}
exports.Patch = Patch;
// Method shorthand
function Post(path = '/') {
    return Route('POST', path);
}
exports.Post = Post;
// Method shorthand
function Put(path = '/') {
    return Route('PUT', path);
}
exports.Put = Put;
// Method shorthand
function Options(path = '/') {
    return Route('OPTIONS', path);
}
exports.Options = Options;
//# sourceMappingURL=decorators.js.map