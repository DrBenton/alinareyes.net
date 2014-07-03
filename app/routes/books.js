var express = require('express');
var app = require('../../app');

var appConfig = app.get('config');
var router = express.Router();

// Router specific middlewares & params handlers
router.param('book_slug', function(req, res, next, slug) {
  app.models.books.forge({slug: slug}).fetch()
    .then(function (book) {
      req.book = book;
      next();
    })
    .done();
});


/* GET book full display. */
router.get('/:book_slug', function(req, res) {

  var viewVars = {
    locale: req.locales[0],
    req: req,
    book: req.book
  };

  // View rendering!
  res.render('pages/book-full-display', viewVars);
});

/* GET book buy page display (client-side Stripe payment form). */
router.get('/:book_slug/buy', function(req, res) {

  var viewVars = {
    locale: req.locales[0],
    req: req,
    book: req.book
  };

  // View rendering!
  res.render('pages/book-buy', viewVars);
});

/* POST book buy process (server-side Stripe payment process). */
router.post('/:book_slug/buy', function(req, res) {

  var viewVars = {
    locale: req.locales[0],
    req: req,
    book: req.book
  };

  // Let's process our Stripe Payment!
  var stripePaymentService = require('../services/payment-stripe');
  stripePaymentService.processBookPayment(req.book, req.body['stripe-token'])
    .then(
      function (charge) {
        viewVars.charge = charge;
        // Yeah! Let's save the token in session, and redirect to the download page!
        req.session.booksChargesIds = req.session.booksChargesIds || [];
        req.session.booksChargesIds.push(charge.id);
        var targetUrl = appConfig.general.baseUrl + '/books/' + req.book.get('slug') + '/download';
        res.redirect(targetUrl);
      },
      function (err) {
        viewVars.paymentError = err;
        // Let's flash the error type...
        var errorCode = 'error.stripe.' + err.raw.type;
        if ('card_error' === err.raw.type) {
          errorCode += '.' + err.raw.code;
        }
        req.flash('error', errorCode);
        // ...then redirect to the "buy book" page!
        var targetUrl = appConfig.general.baseUrl + '/books/' + req.book.get('slug') + '/buy';
        res.redirect(targetUrl);
      }
    )
    .done();

});

module.exports = {
  mountUrl: '/books',
  router: router
};
