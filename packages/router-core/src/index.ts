import 'reflect-metadata';
import { HTTPMethod } from './http-methods';

import { Container } from '@finwo/di';

export { HTTPMethod };
export type NextFn    = () => void;
export type HandlerFn = (req: unknown, res: unknown, next: NextFn) => void | Promise<void>;

export type RouteOpts = {
  method     : HTTPMethod;
  path       : string;
  middleware?: HandlerFn[],
  handler    : HandlerFn
};

export type AddRouteFn = (opts: RouteOpts) => void | Promise<void>;

// Our main function, called by the adapter
export async function _register(controllers: Function[], addRoute: AddRouteFn) {
  for (const controller of controllers) {

    // Sanity check
    if (!Reflect.hasMetadata('controller:routes', controller)) {
      throw new Error('Given controller is not configured to be a controller! Please use the @Controller() decorator to configure it.');
    }

    // Fetch controller config
    const routeKeys = Reflect.getMetadata('controller:routes', controller);
    const prefix    = Reflect.getMetadata('controller:prefix', controller) || '';

    // Register each of the controller's routes
    for(const routeKey of routeKeys) {

      // Minimal config
      const routeOpts: RouteOpts =  {
        method    : Reflect.getMetadata('route:method', controller, routeKey),
        path      : prefix + Reflect.getMetadata('route:path', controller, routeKey),
        middleware: [
          Reflect.getMetadata('controller:middleware', controller) || [],
          Reflect.getMetadata('route:middleware', controller, routeKey) || [],
        ].flat(),
        handler   : (req: unknown, res: unknown, _next: NextFn) => {
          // Maps params according to our param decorators
          const paramTypes: (string|symbol)[] = Reflect.getMetadata('design:paramtypes', controller, routeKey) || [];
          const instance = Container.get(controller);
          return instance[routeKey](...(paramTypes.map((paramType) => {
            switch(paramType) {
              case 'req': return req;
              case 'res': return res;
              default: return undefined;
            }
          })));
        },
      };

      // And hand the route off to the adapter
      await addRoute(routeOpts);
    }
  }
}
