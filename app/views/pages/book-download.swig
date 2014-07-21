{% extends '../layouts/layout-main.swig' %}

{%  block content %}
    <div class="page page-book-download clearfix">

        <div class="row">
            <div class="block-container book book-download-display col-lg-12">
                <div class="block-container">
                    <div class="block block-download">
                        <h3 class="block-title">
                            {{ 'book-download.blocks.download.title' | trans(locale) }}
                        </h3>
                        <div class="block-content">
                            <div class="row">
                                <div class="book-cover col-sm-4">
                                    <img src="{{ book.get('cover_large_url') }}"
                                         class="img-responsive" alt="{{ book.getTitle(locale) }}">
                                </div>
                                <div class="book-desc-container col-sm-8">
                                    <h2>{{ book.getTitle(locale) }}</h2>
                                    {% if not book.isFree() %}
                                        <p>
                                            {{ 'book-download.blocks.download.thank-you-for-buying' | trans(locale) }}
                                        </p>
                                    {% endif %}
                                    <div class="intro">
                                        {{ 'book-download.blocks.download.intro' | trans(locale) | safe }}
                                    </div>

                                    <div class="download-buttons-container">
                                        <div class="download-buttons">
                                        {% for bookFormat in bookFormats %}
                                            <div class="book-download-block col-md-4">
                                                <h4 class="block-title">{{ bookFormat }}</h4>
                                                <div class="intro">
                                                    {{ trans('book-download.blocks.download.format-block.intro.' + bookFormat, locale, {
                                                        '%format%': bookFormat
                                                    }) }}
                                                </div>
                                                <a href="{{ baseUrl }}/books/{{ book.get('slug') }}/download/{{ bookFormat }}" class="button">
                                                    {{ 'book-download.blocks.download.format-block.download' | trans(locale) }}
                                                </a>
                                            </div>
                                        {% endfor %}
                                        </div><!-- end .download-buttons -->
                                    </div><!-- end .download-buttons-container -->
                                </div><!-- end .book-desc-container -->
                            </div><!-- end .row -->
                        </div><!-- end .block-content -->
                    </div><!-- end .block -->
                </div><!-- end .block-container -->
            </div><!-- end .book-download-display -->
        </div><!-- end .row -->

    </div>

{% endblock %}