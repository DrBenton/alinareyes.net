var express = require('express');
var _ = require('lodash');
var Q = require('q');

var app = require('../../app');
var booksService = require('../services/books-service');

var appConfig = app.get('config');
var router = express.Router();

// Module consts
var BOOKS_FORMATS =  ['epub', 'mobi', 'pdf'];
var BOOKS_FORMATS_MIME_TYPES = {
  'epub': 'application/epub+zip',
  'mobi': 'application/x-mobipocket-ebook',
  'pdf': 'application/pdf'
};

// Router specific params handlers
router.param('book_slug', function(req, res, next, slug) {
  Q(app.models.books.forge({slug: slug}).fetch({require: true}))
    .then(
      function (book) {
        req.book = book;
        next();
      },
      function (err) {
        next(new Error('failed to load book'));
      }
    )
    .done();
});

router.param('book_format', function(req, res, next, format) {
  if (-1 === BOOKS_FORMATS.indexOf(format)) {
    next(new Error('invalid ebook format'));
  } else {
    next();
  }
});

// Router specific middlewares
function checkBookDownloadAuthorization(redirectIfNoAuth) {
  return function (req, res, next) {
    // All right, let's check that we have a proper download authorization for the target book
    booksService.checkBookDownloadAccess(req)
      .then(function (accessGranted) {
        switch (redirectIfNoAuth) {
          case true:
            if (accessGranted) {
              next();
            } else {
              // Redirect to the "buy book" page!
              req.flash('error', 'no access to this book!');
              var targetUrl = appConfig.general.baseUrl + '/books/' + req.book.get('slug') + '/buy';
              res.redirect(targetUrl);
            }
            break;
          case false:
            // No "redirect if no book download authorization" policy: we just add a flag to the request
            req.bookDownloadAuthorized = accessGranted;
            next();
            break;
        }
      })
      .fail(function (err) {
        throw err;
      })
      .done();
  }
}

// Action!

/* GET book full display. */
router.get('/:book_slug', checkBookDownloadAuthorization(false), function(req, res) {

  var viewVars = {
    locale: req.locales[0],
    req: req,
    book: req.book,
    bookDownloadAuthorized: req.bookDownloadAuthorized
  };

  // View rendering!
  res.render('pages/book-full-display', viewVars);

});

/* GET book buy page display (client-side Stripe payment form). */
router.get('/:book_slug/buy', checkBookDownloadAuthorization(false), function(req, res) {

  if (req.bookDownloadAuthorized) {
    // This book is free or has been already bought: let's redirect to the download page!
    var targetUrl = appConfig.general.baseUrl + '/books/' + req.book.get('slug') + '/download';
    res.redirect(targetUrl);
    return;
  }

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

  // Let's process our Stripe Payment!
  var stripePaymentService = require('../services/payment-stripe');
  stripePaymentService.processBookPayment(req.book, req.body['stripe-token'])
    .then(
      function (charge) {
        // Successful payment!
        // 1) we store it in DB...
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
router.get('/:book_slug/download', checkBookDownloadAuthorization(true), function(req, res) {

  var viewVars = {
    locale: req.locales[0],
    req: req,
    book: req.book,
    bookFormats: BOOKS_FORMATS
  };

  // View rendering!
  res.render('pages/book-download', viewVars);

});

/* GET book file download. */
router.get('/:book_slug/download/:book_format', checkBookDownloadAuthorization(true), function(req, res) {

  // Book file download!

  var bookFormat = req.params['book_format'];

  var bookFilePath = app.locals.interpolate(appConfig.books['ebook.file.path'], {
    '%app-root-path%': app.get('appRootPath'),
    '%book-slug%': req.book.get('slug'),
    '%book-format%': bookFormat
  });

  var bookDownloadedFileName = app.locals.interpolate(appConfig.books['ebook.file.name'], {
    '%book-title%': req.book.getTitle(req.locales[0]),
    '%book-slug%': req.book.get('slug'),
    '%book-format%': bookFormat
  });

  res.set('Content-Type: ', BOOKS_FORMATS_MIME_TYPES[bookFormat]);
  res.download(bookFilePath, bookDownloadedFileName, function(err){
    if (err) {
      // handle error, keep in mind the response may be partially-sent
      // so check res.headersSent
      throw err;
    } else {
      //TODO: increment download counter?
    }
  });

});


module.exports = {
  mountUrl: '/books',
  router: router
};
