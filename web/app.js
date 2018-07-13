var apiEndpoint = 'https://dcsgqlt4gd.execute-api.ap-southeast-2.amazonaws.com/dev/shotstack';
var shotstackOutputUrl = 'https://s3-ap-southeast-2.amazonaws.com/shotstack-dev-output/';
var progress = 0;
var progressIncrement = 10;
var pollIntervalSeconds = 10;
var unknownError = 'An unknown error has occurred. Dispatching minions...';

/**
 * Initialise and play the video
 *
 * @param {String} src  the video URL
 */
function initialiseVideo(src) {
    var player = new Plyr('#player');

    player.source = {
        type: 'video',
        sources: [{
            src: src,
            type: 'video/mp4',
        }]
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
                pollVideoStatus(id);
            }, pollIntervalSeconds * 1000);
        } else if (response.data.status === 'failed') {
            updateStatus(response.data.status);
        } else {
            initialiseVideo(shotstackOutputUrl + response.data.owner + '/' + response.data.id + '.mp4');
        }
    });
}

/**
 * Update status message and progress bar
 *
 * @param {String} status  the status text
 */
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
 * Display form field and general errors returned by API
 *
 * @param error
 */
function displayError(error) {

    if (error.status === 400) {
        var response = error.responseJSON;

        if (response.data.isJoi) {
            $.each(response.data.details, function(index, error) {
                if (error.context.key === 'search') {
                    $('#search-group label, #search').addClass('text-danger is-invalid');
                    $('#search-group').append('<div class="d-block invalid-feedback">Enter a subject keyword to create a video</div>').show();
                }

                if (error.context.key === 'title') {
                    $('#title-group label, #title').addClass('text-danger is-invalid');
                    $('#title-group').append('<div class="d-block invalid-feedback">Enter a title for your video</div>').show();
                }

                if (error.context.key === 'soundtrack') {
                    $('#soundtrack-group label, #soundtrack').addClass('text-danger is-invalid');
                    $('#soundtrack-group').append('<div class="d-block invalid-feedback">Please choose a soundtrack from the list</div>').show();
                }
            });
        } else if (typeof response.data === 'string') {
            $('#errors').text(response.data).removeClass('d-hide').addClass('d-block');
        } else {
            $('#errors').text(unknownError).removeClass('d-hide').addClass('d-block');
        }
    } else {
        $('#errors').text(unknownError).removeClass('d-hide').addClass('d-block');
    }
}

/**
 * Reset errors
 */
function resetErrors() {
    $('input, label').removeClass('text-danger is-invalid');
    $('.invalid-feedback').remove();
    $('#errors').text('').removeClass('d-block').addClass('d-hide');
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
            displayError(response.message);
        } else {
            $('#status').removeClass('d-none').addClass('d-flex');
            pollVideoStatus(response.data.id);
        }
    }).fail(function(error) {
        displayError(error);
    });
}

$(document).ready(function() {
    $('form').submit(function(event) {
        resetErrors();
        submitVideoEdit();

        event.preventDefault();
    });
});
