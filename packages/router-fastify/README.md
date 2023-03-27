@finwo/router
=============

[![license][license:img]][license:url]
[![npm version][npm:@finwo/router:img]][npm:@finwo/router:url]

@finwo/router is a TypeScript decorator wrapper for
[fastify][npm:fastify:url], intended to make setting up a new
api cleaner.

## Installation

To start using @finwo/router, install the required packages via NPM:

```sh
npm install --save @finwo/router
```

Import the [reflect-metadata][npm:reflect-metadata:url]
package (included as peer dependency) at the **first line** of your application:

```ts
import 'reflect-metadata';

// Your other imports and initialization code
// comes here AFTER you imported the reflect-metadata package
```

As a last step, you need to enable emitting decorator metadata in your
TypeScript config. Add these two lines to your `tsconfig.json` file under the
`compilerOptions` key:

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

Now you are ready to use @finwo/router with your project!

## Usage

Basic usage is as follows:

```ts
// some-controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, Req, Res, Get, Version } from '@finwo/router';

@Controller()
export class SomeController {

  @Get()
  @Middleware(require('cors')())
  indexAction(@Res() res: FastifyReply) {
    res.send({
      ok: true,
    });
  }

  @Get('/versioned')
  @Version('1.2.0')
  versionedAction(@Res() res: FastifyReply) {
    res.send({
      ok: true,
      versioned: true,
    });
  }
}

// index.ts
import fastify = require('fastify')();
import { plugin } from '@finwo/router';

// Build a list of controllers we'll start our application with
// Classes registered as controller will NOT be included by default
import { SomeController } from './some-controller';
const controllers: any[] = [
  SomeController,
];

// Register your controllers' routes
fastify.register(plugin, controllers);
```

Any controllers will be registered within the DI container of
[@finwo/di][npm:@finwo/di:url], allowing you to implement dependency injection
into your controllers to decouple from your dependencies.

## Middleware

Express-style middleware is supported, but is implemented by wrapping the route
handler instead of fastify's `use` method.

## Versioned routes

While versioned routes are supported, they are subject to cache poisoning
attacks. To prevent such attacks, please configure this hook when using
versioned routes:

See
https://github.com/fastify/fastify/blob/HEAD/docs/Reference/Routes.md#version-constraints
for more information.

```ts
const append = require('vary').append
fastify.addHook('onSend', (req, reply, payload, done) => {
  if (req.headers['accept-version']) { // or the custom header you are using
    let value = reply.getHeader('Vary') || ''
    const header = Array.isArray(value) ? value.join(', ') : String(value)
    if ((value = append(header, 'Accept-Version'))) { // or the custom header you are using
      reply.header('Vary', value)
    }
  }
 done()
})
```

[license:img]: https://img.shields.io/github/license/finwo/router
[license:url]: https://github.com/finwo/router/blob/main/LICENSE
[npm:@finwo/di:url]: https://npmjs.com/package/@finwo/di
[npm:@finwo/router:url]: https://npmjs.com/package/@finwo/router
[npm:@finwo/router:img]: https://img.shields.io/npm/v/@finwo/router
[npm:fastify:url]: https://npmjs.com/package/fastify
[npm:reflect-metadata:url]: https://npmjs.com/package/reflect-metadata
