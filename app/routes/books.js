var express = require('express');
var app = require('../../app');

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
    layout: 'layouts/layout-main',
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
    layout: 'layouts/layout-main',
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
    layout: 'layouts/layout-main',
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
        // View rendering!
        res.render('pages/book-download', viewVars);
      },
      function (err) {
        viewVars.paymentError = err;
        req.flash('errors', err.raw.type);
        res.redirect(app.get('config').general.baseUrl + '/books/' + req.book.get('slug') + '/buy');
      }
    )
    .done();

});

module.exports = {
  mountUrl: '/books',
  router: router
};
