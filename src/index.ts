import 'reflect-metadata';
import { Container } from '@finwo/di';
import { FastifyInstance, RouteOptions, FastifyRequest, FastifyReply } from 'fastify';

// Re-export the DI methods we're using
export { Service, Inject } from '@finwo/di';
export { FastifyReply as Response, FastifyRequest as Request };
export * from './decorators';

// Actually attach the routes we define to a router
// TODO: define required router structure
export function attach(controllers: Function[], router: FastifyInstance) {
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
        url     : (prefix + '/' + Reflect.getMetadata('route:path', controller, routeKey)).replace(/\/+/g, '/'),
        handler : async (req: FastifyRequest, res: FastifyReply) => {
          // Maps params according to our param decorators
          const paramTypes: (string|symbol)[] = Reflect.getMetadata('design:paramtypes', controller, routeKey) || [];
          console.log({ paramTypes });
          const instance = Container.get(controller);
          await instance[routeKey](...(paramTypes.map((paramType) => {
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
        routeOpts.version = Reflect.getMetadata('route:version', controller, routeKey);
      }

      // Register middleware
      const middleware = [
        ...(Reflect.getMetadata('controller:middleware', controller) || []),
        ...(Reflect.getMetadata('route:middleware', controller, routeKey) || []),
      ];

      console.log({ middleware });

      // The actual registration
      router.route(routeOpts);
    }
  }
}

