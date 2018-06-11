'use strict';

const PexelsAPI = require('pexels-api-wrapper');
const pexelsClient = new PexelsAPI(process.env.PEXELS_API_KEY);

module.exports.submit = (data) => {
    return new Promise((resolve, reject) => {
        pexelsClient.searchVideos("dog", 5, 1)
            .then(function(result){
                console.log(result);
                return resolve(result);
            }).catch(function(error){
                console.log(error);
                return reject(error);
            });
    });
};
