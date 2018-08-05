'use strict';

const response = require('../../shared/response');
const shotstack = require('./lib/shotstack');

module.exports.submit = (event, context, callback) => {
    const data = JSON.parse(event.body);

    shotstack.submit(data).then((res) => {
        console.log('Success');
        callback(null, response.format(201, 'success', 'OK', res));
    }).catch(function(res) {
        console.log('Fail: ', res);
        callback(null, response.format(400, 'fail', 'Bad Request', res));
    });
};

module.exports.status = (event, context, callback) => {
    const id = event.pathParameters.id;

    shotstack.status(id).then((res) => {
        console.log('Success');
        callback(null, response.format(201, 'success', 'OK', res));
    }).catch(function(res) {
        console.log('Fail: ', res);
        callback(null, response.format(400, 'fail', 'Bad Request', res));
    });
};
