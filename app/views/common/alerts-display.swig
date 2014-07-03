{% set errors = req.flash('error') %}
{% if (!!errors && errors.length > 0) %}
    <div class="alerts-container-intro col-lg-12">
        {{ 'common.alerts.errors.intro' | trans(locale) }}
    </div>
    <ul class="alerts-container alerts-container-errors">
    {% for errorMsg in errors %}
        <li class="alert alert-danger" role="alert">{{ errorMsg }}</li>
    {% endfor %}
    </ul>
    <hr>
{% endif %}