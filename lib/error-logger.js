/**
 * Module dependencies
 */

module.exports = function() {
  return function errorLogger(err, req, res, next) {
    // Default to a 500
    err.code = err.code || 500;

    // If it's a server error, print it
    (err.code > 499 ? console.error : console.warn)(err.stack || err);

    // Tie the error to the request id
    var metricObj = {code: err.code};
    if (err.timeout) metricObj.timeout = true;
    if (req.metric) req.metric("error_response", 1, "response", metricObj);

    // Pass it on to the app specific error handler
    next(err);
  }
};
