/**
 * Module dependencies
 */

module.exports = function() {
  return function errorLogger(err, req, res, next) {
    // Default to a 500
    err.status = err.status || 500;

    // If it's a server error, print it
    (err.status > 499 ? console.error : console.warn)(err.stack || err);

    // Tie the error to the request id
    if (req.metric) req.metric.count('error_response.' + err.status);

    // Pass it on to the app specific error handler
    next(err);
  }
};
