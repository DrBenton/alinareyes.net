<div class="stripe-payment">

    <div class="intro">
        {{ trans('book-buy.blocks.buy.stripe-form.intro', locale, {
            '%book-title%': book.getTitle(locale),
            '%book-price%': price(book.get('price'), locale)
        }) | safe }}
    </div>

    <form id="stripe-form" action="{{ baseUrl}}/books/{{ book.get('slug')}}/buy" method="POST">
        <!-- TODO: handle CSRF -->
        <input type="hidden" name="stripe-token">
        <input type="hidden" name="user-email">

    </form>

    <button id="customButton" class="button">
        {{ 'book-buy.blocks.buy.stripe-form.buy-button' | trans(locale) }}
    </button>

    <script src="{{ bowerComponentsUrl}}/jquery/dist/jquery.min.js"></script>
    <script src="https://checkout.stripe.com/checkout.js"></script>
    <script>
        //TODO: handle this with Twitter Flight
        var handler = StripeCheckout.configure({
            key: '{{ appConfig.stripe.public_key}}',
            image: '{{ themeUrl}}/img/stripe/logo.png',
            token: function(token) {
                var $stripeForm = $('#stripe-form');
                // Use the token to create the charge with a server-side script.
                // You can access the token ID with `token.id`
                $stripeForm.find('input[name="stripe-token"]').val(token.id);
                $stripeForm.find('input[name="user-email"]').val(token.email);
                $stripeForm.submit();
            }
        });

        document.getElementById('customButton').addEventListener('click', function(e) {
            // Open Checkout with further options
            handler.open({
                name: '{{ appConfig.stripe.siteName}}',
                description: '{{ trans('book-buy.blocks.buy.stripe-form.description', locale, {
                '%book-title%': book.getTitle(locale)
                }) |safe }}',
                amount: {{ book.get('price') * 100}},
                currency: '{{ appConfig.stripe.currency}}'
            });
            e.preventDefault();
        });
    </script>

</div>

