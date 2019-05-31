'use strict';

const request = require('request');
const Joi = require('@hapi/joi');
const PexelsAPI = require('pexels-api-wrapper');
const pexelsClient = new PexelsAPI(process.env.PEXELS_API_KEY);
const shotstackUrl = process.env.SHOTSTACK_HOST;
const shotstackApiKey = process.env.SHOTSTACK_API_KEY;
const shotstackAssetsUrl = process.env.SHOTSTACK_ASSETS_URL;

module.exports.submit = (data) => {
    const schema = {
        search: Joi.string().regex(/^[a-zA-Z0-9 ]*$/).min(2).max(30).required(),
        title: Joi.string().regex(/^[a-zA-Z0-9 ]*$/).min(2).max(30).required(),
        soundtrack: Joi.string().valid(['disco', 'freeflow', 'melodic']).required(),
    };

    const valid = Joi.validate({
        search: data.search,
        soundtrack: data.soundtrack,
        title: data.title
    }, schema);

    return new Promise((resolve, reject) => {
        if (valid.error) {
            return reject(valid.error);
        }

        const minClips = 4;
        const maxClips = 8;
        const clipLength = 2;
        const videoStart = 4;

        pexelsClient.searchVideos(data.search, maxClips, 1).then(function(pexels) {
            if (pexels.total_results < minClips) {
                throw "There are not enough clips for '" + data.search + "' to create a video";
            }

            let tracks = [];
            let videos = [];

            let title = {
                asset: {
                    type: "title",
                    text: data.title,
                    style: "minimal"
                },
                start: 0,
                length: 4,
                effect: "zoomIn",
                transition: {
                    in: "fade",
                    out: "fade"
                }
            };

            for (let [index, video] of pexels.videos.entries()) {
                let videoFiles = video.video_files;
                let hdVideo = videoFiles.find(file => file.height === 720 || file.height === 1920) || videoFiles[0];

                videos[index] = {
                    asset: {
                        type: "video",
                        src: hdVideo.link,
                        trim: 1
                    },
                    start: videoStart + (index * clipLength),
                    length: clipLength
                };

                if (index === 0) {
                    videos[index].transition = {
                        in: "fade"
                    }
                }

                if (index === (maxClips - 1)) {
                    videos[index].transition = {
                        out: "fade"
                    }
                }
            }

            tracks[0] = {
                clips: [
                    title
                ]
            };

            tracks[1] = {
                clips: videos
            };

            let timeline = {
                soundtrack: {
                    src: shotstackAssetsUrl + "music/" + data.soundtrack + ".mp3"
                },
                background: "#000000",
                tracks: tracks,
            };

            let output = {
                format: "mp4",
                resolution: "sd"
            };

            let edit = {
                timeline: timeline,
                output: output
            };

            request({
                url: shotstackUrl + 'render',
                method: 'POST',
                headers: {
                    'x-api-key': shotstackApiKey
                },
                json: true,
                body: edit
            }, function (error, response, body){
                if (error) {
                    console.log(error);
                    return reject(error);
                }

                return resolve(body.response);
            });
        }).catch(function(error) {
            console.log(error);
            return reject(error);
        });
    });
};

module.exports.status = (id) => {
    const schema = {
        id: Joi.string().guid({
            version: [
                'uuidv4',
                'uuidv5'
            ]
        })
    };

    const valid = Joi.validate({
        id: id
    }, schema);

    return new Promise((resolve, reject) => {
        if (valid.error) {
            return reject(valid.error);
        }

        request({
            url: shotstackUrl + 'render/' + id,
            method: 'GET',
            headers: {
                'x-api-key': shotstackApiKey
            },
            json: true
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                return reject(error);
            }

            return resolve(body.response);
        });
    });
};
