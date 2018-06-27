'use strict';

const response = require('../../helper/response');
const shotstack = require('./lib/shotstack');

module.exports.submit = (event, context, callback) => {
    const data = JSON.parse(event.body);

    shotstack.submit(data).then((res) => {
        console.log('Success');
        callback(null, response(201, 'success', 'Created', res));
    }).catch(function(res) {
        console.log('Fail: ', res);
        callback(null, response(400, 'fail', 'Bad Request', res));
    });
};
