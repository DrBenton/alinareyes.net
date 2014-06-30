var express = require('express');
var app = require('../../app');

var router = express.Router();

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
    layout: 'layouts/layout-main',
    locale: req.locales[0],
    book: req.book
  };

  // View rendering!
  res.render('pages/book-full-display', viewVars);
});

/* GET book buy page display (client-side Stripe payment form). */
router.get('/:book_slug/buy', function(req, res) {

  var viewVars = {
    layout: 'layouts/layout-main',
    locale: req.locales[0],
    book: req.book
  };

  // View rendering!
  res.render('pages/book-buy', viewVars);
});

/* POST book buy process (server-side Stripe payment process). */
router.post('/:book_slug/buy', function(req, res) {

  var viewVars = {
    layout: 'layouts/layout-main',
    locale: req.locales[0],
    book: req.book,
    request: req // debug only, remove it later...
  };

  // Let's process our Stripe Payment!
  var stripePaymentService = require('../services/payment-stripe');
  stripePaymentService.processBookPayment(req.book, req.body['stripe-token'])
    .then(
      function (charge) {
        viewVars.charge = charge;
      },
      function (err) {
        viewVars.paymentError = err;
      }
    )
    .fin(function () {
      // View rendering!
      res.render('pages/book-bought', viewVars);
    })
    .done();

});

module.exports = {
  mountUrl: '/books',
  router: router
};
