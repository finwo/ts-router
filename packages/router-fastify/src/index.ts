import { _register, RouteOpts } from '@finwo/router';
import { FastifyInstance, RouteOptions } from 'fastify';

export function plugin(router: FastifyInstance, controllers: Function[], done: Function) {
  _register(controllers, (opts: RouteOpts) => {
    opts = Object.assign({}, opts);

    // Modify handler to emulate express-style middleware
    const middleware = [ ...(opts.middleware || []) ].reverse();
    delete opts.middleware;
    for(const mw of middleware) {
      const previousHandler = opts.handler;
      opts.handler = (...args: unknown[]) => {
        return new Promise((resolve, reject) => {
          mw(args[0], args[1], (err?: Error) => {
            if (err) return reject(err);
            // @ts-ignore Passing along gotten arguments as-is, no typing available
            resolve(previousHandler(...args));
          });
        });
      };
    }

    // And pass the route over to fastify
    router.route({
      ...(opts as Record<string, unknown>),
      url: opts.path,
    } as RouteOptions);

  });

  done();
}

export default plugin;
