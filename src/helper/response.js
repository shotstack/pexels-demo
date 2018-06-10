'use strict';

/**
 * API Standard response format (JSend - https://labs.omniti.com/labs/jsend)
 *
 * @param {Number} code
 * @param {Boolean} status
 * @param {String} message
 * @param {Object} data
 * @returns {{statusCode: *, headers: {Access-Control-Allow-Origin: string}, body}}
 */
module.exports = (code, status, message, data) => {
    return {
        statusCode: parseInt(code),
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        body: JSON.stringify({
            status: status,
            message: message,
            data: data
        })
    };
};
