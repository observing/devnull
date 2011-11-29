# dev/null because logging should be really fast

Current build status: [![BuildStatus](https://secure.travis-ci.org/observing/devnull.png)](http://travis-ci.org/observing/devnull)

### Introduction

**devnull** is an feature rich logging library for Node.js. It was designed from the ground up to assist you during development and be powerful in production. It works just like the regular `console.log` statements you have in code, it uses the same formatter for logging to the terminal and has the same API. It's basically a cherry on the top :).

### Namespacing

The module automatically adds intelligent namespaces to all your log calls so you can easily track back those log statements in your code without having to remember where you placed them.

### Evented

The logger is build on top of the EventEmitter prototype. This allows you to handle all critical log messages in one central location. You might want to be notified when you application starts emitting critical errors. I know I would.

### Multiple transports

It supports different logging transports. You might want to log to the terminal in production but to MongoDB in production so you have a centralized location of all your logs. Each logger can have multiple transports.

## Installation

The module is tested against Node.js 0.4 and 0.6 and can be installed using the Node.js Package Manager, also known as NPM.

```
npm install devnull
```

If you don't have NPM installed on your system you can get it at [http://npmjs.org](http://npmjs.org)

## API

#### Initializing your logger

You can either initialize the default logger:

```
var Logger = require('devnull')
  , logger = new Logger

logger.log('hello world')
logger.info('pew pew')
logger.error('oh noes, something goes terribly wrong')
```

Or configure a customized instance using the options argument:

```
var Logger = require('devnull')
  , logger = new Logger({ timestamp: false })

logger.log('hello world')
...
```

The following options are available for configuring your customized instance:

- **env** either development of production. Default is based on the isAtty check of the process.stdout.

- **level** Only log statements that are less than this level will be logged. This allows you to filter out debug and log statements in production for example. Default is 8.

- **notification** At what log level should we start emitting events? Default is 1.

- **timestamp** Should we prepend a timestamp to the log message? Logging is always done asynchronously so it might be that log messages do not appear in order. A timestamp helps you identify the order of the logs. Default is true.

- **pattern** The pattern for the timestamp. Everybody prefers it's own pattern. The pattern is based around the great [140bytes date entry](https://gist.github.com/1005948) but also allows functions to be called directly. Default is the util.log format that Node.js adopted.

- **base** Should the logger be configured with the base transport (log to process.stdout)? Default is true.

#### #configure(env, fn)

Configure the module for different environments, it follows the same API as Express.js.

**arguments**
_env_ (string) environment
_fn_ (function) callback

**example**

```
var Logger = require('devnull')
  , logger = new Logger

// runs always
logger.configure(function () {
  logger.log('running on the things')
})

// only runs in production
logger.configure('production', function () {
  logger.log('running in production')
})

logger.configure('development', function () {
  logger.log('running in development')
})
```

#### #use(Transport, options)

Adds another transport to the logger. We currently ship 2 different transports inside the module (stream and mongodb).