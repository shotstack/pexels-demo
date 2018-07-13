var apiEndpoint = 'https://dcsgqlt4gd.execute-api.ap-southeast-2.amazonaws.com/dev/shotstack';
var shotstackOutputUrl = 'https://s3-ap-southeast-2.amazonaws.com/shotstack-dev-output/';
var progress = 0;
var progressIncrement = 10;
var pollIntervalSeconds = 10;

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

    $('#status').removeClass('d-flex').addClass('d-none');
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
        updateStatus(response.data.status);
        if (!(response.data.status === 'done' || response.data.status === 'failed')) {
            setTimeout(function () {
                console.log(id);
                pollVideoStatus(id);
            }, pollIntervalSeconds * 1000);
        } else if (response.data.status === 'failed') {
            console.log('render failed');
        } else {
            initialiseVideo(shotstackOutputUrl + response.data.owner + '/' + response.data.id + '.mp4');
        }
    });
}

function updateStatus(status) {
    if (progress <= 90) {
        progress += progressIncrement;
    }

    if (status === 'queued') {
        $('#status .fas').attr('class', 'fas fa-history fa-2x');
        $('#status p').text('QUEUED');
    } else if (status === 'fetching') {
        $('#status .fas').attr('class', 'fas fa-cloud-download-alt fa-2x');
        $('#status p').text('DOWNLOADING ASSETS');
    } else if (status === 'rendering') {
        $('#status .fas').attr('class', 'fas fa-server fa-2x');
        $('#status p').text('RENDERING VIDEO');
    } else if (status === 'done') {
        $('#status .fas').attr('class', 'fas fa-check-circle fa-2x');
        $('#status p').text('READY');
        progress = 100;
    } else {
        $('#status .fas').attr('class', 'fas fa-exclamation-triangle fa-2x');
        $('#status p').text('SOMETHING WENT WRONG');
    }

    $('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);
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
        if (response.status !== 'success') {
            console.log('handle error');
        } else {
            $('#status').removeClass('d-none').addClass('d-flex');
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
