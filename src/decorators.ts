import 'reflect-metadata';
import { Service } from '@finwo/di';
import { Method } from './enums';

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
export function Route(method: Method, path: string): MethodDecorator {
  return function(constructor: any, propertyKey: string | symbol): void {
    // Register the handler
    const handlers = Reflect.getMetadata('controller:handlers', constructor) || [];
    handlers.push(propertyKey);
    Reflect.defineMetadata('controller:handlers', handlers, constructor);
    // Register the minimum route config
    Reflect.defineMetadata('route:method', method, constructor, propertyKey);
    Reflect.defineMetadata('route:path'  , path  , constructor, propertyKey);
    Reflect.defineMetadata('route:middleware', Reflect.getMetadata('controller:middleware', constructor) || [], constructor);
  };
}

// Register middleware
export function Middleware(handlers: Function | Function[]): ClassDecorator | MethodDecorator {
  return function(constructor: Function, propertyKey?: string | symbol): void {
    if (!Array.isArray(handlers)) handlers = [handlers];
    const name       = propertyKey ? 'route' : 'controller';
    const middleware = (
      propertyKey
        ? Reflect.getMetadata(`${name}:middleware`, constructor, propertyKey)
        : Reflect.getMetadata(`${name}:middleware`, constructor)
    ) || [];
    middleware.push(...(handlers.filter(m => m)));
    propertyKey
      ? Reflect.defineMetadata(`${name}:middleware`, middleware, constructor, propertyKey)
      : Reflect.defineMetadata(`${name}:middleware`, middleware, constructor)
    ;
  };
}

// Mark the route as being a specific version
export function Version(version: string): MethodDecorator {
  return function(constructor: any, propertyKey: string | symbol): void {
    Reflect.defineMetadata('route:version', version, constructor, propertyKey);
  };
}

// Mark a handler parameter as wanting the request there
export function Req(): ParameterDecorator {
  return function(target: any, key: string | symbol, index: number) {
    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target, key) || [];
    paramTypes[index] = 'req';
    Reflect.defineMetadata('design:paramtypes', paramTypes, target, key);
  };
}

export function Res(): ParameterDecorator {
  return function(target: any, key: string | symbol, index: number) {
    const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target, key) || [];
    paramTypes[index] = 'res';
    Reflect.defineMetadata('design:paramtypes', paramTypes, target, key);
  };
}

// Method shorthand
export function Delete(path: string): MethodDecorator {
  return Route(Method.DELETE, path);
}

// Method shorthand
export function Get(path: string): MethodDecorator {
  return Route(Method.GET, path);
}

// Method shorthand
export function Head(path: string): MethodDecorator {
  return Route(Method.HEAD, path);
}

// Method shorthand
export function Patch(path: string): MethodDecorator {
  return Route(Method.HEAD, path);
}

// Method shorthand
export function Post(path: string): MethodDecorator {
  return Route(Method.POST, path);
}

// Method shorthand
export function Put(path: string): MethodDecorator {
  return Route(Method.PUT, path);
}

// Method shorthand
export function Options(path: string): MethodDecorator {
  return Route(Method.OPTIONS, path);
}
