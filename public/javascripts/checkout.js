/**
 * Created by Gerard on 1/17/2017.
 */
Stripe.setPublishableKey('pk_test_hF3KGd0Zz0bHi1t0nCK8wmgu');

$(function() {
    var $form = $('#checkout-form');
    $form.submit(function(event) {
        $('#charge-error').addClass('hidden');
        // Disable the submit button to prevent repeated clicks:
        $form.find('button').prop('disabled', true);

        // Request a token from Stripe:
        Stripe.card.createToken({
            number: $('#card-number').val(),
            cvc: $('#card-cvc').val(),
            exp_month: $('#card-expiry-month').val(),
            exp_year: $('#card-expiry-year').val(),
            name: $('#card-name').val()
        }, stripeResponseHandler);

        // Prevent the form from being submitted:
        return false;
    });
});

function stripeResponseHandler(status, response) {
    // Grab the form:
    var $form = $('#checkout-form');

    if (response.error) { // Problem!

        // Show the errors on the form:
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!

        // Get the token ID:
        var token = response.id;

        // Insert the token ID into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken">').val(token));

        // Submit the form:
        $form.get(0).submit();
    }
};