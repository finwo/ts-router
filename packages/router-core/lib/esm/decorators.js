import 'reflect-metadata';
import { Service } from '@finwo/di';
// Just mark a class as a router
export function Controller(prefix) {
    return function (constructor) {
        Service()(constructor);
        Reflect.defineMetadata('controller:prefix', prefix || '', constructor);
        Reflect.defineMetadata('controller:routes', Reflect.getMetadata('controller:routes', constructor) || [], constructor);
        Reflect.defineMetadata('controller:middleware', Reflect.getMetadata('controller:middleware', constructor) || [], constructor);
    };
}
// Registers the controller's handler on the constructor
// Registers the method+path on the handler
export function Route(method, path) {
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
// For now, only supports middleware on routes, not controllers
// export function Middleware(mw: Function | Function[]): MethodDecorator {
export function Middleware(mw) {
    return function (target, propertyKey) {
        if (!Array.isArray(mw))
            mw = [mw].filter(e => e);
        const constructor = target.constructor;
        const wares = Reflect.getMetadata('route:middleware', constructor, propertyKey) || [];
        Reflect.defineMetadata('route:middleware', [mw, wares].flat(), constructor, propertyKey);
    };
}
// Mark the route as being a specific version
export function Version(version) {
    return function (target, propertyKey) {
        const constructor = target.constructor;
        Reflect.defineMetadata('route:version', version, constructor, propertyKey);
    };
}
// Mark a handler parameter as wanting the request there
export function Req() {
    return function (target, key, index) {
        const constructor = target.constructor;
        const paramTypes = Reflect.getMetadata('design:paramtypes', constructor, key) || [];
        paramTypes[index] = 'req';
        Reflect.defineMetadata('design:paramtypes', paramTypes, constructor, key);
    };
}
export function Res() {
    return function (target, key, index) {
        const constructor = target.constructor;
        const paramTypes = Reflect.getMetadata('design:paramtypes', constructor, key) || [];
        paramTypes[index] = 'res';
        Reflect.defineMetadata('design:paramtypes', paramTypes, constructor, key);
    };
}
// Method shorthand
export function Delete(path = '/') {
    return Route('DELETE', path);
}
// Method shorthand
export function Get(path = '/') {
    return Route('GET', path);
}
// Method shorthand
export function Head(path = '/') {
    return Route('HEAD', path);
}
// Method shorthand
export function Patch(path = '/') {
    return Route('PATCH', path);
}
// Method shorthand
export function Post(path = '/') {
    return Route('POST', path);
}
// Method shorthand
export function Put(path = '/') {
    return Route('PUT', path);
}
// Method shorthand
export function Options(path = '/') {
    return Route('OPTIONS', path);
}
//# sourceMappingURL=decorators.js.map