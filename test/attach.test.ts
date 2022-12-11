import 'reflect-metadata';

import tap = require('tap');
import Fastify from 'fastify';
import { plugin as routerPlugin, Middleware, Controller, Get, Post, Delete, Head, Version, Res, Response } from '../src';

const routeCalls: string[]      = [];
const middlewareCalls: string[] = [];

const mw = (name: string) => (req: any, res: any, cb: Function) => {
  middlewareCalls.push(name);
  cb();
};



@Controller()
class TestController {

  @Get('/idx')
  @Middleware(mw('a'))
  @Middleware([mw('b'),mw('c')])
  @Middleware(mw('d'))
  getAction(@Res() response: Response) {
    routeCalls.push('getAction');
    response.send({ ok: true });
  }

  @Post('/idx')
  @Version('1.2.0')
  postAction() {
    routeCalls.push('postAction');
    return { ok: true };
  }

  @Get('/other')
  otherAction() {
    routeCalls.push('otherAction');
    return { ok: true };
  }

  @Delete('/destructive')
  @Middleware(mw('e'))
  deleteAction() {
    routeCalls.push('deleteAction');
    return { ok: true };
  }

  @Head('/some')
  someAction() {
    routeCalls.push('someAction');
    return { ok: true };
  }

}

const app = Fastify();
app.register(routerPlugin, [TestController]);
// plugin(app, [TestController], () => undefined);

(async () => {

  const responses = [];

  responses.push(await app.inject({ method: 'GET'   , url: '/idx'                                                 }));
  responses.push(await app.inject({ method: 'POST'  , url: '/idx'                                                 }));
  responses.push(await app.inject({ method: 'POST'  , url: '/idx'        , headers: { 'Accept-Version': '1.x'   } }));
  responses.push(await app.inject({ method: 'POST'  , url: '/idx'        , headers: { 'Accept-Version': '1.1.x' } }));
  responses.push(await app.inject({ method: 'POST'  , url: '/idx'        , headers: { 'Accept-Version': '1.2.x' } }));
  responses.push(await app.inject({ method: 'POST'  , url: '/idx'        , headers: { 'Accept-Version': '1.2.0' } }));
  responses.push(await app.inject({ method: 'POST'  , url: '/idx'        , headers: { 'Accept-Version': '1.3.0' } }));
  responses.push(await app.inject({ method: 'POST'  , url: '/idx'        , headers: { 'Accept-Version': '1.3.x' } }));
  responses.push(await app.inject({ method: 'POST'  , url: '/idx'        , headers: { 'Accept-Version': '2.x'   } }));
  responses.push(await app.inject({ method: 'GET'   , url: '/other'                                               }));
  responses.push(await app.inject({ method: 'DELETE', url: '/destructive'                                         }));
  responses.push(await app.inject({ method: 'HEAD'  , url: '/some'                                                }));

  tap.equal(responses[ 0].statusCode, 200, 'Unversioned get route with middleware can be called');
  tap.equal(responses[ 1].statusCode, 404, 'Versioned post route without middleware can not be called without accept-version header');
  tap.equal(responses[ 2].statusCode, 200, 'Versioned post route without middleware can be called with accept-version header major match');
  tap.equal(responses[ 3].statusCode, 404, 'Versioned post route without middleware can not be called with accept-version header minor lesser');
  tap.equal(responses[ 4].statusCode, 200, 'Versioned post route without middleware can be called with accept-version header minor match');
  tap.equal(responses[ 5].statusCode, 200, 'Versioned post route without middleware can be called with accept-version header exact match');
  tap.equal(responses[ 6].statusCode, 404, 'Versioned post route without middleware can not be called with accept-version header exact minor greater');
  tap.equal(responses[ 7].statusCode, 404, 'Versioned post route without middleware can not be called with accept-version header minor greater');
  tap.equal(responses[ 8].statusCode, 404, 'Versioned post route without middleware can not be called with accept-version header major greater');
  tap.equal(responses[ 9].statusCode, 200, 'Unversioned get route without middleware can be called');
  tap.equal(responses[10].statusCode, 200, 'Unversioned delete route without middleware can be called');
  tap.equal(responses[11].statusCode, 200, 'Unversioned head route without middleware can be called');
  tap.equal(middlewareCalls.join(''), 'abcde', 'Middleware is called in the correct order');
})();
