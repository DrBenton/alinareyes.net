var express = require('express');
var _ = require('lodash');
var Q = require('q');

var app = require('../../app');

var appConfig = app.get('config');
var router = express.Router();

// Router specific middlewares & params handlers
router.param('book_slug', function(req, res, next, slug) {
  Q(app.models.books.forge({slug: slug}).fetch())
    .then(function (book) {
      req.book = book;
      next();
    })
    .done();
});

// Specific helpers
function checkBookDownloadAccess(req) {
  // All right, let's check that we have a valid authorization for the target book

  var bookAuthorizationCheckPromise;

  if (0 === req.book.get('price')) {

    // Great, this books is free! There is no need to check anything...
    bookAuthorizationCheckPromise = Q(true);

  } else {

    if (!req.session.booksChargesIds || 0 === req.session.booksChargesIds.length) {

      // No "books charges ids" array in session: we refuse the download
      bookAuthorizationCheckPromise = Q(false);

    } else {

      // Let's see which books we have bought during this session...
      bookAuthorizationCheckPromise = Q(
        app.collections.get('books_payments')
          .query({
           where: {
             'id': req.session.booksChargesIds
           }
          })
          .fetch({
            columns: ['book_id']
          })
      );
      bookAuthorizationCheckPromise = bookAuthorizationCheckPromise.then(
          function (boughtBooks) {
            if (boughtBooks.pluck('book_id').indexOf(req.book.id)) {
              // We have bought books, but we don't have that one.
              req.flash('error', 'boughtBooksIds=' + JSON.stringify(boughtBooks));
              return false;
            }

            return true;
          },
          function (err) {
            req.flash('error', JSON.stringify(err));
            return false;
          }
        );

    }

  }

  return bookAuthorizationCheckPromise;
}


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
        // Successful payment!
        // 1) we store in in DB...
        Q(app.collections.get('books_payments')
          .create({
            payment_id: charge.id,
            book_id: req.book.id,
            customer_email: charge.card.name
          }))
          .then(
            function (bookPayment) {
              // 2) we save the token in session, and redirect to the download page!
              req.session.booksChargesIds = req.session.booksChargesIds || [];
              req.session.booksChargesIds.push(bookPayment.id);
              var targetUrl = appConfig.general.baseUrl + '/books/' + req.book.get('slug') + '/download';
              res.redirect(targetUrl);
            },
            function (err) {
              // Whoops. We had an error while storing this payment in DB :-/
              req.flash('error', err.message);
              var targetUrl = appConfig.general.baseUrl + '/books/' + req.book.get('slug') + '/buy';
              res.redirect(targetUrl);
            }
          )
          .done();
      },
      function (err) {
        // Ach! Payment error :-/
        // 1) Let's flash the error type...
        var errorCode = 'error.stripe.' + err.raw.type;
        if ('card_error' === err.raw.type) {
          errorCode += '.' + err.raw.code;
        }
        req.flash('error', errorCode);
        // 2) ...then redirect to the "buy book" page!
        var targetUrl = appConfig.general.baseUrl + '/books/' + req.book.get('slug') + '/buy';
        res.redirect(targetUrl);
      }
    )
    .done();

});


/* GET book download page display. */
router.get('/:book_slug/download', function(req, res) {

  // All right, let's check that we have a proper authorization for the target book
  checkBookDownloadAccess(req)
    .then(function (accessGranted) {
      if (accessGranted) {

        var viewVars = {
          locale: req.locales[0],
          req: req,
          book: req.book,
          bookFormats: ['epub', 'mobi', 'pdf']
        };

        // View rendering!
        res.render('pages/book-download', viewVars);

      } else {

        req.flash('error', 'no access to this book!');
        // Redirect to the "buy book" page!
        var targetUrl = appConfig.general.baseUrl + '/books/' + req.book.get('slug') + '/buy';
        res.redirect(targetUrl);

      }
    })
    .fail(function (err) {
      throw err;
    })
    .done();

});


module.exports = {
  mountUrl: '/books',
  router: router
};
