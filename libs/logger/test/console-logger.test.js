const test = require("tape");
const ConsoleLogger = require('../console-logger');

test('ConsoleLogger sets its properties', (assert) => {
  const consoleLogger = new ConsoleLogger({
    maxPropertyLevel: 5,
    streams: {}
  });

  assert.equal(consoleLogger.maxPropertyLevel, 5, 'maxPropertyLevel should be 5');
  assert.deepEqual(consoleLogger.streams, {}, 'streams should be an empty object');

  assert.end();
});

test('ConsoleLogger uses default properties', (assert) => {
  const consoleLogger = new ConsoleLogger();

  assert.equal(consoleLogger.maxPropertyLevel, 2, 'maxPropertyLevel should be 2');
  assert.equal(consoleLogger.streams.stderr, process.stderr, 'streams.stderr should be process.stderr');
  assert.equal(consoleLogger.streams.stdout, process.stdout, 'streams.stdout should be process.stdout');

  assert.end();
});

test('ConsoleLogger serializes properties', (assert) => {
  const consoleLogger = new ConsoleLogger({
    maxPropertyLevel: 2
  });

  let output = consoleLogger.serializeProperties({ a: 1, b: 1, c: 1 }, 1);
  assert.equal(output, 'a=1, b=1, c=1', 'all properties are rendered');

  output = consoleLogger.serializeProperties({ a: null }, 1);
  assert.equal(output, 'a=null', 'null objects are rendered');

  output = consoleLogger.serializeProperties({ a: undefined }, 1);
  assert.equal(output, 'a=undefined', 'undefined objects are rendered');

  output = consoleLogger.serializeProperties({ a: { b: null } }, 1);
  assert.equal(output, 'b=null', 'undefined child properties are rendered');

  output = consoleLogger.serializeProperties({ a: { b: 1, c: 1 } }, 1);
  assert.equal(output, 'b=1, c=1', 'object properties are rendered');

  output = consoleLogger.serializeProperties({ a: { b: { c: 1 } } }, 1);
  assert.equal(output, '', 'does not render more levels than specified');

  let detectedErrors = [];
  const stacklessError = new Error('test');
  delete stacklessError.stack;
  output = consoleLogger.serializeProperties({ a: 1, b: new Error('test'), stacklessError }, 1, detectedErrors);
  assert.equal(output, 'a=1', 'renders non error properties');
  assert.equal(detectedErrors.length, 2, 'detects errors');
  assert.equal(detectedErrors[0].key, 'b', 'key is stored for detected errors');
  assert.equal(detectedErrors[0].propertyLevel, 1, 'property level is stored for detected errors');
  assert.ok(detectedErrors[0].errorObject instanceof Error, 'error object is stored for detected errors');

  assert.end();
});

test('ConsoleLogger serializes errors', (assert) => {
  const consoleLogger = new ConsoleLogger({
    maxPropertyLevel: 2
  });
  
  let output = consoleLogger.serializeError({ key: 'err', propertyLevel: 1, errorObject: new Error('test') });
  assert.ok(output.indexOf('Error: test\n') > 0, 'renders the error stack for err');
  
  const stacklessError = new Error('test');
  delete stacklessError.stack;
  output = consoleLogger.serializeError({ key: 'err', propertyLevel: 1, errorObject: stacklessError });
  assert.equal(output, 'err=test', 'renders the error message for err');

  const errorWithProperties = new Error('test');
  errorWithProperties.customProperty = true;
  errorWithProperties.customObjectProperty = { test: true };
  delete errorWithProperties.stack;
  output = consoleLogger.serializeError({ key: 'err', propertyLevel: 1, errorObject: errorWithProperties });
  assert.equal(output, 'err=test, \ncustomProperty=true, test=true', 'renders custom error properties');

  output = consoleLogger.serializeError({ key: 'err', propertyLevel: 3, errorObject: new Error('test') });
  assert.equal(output, '', 'does not render errors past max property level');

  assert.end();
});

test('ConsoleLogger logs events', (assert) => {
  let stdout = null;
  let stderr = null;
  const consoleLogger = new ConsoleLogger({
    streams: {
      stdout: {
        write: (line) => stdout = line
      },
      stderr: {
        write: (line) => stderr = line
      }
    }
  });

  const clear = () => {
    stdout = null;
    stderr = null;
  };

  consoleLogger.log('debug', 'test-message', null, () => {});
  assert.equal(stdout, 'debug: test-message \n', 'renders the log message');
  clear();

  consoleLogger.log('debug', '', null, () => {});
  assert.equal(stdout, 'debug: \n', 'renders empty message');
  clear();

  consoleLogger.log('debug', null, null, () => {});
  assert.equal(stdout, 'debug: \n', 'renders null message');
  clear();

  consoleLogger.log('debug', 'test-message', { test: true }, () => {});
  assert.equal(stdout, 'debug: test-message test=true\n', 'renders the log message and meta properties');
  clear();

  consoleLogger.log('debug', null, { test: true }, () => {});
  assert.equal(stdout, 'debug: test=true\n', 'renders just the meta properties');
  clear();

  const stacklessError = new Error('test');
  delete stacklessError.stack;
  consoleLogger.log('debug', 'error occurred', { err: stacklessError }, () => {});
  assert.equal(stdout, 'debug: error occurred err=test\n', 'renders errors');
  clear();

  consoleLogger.log('debug', 'error occurred', { test: true, err: stacklessError }, () => {});
  assert.equal(stdout, 'debug: error occurred test=true, err=test\n', 'renders errors with properties');
  clear();

  assert.end();
})