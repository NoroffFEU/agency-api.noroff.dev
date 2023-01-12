/**
 * Returns a new Error, with a json message containing desired status code and message
 * @param {Number} status status code of error
 * @param {String} message specific error
 * @returns {Error} new Error
 */
export const createThrownError = function (status, message) {
  return new Error(JSON.stringify({ status, message }));
};
