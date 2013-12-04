
/**
 * Module dependencies.
 */
var pns = require('pack-n-stack');
var express = require('express');
var connect = require('connect');

/**
 * Expose the stack
 */
module.exports = exports = function(config) {
  if (!config) config = {};

  // Create an express/pack-n-stack app
  var pack = pns(express());

  /**
   * Stack
   */
  pack
    // Pre-router stack
    .use('/favicon.ico', require('empty-favicon')())
    .use('', 'responseTime', express.responseTime())
    .use(require('connect-base')(config.base))
    .use(require('connect-metric')((config.metric||{}).context, (config.metric||{}).options))
    .use(express.methodOverride())
    .use(express.json())
    .use(express.urlencoded())
    .use(require('./lib/request-logger')())
    .use(express.compress())

    // Router
    .use(pack.router)

    // Post-router stack
    .use(require('./lib/error-logger')());

  /**
   * Configuration
   */
  pack
    .configure(function() {
      pack.locals.pretty = true;
      // Remove it for security
      pack.set('x-powered-by', false);
    })
    .configure('production', function() {
      pack.locals.pretty = false;
    })
    .configure('development', function() {
      // Log our requests
      pack.useBefore('base', express.logger('dev'));
    });

  return pack;
};

/**
 * Expose connect.middleware as obj.*
 */
exports.middleware = function(obj) {
  for (var key in connect.middleware) {
    Object.defineProperty(
        obj
      , key
      , Object.getOwnPropertyDescriptor(connect.middleware, key));
  }
};
exports.middleware(exports.middleware);
