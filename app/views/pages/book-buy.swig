{% extends '../layouts/layout-main.swig' %}

{%  block content %}
    <div class="page page-book-buy clearfix">
    
        <div class="row">
            <div class="book book-buy-display col-lg-12">
                <div class="block-container">
                    <div class="block block-buy">
                        <h3 class="block-title">
                            {{ 'book-buy.blocks.buy.title'|trans(locale) }}
                        </h3>
                        <div class="block-content">
                            <div class="row">
                                <div class="book-cover col-sm-4">
                                    <img src="{{ book.get('cover_large_url') }}"
                                         class="img-responsive" alt="{{ book.getTitle(locale) }}">
                                </div>
                                <div class="book-desc-container col-sm-8">
                                    <h2>{{ book.getTitle(locale) }}</h2>
                                    {% include '../partials/payment-stripe.swig' %}
                                </div>
                            </div><!-- end .row -->
                        </div><!-- end .block-content -->
                    </div><!-- end .block -->
                </div><!-- end .block-container -->
            </div><!-- end .book-buy-display -->
        </div><!-- end .row -->
    
        <div class="row">
            <div class="block-container col-lg-12">
                <div class="block">
                    <h3 class="block-title">{{ 'book-buy.blocks.about-products.title' | trans(locale) }}</h3>
                    <div class="block-content">
                        {{ trans('book-buy.blocks.about-products.content', locale, {
                          '%base-url%': baseUrl,
                          '%book-title%': book.getTitle(locale),
                          '%book-price%': price(book.get('price'), locale)
                        }) | safe }}
                    </div>
                </div>
            </div>
        </div>
    
    </div>

{% endblock %}