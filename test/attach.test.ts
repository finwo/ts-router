import 'reflect-metadata';

import tap = require('tap');
import { RouteOptions } from 'fastify';
import { attach, Middleware, Controller, Get, Post, Version } from '../src';

const mockedRouteCalls: RouteOptions[] = [];
const mockedUseCalls: any[][] = [];
const mockedMiddlewareCalls: string[] = [];
const mockRouter = {
  route(routeOptions: RouteOptions) {
    mockedRouteCalls.push(routeOptions);
  },
  use(...args: any[]) {
    mockedUseCalls.push(args);
  },
};

const mw = (name: string) => (req: any, res: any, cb: Function) => {
  mockedMiddlewareCalls.push(name);
};

@Controller()
class TestController {

  @Get('/getAction')
  @Middleware(mw('a'))
  @Middleware([mw('b'),mw('c')])
  @Middleware(mw('d'))
  getAction() {
    // Intentionally empty
  }

  @Post('/postAction')
  @Version('1.2.0')
  postAction() {
    // Intentionally empty
  }

  @Get('/other')
  @Middleware(mw('e'))
  otherAction() {
    // Intentionally empty
  }

}

// @ts-ignore Mock implementation
attach([TestController], mockRouter);

// Basics
tap.equal(mockedRouteCalls.length, 3, 'Registers 3 route as configured');
tap.equal(mockedUseCalls.length, 5, 'Registers 5 middlewares as configured');

// Registration order
tap.equal(mockedRouteCalls[0].method, 'GET' , 'First route registered is a GET, as written in controller');
tap.equal(mockedRouteCalls[1].method, 'POST', 'Second route registered is a POST, as written in controller');
tap.equal(mockedRouteCalls[2].method, 'GET' , 'Thrid route registered is a GET, as written in controller');

// Middleware registration order
// Wrapped, so need to provide method for the filter
for(const used of mockedUseCalls) {
  used[1]({ method: 'GET' });
}
tap.equal(mockedMiddlewareCalls.join(''), 'abcde', 'Middleware is registered in order of notation');

// Middleware registration paths
tap.equal(mockedRouteCalls[0].url, mockedUseCalls[0][0], '1st middleware is attached to 1st route');
tap.equal(mockedRouteCalls[0].url, mockedUseCalls[1][0], '2nd middleware is attached to 1st route');
tap.equal(mockedRouteCalls[0].url, mockedUseCalls[2][0], '3rd middleware is attached to 1st route');
tap.equal(mockedRouteCalls[0].url, mockedUseCalls[3][0], '4th middleware is attached to 1st route');
tap.equal(mockedRouteCalls[2].url, mockedUseCalls[4][0], '5th middleware is attached to 3rd route');
