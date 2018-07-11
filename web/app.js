$(document).ready(function() {
    $('form').submit(function(event) {

        //$('.form-group').removeClass('has-error'); // remove the error class
        //$('.help-block').remove(); // remove the error text

        var formData = {
            'search': $('#search').val(),
            'title': $('#title').val(),
            'soundtrack': $('#soundtrack option:selected').val()
        };

        console.log(formData);

        // process the form
        $.ajax({
            type: 'POST',
            url: 'https://dcsgqlt4gd.execute-api.ap-southeast-2.amazonaws.com/dev/shotstack',
            data: JSON.stringify(formData),
            dataType: 'json',
            crossDomain: true,
            contentType: 'application/json'
        })
        .done(function(data) {
            console.log(data);
            if (!data.success) {
                if (data.errors.name) {
                    $('#name-group').addClass('has-error'); // add the error class to show red input
                    $('#name-group').append('<div class="help-block">' + data.errors.name + '</div>'); // add the actual error message under our input
                }
                if (data.errors.email) {
                    $('#email-group').addClass('has-error'); // add the error class to show red input
                    $('#email-group').append('<div class="help-block">' + data.errors.email + '</div>'); // add the actual error message under our input
                }
                if (data.errors.superheroAlias) {
                    $('#superhero-group').addClass('has-error'); // add the error class to show red input
                    $('#superhero-group').append('<div class="help-block">' + data.errors.superheroAlias + '</div>'); // add the actual error message under our input
                }
            } else {
                $('form').append('<div class="alert alert-success">' + data.message + '</div>');
            }
        })
        .fail(function(data) {
            console.log(data.responseText);
        });

        event.preventDefault();
    });

});
