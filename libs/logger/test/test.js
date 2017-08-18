const test = require("tape");
const Logger = require("../index");

test('test logging', function (t) {
  process.env.NODE_ENV = 'production';
  const testTags = ['Miranda', 'Caliban'];
  const logger = Logger.create(process.env.LOGSENE_TOKEN || 'unit testing token thing', testTags);
  const testLevels = ['debug', 'info', 'warn', 'error'];
  const testMessage = 'Logger Module Test - ';

  for (var testLevel of testLevels) {
    let msg = `${testMessage} ${testLevel}`;
    logger[testLevel](msg, { metadata: {"level": testLevel}, tags: [testLevel] }, (err, level, message, meta) => {
      t.equal(err, null, 'err should be null');
      t.equal(level, testLevel, `Log level should be "${testLevel}"`);
      t.equal(message, msg, 'Message should match');
      if (testLevel !== 'debug') t.equal(meta.tags.length, 3, 'There should be 3 tags');
      console.log(meta)
    });
  }

  t.end();
});
