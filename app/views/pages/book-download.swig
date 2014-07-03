{% extends '../layouts/layout-main.swig' %}

{%  block content %}
    <div class="page page-book-bought clearfix">

        Request POST content:
        <pre><%= JSON.stringify(request.body, null, 4) %></pre>
        <hr>
        <% if (typeof(paymentError) !== 'undefined') { %>
            Payment error:
            <pre><%= JSON.stringify(paymentError, null, 4) %></pre>
            <% var paymentErrorType = paymentError.raw.type %>
            <% if ('invalid_request_error' === paymentErrorType) { %>
                Whoops! Seems that our Stripe config is inaccurate!
            <% } else if ('api_error' === paymentErrorType) { %>
                Whoops! Seems that Stripe servers have some problem!
            <% } else if ('card_error' === paymentErrorType) { %>
                <% var cardErrorCode = paymentError.raw.code %>
                Whoops! Seems that the card data you provided is incorrect,
                or have been refused by your bank!
                <pre><%= cardErrorCode %></pre>
                @see https://stripe.com/docs/api/node#errors
            <% } %>
            <hr>
        <% } %>
        <% if (typeof(charge) !== 'undefined') { %>
            Stripe charge:
            <pre><%= JSON.stringify(charge, null, 4) %></pre>
            <hr>
        <% } %>

    </div>

{% endblock %}