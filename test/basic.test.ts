import 'reflect-metadata';

import tap = require('tap');
import { Container } from '@finwo/di';
import { Controller, Route, Version, Get, Post } from '../src';

tap.equal(typeof Controller, 'function', 'Controller is exported as a function');
tap.equal(typeof Controller(), 'function', 'Controller returns a function');

tap.equal(typeof Route, 'function', 'Route is exported as a function');
tap.equal(typeof Route('GET',''), 'function', 'Route returns a function');

tap.equal(typeof Version, 'function', 'Version is exported as a function');
tap.equal(typeof Version(''), 'function', 'Version returns a function');

tap.equal(typeof Get, 'function', 'Get is exported as a function');
tap.equal(typeof Get(''), 'function', 'Get returns a function');


tap.equal(typeof Route, 'function', 'Route is exported as a function');

@Controller('prefix')
class TestEmptyController {}

@Controller('test')
class TestController {

  @Get('/basic')
  testAction() {
    // intentionally empty
  }

  @Post('/versioned')
  @Version('1.2.0')
  versionedAction() {
    // intentionally empty
  }

}

// Controller initialization
tap.ok(Container.get(TestEmptyController) instanceof TestEmptyController, 'Marking a class as controller registers it with the @finwo/di container');

// Metadata initialization
tap.equal(typeof Reflect.getMetadata('controller:prefix', TestEmptyController), 'string', 'Marking a class as controller defined controller:prefix metadata');
tap.ok(Array.isArray(Reflect.getMetadata('controller:routes', TestEmptyController)), 'Marking a class as controller defined controller:routes metadata');

// Check if routes are properly attached
tap.equal(Reflect.getMetadata('controller:routes', TestController).length, 2, '2 routes were registered on the TestController');
tap.equal(Reflect.getMetadata('controller:routes', TestEmptyController).length, 0, 'No route was registered on the TestEmptyController');

// Check for route specifics

// Check if the registered methods are correct
tap.equal(Reflect.getMetadata('route:method', TestController, 'testAction'     ), 'GET' , 'Get method is registered correctly for a route');
tap.equal(Reflect.getMetadata('route:method', TestController, 'versionedAction'), 'POST', 'Post method is registered correctly for a route');

// Check if the registered paths are correct
tap.equal(Reflect.getMetadata('route:path', TestController, 'testAction'     ), '/basic'    , 'Get path is registered correctly for a route');
tap.equal(Reflect.getMetadata('route:path', TestController, 'versionedAction'), '/versioned', 'Post path is registered correctly for a route');

// Validate route versioning has been registered
tap.notOk(Reflect.hasMetadata('route:version', TestController, 'testAction'     ),          'Unversioned route has no version info metadata');
tap.ok(   Reflect.hasMetadata('route:version', TestController, 'versionedAction'),          'Versioned route has version info metadata');
tap.equal(Reflect.getMetadata('route:version', TestController, 'versionedAction'), '1.2.0', 'Route version is correctly registered in metadata');
