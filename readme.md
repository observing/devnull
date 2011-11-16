# dev/null (because logging to /dev/null is really fast!)

**devnull** is an advanced logging module for Node.js it was designed from the
ground up to assist you during development and powerful in production. It works
just like the console.log statements, it uses the same formatter, everything.
This is basically a cherry on top :).

#### namespacing

It automatically adds intelligent name spacing to all your log calls so you can easily
spot where the log messages are coming from, without having to remember all the
locations of your log statements.

#### evented

The logger is build upon the EventEmitter prototype so you can listen when
certain events are fired. You might want to send an e-mail out for every
critical log message you receive. I know I would.

#### customizable

It comes with a ton of options, that could customize. Or not. It's up to you.

### Installation

```
npm install devnull
```

### API

#### initializing

```js
var Logger = require('devnull')
  , logger = new Logger;
```

This initializes the default logger. You can configure the logger by passing in
a options object.

```js
var Logger = require('devnull')
  , logger = new Logger({ timestamp: false });
```

The available options:

 - `env` either development or production, default is based on isatty.
 - `level` log level, defaults to 8.
 - `notification` when do start emitting notification errors, defaults to 1.
 - `timestamp` do the logs needs to stamped, defaults to true.
 - `pattern` pattern for the time stamp, defaults to node's util log format.

The timestamp pattern is based on the [140bytes
gist](https://gist.github.com/1005948) but it also allows execution of functions
like `{Fullyear} - {toLocaleTimeString}`

#### methods

The logger ships with these methods by default.

- alert
- critical
- error
- warning
- metric
- notice
- info
- log
- debug

```js
logger.critical('omg the server is on fire',  { obj: 'works like console.log' });
```
