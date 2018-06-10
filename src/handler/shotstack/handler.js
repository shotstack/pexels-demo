'use strict';

const response = require('../../helper/response');
    /*shotstack = require('./lib/shotstack'),*/
    /*api = new APIGateway({ region: process.env.SLS_REGION });*/

module.exports.submit = (event, context, callback) => {
    //const data = JSON.parse(event.body);
    //const apiKey = event.headers['x-api-key'];

    //render.queue(data, key[0].id).then((res) => {
        console.log('Success');
        callback(null, response(201, 'success', 'Created', ''));
    //}).catch(function(res) {
        //console.log('Fail: ', res);
        //callback(null, response(400, false, 'Bad Request', res));
    //});
};
