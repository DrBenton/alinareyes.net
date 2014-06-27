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

/* GET users listing. */
router.get('/:book_slug', function(req, res) {

  var viewVars = {
    layout: 'layouts/main',
    locale: req.locales[0],
    book: req.book
  };

  // View rendering!
  res.render('pages/book-display', viewVars);
});

module.exports = {
  mountUrl: '/books',
  router: router
};
