import 'reflect-metadata';
import { HTTPMethod } from 'find-my-way';
export declare function Controller(prefix?: string): ClassDecorator;
export declare function Route(method: HTTPMethod, path: string): MethodDecorator;
export declare function Middleware(mw: Function | Function[]): MethodDecorator;
export declare function Version(version: string): MethodDecorator;
export declare function Req(): ParameterDecorator;
export declare function Res(): ParameterDecorator;
export declare function Delete(path?: string): MethodDecorator;
export declare function Get(path?: string): MethodDecorator;
export declare function Head(path?: string): MethodDecorator;
export declare function Patch(path?: string): MethodDecorator;
export declare function Post(path?: string): MethodDecorator;
export declare function Put(path?: string): MethodDecorator;
export declare function Options(path?: string): MethodDecorator;
//# sourceMappingURL=decorators.d.ts.map