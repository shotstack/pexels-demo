'use strict';

/**
 * Format the response body
 *
 * @param {String} status
 * @param {String} message
 * @param {Object} data
 *
 * @returns {{status: *, message: *, data: *}}
 */
module.exports.getBody = (status, message, data) => {
    return {
        status: status,
        message: message,
        data: data
    }
};

/**
 * API Standard response format (JSend - https://labs.omniti.com/labs/jsend)
 *
 * @param {Number} code
 * @param {String} status
 * @param {String} message
 * @param {Object} data
 * @returns {{statusCode: *, headers: {Access-Control-Allow-Origin: string}, body}}
 */
module.exports.format = (code, status, message, data) => {
    return {
        statusCode: parseInt(code),
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify(this.getBody(status, message, data))
    };
};
