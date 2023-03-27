@finwo/router-fastify
=====================

[![license][license:img]][license:url]
[![npm version][npm:@finwo/router-fastify:img]][npm:@finwo/router-fastify:url]

@finwo/router-fastify is a TypeScript decorator wrapper for
[fastify][npm:fastify:url], intended to make setting up a new
api cleaner.

## Installation

To start using @finwo/router-fastify, install the required packages via NPM:

```sh
npm install --save @finwo/router @finwo/router-fastify
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

Now you are ready to use @finwo/router-fastify with your project!

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
import { plugin } from '@finwo/router-fastify';

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

Versioned routes are not supported. If you want so, version your routes based on
their path.

[license:img]: https://img.shields.io/github/license/finwo/router
[license:url]: https://github.com/finwo/router/blob/main/LICENSE
[npm:@finwo/di:url]: https://npmjs.com/package/@finwo/di
[npm:@finwo/router-fastify:url]: https://npmjs.com/package/@finwo/router-fastify
[npm:@finwo/router-fastify:img]: https://img.shields.io/npm/v/@finwo/router-fastify
[npm:fastify:url]: https://npmjs.com/package/fastify
[npm:reflect-metadata:url]: https://npmjs.com/package/reflect-metadata
