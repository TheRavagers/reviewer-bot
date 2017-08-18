'use strict';


// just added 
module.exports.errorHandler = (error, req, res, next) => {
  // If there's no error, then proceed to the next middleware
  if (!error) return next();

  // If the error has no status, assume 500
  error.status = !error.status ? 500 : error.status;

  if (error.status === 500) {
    // Log the error if the microservice failed
    req.log.error(error.message || 'Fatal error', { errorDetails: error });

    // Prepare the response body
    const responseBody = {
      status: 500,
      message: error.message
    };

    // Send the response
    res.status(500).send(responseBody);
  } else {
    // Prepare the response body
    const responseBody = {
      status: error.status,
      message: error.message,
      result: error.result
    };

    // Send the response
    res.status(error.status).send(responseBody);
  }
};
