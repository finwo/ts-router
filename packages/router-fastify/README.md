@finwo/router-fastify
=====================

[![license][license:img]][license:url]
[![npm version][npm:@finwo/router-fastify:img]][npm:@finwo/router-fastify:url]

@finwo/router-fastify is a [fastify][npm:fastify:url] adapter for the
[@finwo/router][npm:@finwo/router:url] router decorators.

## Installation

To start using @finwo/router-fastify, install the required packages via NPM:

```sh
npm install --save @finwo/router @finwo/router-fastify
```

## Usage

To use this adapter to load your controllers into fastify, add the following to
the initialization of your fastify instance.

```ts
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

For further usage, check out the [@finwo/router][npm:@finwo/router:url] readme.

## Middleware

This adapter **does** support middleware, by chaining the middleware before the
actual route handler.

[license:img]: https://img.shields.io/github/license/finwo/router
[license:url]: https://github.com/finwo/router/blob/main/LICENSE
[npm:@finwo/router-fastify:url]: https://npmjs.com/package/@finwo/router-fastify
[npm:@finwo/router-fastify:img]: https://img.shields.io/npm/v/@finwo/router-fastify
[npm:fastify:url]: https://npmjs.com/package/fastify
[npm:reflect-metadata:url]: https://npmjs.com/package/reflect-metadata
[npm:@finwo/router:url]: https://npmjs.com/package/@finwo/router
