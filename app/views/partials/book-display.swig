{% set bookUrl = baseUrl  + '/books/' + book.get('slug') %}
<div class="book book-small-display col-sm-4 {{ book.get('paper') ? 'paper-book' : 'e-book' }}">
    <div class="book-cover">
        <a href="{{ bookUrl }}"><img src="{{ book.get('cover_small_url') }}"
             class="img-responsive" alt="{{ book.getTitle(locale) }}"></a>
    </div>
    <div class="book-info">
        <div class="book-title-container">
            <h4 class="book-title">
                <span>
                    {{ book.getTitle(locale) }}
                    {% if book.get('paper') %}
                        - {{ trans('common.is_paper', locale) }}
                    {% endif %}
                </span>
            </h4>
        </div>
        <div class="book-desc">
            {{  _s.stripTags(book.getShortDesc(locale)) | safe }}
        </div>
        <div class="book-price-nb-pages">
            <span class="book-price">
                {{ price(book.get('price'), locale) }}
            </span>
            -
            <span class="book-nb-pages">
                {{ trans('common.nb_pages', locale, {'%nb-pages%': book.get('nb_pages')}) }}
            </span>
        </div>
    </div>
    <div class="button-container">
        <a href="{{ bookUrl }}" class="button with-icon more">
            {{ 'common.more' | trans(locale) }}
        </a>
    </div>
</div>