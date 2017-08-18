'use strict';

const os = require('os');
const Transport = require('winston').Transport;

class ConsoleLogger extends Transport {
  constructor(options = {}) {
    super(options);

    this.maxPropertyLevel = options.maxPropertyLevel || 2;
    this.streams = options.streams || {
      stdout: process.stdout,
      stderr: process.stderr
    };
  }

  serializeProperties(obj, propertyLevel = 1, detectedErrors = null) {
    if (propertyLevel > this.maxPropertyLevel) {
      return '';
    }

    return Object.keys(obj)
      .map(key => {
        const metaProperty = obj[key];

        if (metaProperty === null || metaProperty === undefined) {
          return `${key}=${metaProperty}`;
        }

        switch (typeof metaProperty) {
          case 'object':
            if (detectedErrors &&
              (metaProperty instanceof Error || toString.call(metaProperty) === '[object Error]') &&
              (metaProperty.stack || metaProperty.message)) {
              detectedErrors.push({ propertyLevel, key, errorObject: metaProperty });
              return null;
            }
            return this.serializeProperties(metaProperty, propertyLevel + 1, detectedErrors);
          default:
            return `${key}=${metaProperty}`;
        }
      })
      .filter(property => property !== null)
      .join(', ');
  }

  serializeError(error) {
    if (error.propertyLevel > this.maxPropertyLevel) {
      return '';
    }

    let errorEventText = `${error.key}=${error.errorObject.stack || error.errorObject.message}`;
    const errorPropertiesText = Object.keys(error.errorObject)
      .map(key => {
        const metaProperty = error.errorObject[key];

        switch (typeof metaProperty) {
          case 'object':
            return this.serializeProperties(metaProperty, error.propertyLevel + 1);
          default:
            return `${key}=${metaProperty}`;
        }
      })
      .filter(property => property !== null && property !== '')
      .join(', ');

    if (errorPropertiesText) {
      errorEventText += `, ${os.EOL}${errorPropertiesText}`;
    }

    return errorEventText;
  }

  log(level, msg, meta, callback) {
    const detectedErrors = [];
    let logEventText = `${level}: ${msg ? `${msg} ` : ''}`;
    const propertyText = this.serializeProperties(meta || {}, 1, detectedErrors);
    if (propertyText) {
      logEventText += propertyText;
    }
    if (detectedErrors.length > 0) {
      if (propertyText) {
        logEventText += ', ';
      }

      logEventText += `${
        detectedErrors
          .map(error => this.serializeError(error))
          .join(', ')
      }`;
    }
    logEventText += os.EOL;

    if (level === 'error') {
      this.streams.stderr.write(logEventText);
    } else {
      this.streams.stdout.write(logEventText);
    }

    this.emit('logged');
    callback(null, true);
  }
}

module.exports = ConsoleLogger;
