@finwo/router
=============

[![license][license:img]][license:url]
[![npm version][npm:@finwo/router:img]][npm:@finwo/router:url]

@finwo/router is a TypeScript decorator wrapper with pluggable routers, intended
to make setting up a new api cleaner.

## Installation

This package can not be used stand-alone and will need an adapter to hand off
the controllers' routes to the actual router.

To start using @finwo/router, install the required packages via NPM:

```sh
npm install --save @finwo/router
```

This package makes use of decorators and decorator metadata using the
[reflect-metadata][npm:reflect-metadata:url] package, which in turn means this
package is not compatible with TS &gt; 5.

Don't forget to enable emitting decorator metadata in your TypeScript config.
Add these two lines to your `tsconfig.json` file under the `compilerOptions`
key:

```json
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

## Usage

Basic usage is as follows:

```ts
// some-controller.ts
import { Request, Response } from 'router-library';
import { Controller, Req, Res, Get } from '@finwo/router';

@Controller()
export class SomeController {

  @Get()
  @Middleware(require('cors')())
  indexAction(@Res() res: Response) {
    res.send({
      ok: true,
    });
  }

  @Get('/other')
  otherAction(@Res() res: Response) {
    res.send({
      ok: true,
    });
  }
}
```

Any controllers will be registered within the DI container of
[@finwo/di][npm:@finwo/di:url], allowing you to implement dependency injection
into your controllers to decouple from your dependencies.

## Middleware

Express-style middleware can be registered, but may not be supported by all
adapters.

[license:img]: https://img.shields.io/github/license/finwo/router
[license:url]: https://github.com/finwo/router/blob/main/LICENSE
[npm:@finwo/di:url]: https://npmjs.com/package/@finwo/di
[npm:@finwo/router:url]: https://npmjs.com/package/@finwo/router
[npm:@finwo/router:img]: https://img.shields.io/npm/v/@finwo/router
[npm:fastify:url]: https://npmjs.com/package/fastify
[npm:reflect-metadata:url]: https://npmjs.com/package/reflect-metadata
