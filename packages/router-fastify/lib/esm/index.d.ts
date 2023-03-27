import 'reflect-metadata';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
export { Service, Inject } from '@finwo/di';
export { FastifyReply as Response, FastifyRequest as Request };
export * from './decorators';
export declare function plugin(router: FastifyInstance, controllers: Function[], done: Function): void;
export default plugin;
//# sourceMappingURL=index.d.ts.map