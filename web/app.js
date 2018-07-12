var apiEndpoint = 'https://dcsgqlt4gd.execute-api.ap-southeast-2.amazonaws.com/dev/shotstack';
var shotstackOutputUrl = 'https://s3-ap-southeast-2.amazonaws.com/shotstack-dev-output/';

/**
 * Initialise and play the video
 *
 * @param {String} src  the video URL
 */
function initialiseVideo(src) {
    var player = new Plyr('#player');

    player.source = {
        type: 'video',
        sources: [
            {
                src: src,
                type: 'video/mp4',
            }
        ]
    };

    $('#player').show();
    player.play();
}

/**
 * Check the render status of the video
 *
 * @param {String} id  the render job UUID
 */
function pollVideoStatus(id) {
    $.get(apiEndpoint + '/' + id, function(response) {
        console.log(response.data);
        if (!(response.data.status === 'done' || response.data.status === 'failed')) {
            setTimeout(function () {
                console.log(id);
                pollVideoStatus(id);
            }, 10000);
        } else if (response.data.status === 'failed') {
            console.log('render failed');
        } else {
            initialiseVideo(shotstackOutputUrl + response.data.owner + '/' + response.data.id + '.mp4');
        }
    });
}

/**
 * Submit the form with data to create a Shotstack edit
 */
function submitVideoEdit() {
    var formData = {
        'search': $('#search').val(),
        'title': $('#title').val(),
        'soundtrack': $('#soundtrack option:selected').val()
    };

    $.ajax({
        type: 'POST',
        url: apiEndpoint,
        data: JSON.stringify(formData),
        dataType: 'json',
        crossDomain: true,
        contentType: 'application/json'
    }).done(function(response) {
        console.log(response.data);
        if (response.status !== 'success') {
            console.log('handle error');
        } else {
            pollVideoStatus(response.data.id);
        }
    }).fail(function(data) {
        console.log(data.status);
    });
}

$(document).ready(function() {
    $('form').submit(function(event) {
        submitVideoEdit();
        event.preventDefault();
    });
});
