<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Place favicon.ico and apple-touch-icon(s) in the root directory -->

    <link href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600|Arvo:700" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="{{ themeUrl }}/css/main.css">
    {% block stylesheets %}{% endblock %}

    <script src="{{ bowerComponentsUrl }}/modernizr/modernizr.js"></script>

</head>
<body>
<!--[if lt IE 8]>
<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
<![endif]-->

<div id="site-container-wrapper" class="container">
    <div id="site-container">
        <header>
            {% include '../common/top-nav.swig' %}
            <h1>AlinaReyes.net</h1>
            <h2>Le site d'édition en ligne d'Alina Reyes</h2>
        </header>
        <hr>
        <div id="main-container-wrapper">
            <div id="main-container">
                <div>[Session Debug : <code>{{ req.session | json }}</code>]</div>
                {% include '../common/alerts-display.swig' %}
                {% block content %}{% endblock %}
            </div>
        </div>
    </div>
</div>

{% include '../common/footer.swig' %}

{% block javascripts %}{% endblock %}

<!--
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="{{ themeUrl }}/js/vendor/jquery-1.11.1.min.js"><\/script>')</script>
<script src="js/plugins.js"></script>
<script src="js/main.js"></script>
-->
<!-- Google Analytics: change UA-XXXXX-X to be your site's ID.
<script>
    (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
    ga('create','UA-XXXXX-X');ga('send','pageview');
</script>
-->
</body>
</html>