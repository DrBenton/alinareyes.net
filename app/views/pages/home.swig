{% extends '../layouts/layout-main.swig' %}

{% block content %}
    <div class="page page-home">

        <div class="block-container block-container-books col-lg-12">
            <div class="block">
                <h3 class="block-title">{{ 'home.blocks.books.title' | trans(locale) | safe }}</h3>
                <div class="block-content">
                    <div class="row">
                        {% for book in books.models %}
                            {% include '../partials/book-display.swig' with {book: book} %}
                        {% endfor %}
                    </div>
                </div>
            </div>
        </div><!-- end .books-container -->

        <hr>

        <div class="block-container block-main-content-container col-sm-8">
            <div class="block">
                <h3 class="block-title">{{ 'home.blocks.books.title' | trans(locale) }}</h3>
                <div class="block-content main-content">
                    {{ 'home.intro' | trans(locale) }}
                </div>
            </div>
        </div><!-- end .main-content-container -->

        <div class="sidebar-container col-sm-4">
            <div class="sidebar">
                sidebar
            </div>
        </div><!-- end .sidebar-container -->

    </div><!-- end .page -->
{% endblock %}

{% block stylesheets %}
    <link rel="stylesheet" href="{{ bowerComponentsUrl  }}/slick.js/slick/slick.css">
{% endblock %}

{% block footer %}
     layout corp.
{% endblock %}
