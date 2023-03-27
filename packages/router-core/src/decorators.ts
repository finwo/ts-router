import 'reflect-metadata';

import { Service } from '@finwo/di';
import { HTTPMethod } from './http-methods';

// Just mark a class as a router
export function Controller(prefix?: string): ClassDecorator {
  return function(constructor: Function): void {
    Service()(constructor);
    Reflect.defineMetadata('controller:prefix', prefix || '', constructor);
    Reflect.defineMetadata('controller:routes', Reflect.getMetadata('controller:routes', constructor) || [], constructor);
    Reflect.defineMetadata('controller:middleware', Reflect.getMetadata('controller:middleware', constructor) || [], constructor);
  };
}

// Registers the controller's handler on the constructor
// Registers the method+path on the handler
export function Route(method: HTTPMethod, path: string): MethodDecorator {
  return function(target: any, propertyKey: string | symbol): void {
    const constructor = target.constructor;
    // Register the handler
    const handlers = Reflect.getMetadata('controller:routes', constructor) || [];
    handlers.push(propertyKey);
    Reflect.defineMetadata('controller:routes', handlers, constructor);
    // Register the minimum route config
    Reflect.defineMetadata('route:method'    , method                                                                 , constructor, propertyKey);
    Reflect.defineMetadata('route:path'      , path                                                                   , constructor, propertyKey);
    Reflect.defineMetadata('route:middleware', Reflect.getMetadata('route:middleware', constructor, propertyKey) || [], constructor, propertyKey);
  };
}

// For now, only supports middleware on routes, not controllers
// Prefixes it due to call order of decorators from factories
// export function Middleware(mw: Function | Function[]): MethodDecorator {
export function Middleware(mw: Function | Function[]): MethodDecorator {
  return function(target: any, propertyKey: string | symbol): void {
    if (!Array.isArray(mw)) mw = [mw].filter(e => e);
    const constructor = target.constructor;
    const wares = Reflect.getMetadata('route:middleware', constructor, propertyKey) || [];
    Reflect.defineMetadata('route:middleware', [mw,wares].flat(), constructor, propertyKey);
  };
}

// Mark a handler parameter as wanting the request there
export function Req(): ParameterDecorator {
  return function(target: any, key: string | symbol, index: number) {
    const constructor = target.constructor;
    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', constructor, key) || [];
    paramTypes[index] = 'req';
    Reflect.defineMetadata('design:paramtypes', paramTypes, constructor, key);
  };
}

export function Res(): ParameterDecorator {
  return function(target: any, key: string | symbol, index: number) {
    const constructor = target.constructor;
    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', constructor, key) || [];
    paramTypes[index] = 'res';
    Reflect.defineMetadata('design:paramtypes', paramTypes, constructor, key);
  };
}

// Method shorthand
export function Delete(path = '/'): MethodDecorator {
  return Route(HTTPMethod.DELETE, path);
}

// Method shorthand
export function Get(path = '/'): MethodDecorator {
  return Route(HTTPMethod.GET, path);
}

// Method shorthand
export function Head(path = '/'): MethodDecorator {
  return Route(HTTPMethod.HEAD, path);
}

// Method shorthand
export function Patch(path = '/'): MethodDecorator {
  return Route(HTTPMethod.PATCH, path);
}

// Method shorthand
export function Post(path = '/'): MethodDecorator {
  return Route(HTTPMethod.POST, path);
}

// Method shorthand
export function Put(path = '/'): MethodDecorator {
  return Route(HTTPMethod.PUT, path);
}

// Method shorthand
export function Options(path = '/'): MethodDecorator {
  return Route(HTTPMethod.OPTIONS, path);
}
