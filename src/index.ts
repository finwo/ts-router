import 'reflect-metadata';
import { Container } from '@finwo/di';
import { FastifyInstance, RouteOptions, FastifyRequest, FastifyReply } from 'fastify';

// Re-export the DI methods we're using
export { Service, Inject } from '@finwo/di';
export { FastifyReply as Response, FastifyRequest as Request };
export * from './decorators';

// Actually attach the routes we define to a router
export function plugin(router: FastifyInstance, controllers: Function[], done: Function) {
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
      const routeOpts: RouteOptions =  {
        method  : Reflect.getMetadata('route:method', controller, routeKey),
        url     : prefix + Reflect.getMetadata('route:path', controller, routeKey),
        handler : (req: FastifyRequest, res: FastifyReply) => {
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
      for(const mw of middleware) {
        const previousHandler = routeOpts.handler;
        routeOpts.handler = async (...args) => {
          return await new Promise((resolve, reject) => {
            mw(args[0], args[1], (err?: Error) => {
              if (err) return reject(err);
              // @ts-ignore This is valid, copied arguments from original
              resolve(previousHandler(...args));
            });
          });
        };
      }

      // The actual registration
      router.route(routeOpts);
    }
  }

  done();
}

export default plugin;
