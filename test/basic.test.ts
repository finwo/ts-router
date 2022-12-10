import 'reflect-metadata';

import tap = require('tap');
import { Controller, Route } from '../src';

tap.equal(typeof Controller, 'function', 'Controller is exported as a function');
tap.equal(typeof Controller(), 'function', 'Controller returns a function');

tap.equal(typeof Route, 'function', 'Route is exported as a function');
