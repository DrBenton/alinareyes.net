{% extends '../layouts/layout-main.swig' %}

{%  block content %}
    <div class="page page-book-full-display clearfix">

        <div class="row">
            <div class="block-container book-full-display col-md-8">
                <div class="block-container">
                    <div class="block block-book book">
                        <h3 class="block-title">
                            {{ 'book-full-display.blocks.book.title' | trans(locale) }}
                        </h3>
                        <div class="block-content">
                            <div class="row">
                                <div class="book-cover col-xs-4">
                                    <img src="{{ book.get('cover_large_url') }}"
                                         class="img-responsive" alt="{{ book.getTitle(locale) }}">
                                </div>
                                <div class="book-desc-container col-xs-8">
                                    <h2>{{ book.getTitle(locale) }}</h2>
                                    {{ book.getDesc(locale) | safe }}
                                </div>
                            </div><!-- end .row -->
                        </div><!-- end .block-content -->
                    </div><!-- end .block -->
                </div><!-- end .block-container -->
            </div><!-- end .book-full-display -->

            <div class="book-full-display-sidebar sidebar sidebar-right col-md-3">
                <div class="block-container clearfix">
                    <div class="block block-buy">
                        <h3 class="block-title">
                            {% if book.isFree() %}
                                {{ 'book-full-display.blocks.buy.title-free' | trans(locale) }}
                            {% else %}
                                {{ 'book-full-display.blocks.buy.title' | trans(locale) }}
                            {% endif %}
                        </h3>
                        <div class="block-content">
                            <div class="book-title">
                                {{ book.getTitle(locale) }}
                            </div>
                            <div class="book-nb-pages">
                                {{ trans('common.nb_pages', locale, {
                                    '%nb-pages%': book.get('nb_pages')
                                }) | safe }}
                            </div>
                            <div class="book-price">
                                {{ price(book.get('price'), locale) }}
                            </div>
                            <div class="book-isbn">
                                {{ trans('common.isbn', locale, {
                                    '%isbn%': book.get('isbn')
                                }) | safe }}
                            </div>
                            <div class="button-container">
                                {% if book.isFree() %}
                                    <a href="{{ baseUrl }}/books/{{ book.get('slug') }}/download" class="button with-icon book-download">
                                        {{ 'book-full-display.blocks.buy.buy-free' | trans(locale) }}
                                    </a>
                                {% else %}
                                    <a href="{{ baseUrl }}/books/{{ book.get('slug') }}/buy" class="button with-icon book-buy">
                                        {{ 'book-full-display.blocks.buy.buy' | trans(locale) }}
                                    </a>
                                {% endif %}
                            </div>
                        </div><!-- end .block-content -->
                    </div><!-- end .block-buy -->
                </div><!-- end .block-container-->
            </div><!-- end .book-full-display-sidebar -->

        </div><!-- end .row -->

        <hr>

        <div class="row">

            <div class="block-container book-preview-container col-lg-12">
                <div class="block">
                    <h3 class="block-title with-icon">
                        {{ trans('book-full-display.blocks.preview.title', locale, {
                            '%book-title%': book.getTitle(locale)
                        }) }}
                    </h3>
                    <div class="block-content">
                        <p class="intro">
                            {{ trans('book-full-display.blocks.preview.intro', locale, {
                                '%book-title%': book.getTitle(locale)
                            }) | safe }}
                        </p>
                        <div class="book-preview clearfix">
                            <ul id="book-preview-carousel" class="hidden">
                                {% set range = _.range(1, book.get('nb_pages_preview')) %}
                                {% for i in range %}
                                    <li>
                                        <img data-lazy="{{ book.getPagePreviewUrl(i) }}"
                                             class="img-responsive" alt="">
                                    </li>
                                {% endfor %}
                            </ul>
                        </div><!-- end .book-preview -->
                    </div><!-- end .block-content -->
                </div><!-- end .block -->
            </div><!-- end .block-container.book-preview-container -->

        </div><!-- end .row -->

    </div><!-- end .page -->
{% endblock %}

{%  block stylesheets %}
    <link rel="stylesheet" href="{{ bowerComponentsUrl }}/slick.js/slick/slick.css">
{% endblock %}

{%  block javascripts %}
    <script src="{{ bowerComponentsUrl }}/jquery/dist/jquery.min.js"></script>
    <script src="{{ bowerComponentsUrl }}/slick.js/slick/slick.min.js"></script>
    <script>
        //TODO: handle this with Twitter Flight
        $(document).ready(function() {
            $('#book-preview-carousel')
                .slick({
                    dots: true,
                    speed: 200,
                    infinite: false,
                    slide: 'li',
                    lazyLoad: 'progressive'
                })
                .removeClass('hidden').show();
        });
    </script>
{% endblock %}
