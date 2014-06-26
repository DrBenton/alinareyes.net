var express = require('express');
var app = require('../../app');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  var nbHightlitedBooks = 2;
  var viewVars = {
    layout: 'layouts/main',
    locale: req.locales[0],
    nbBooksDisplayed: nbHightlitedBooks
  };

  // Model manipulations
  app.collections.get('books').getHighlightedBooks(nbHightlitedBooks)
    .then(function (highlightedBooks) {
      viewVars.highlightedBooks = highlightedBooks;
    })
    .then(function () {
      // Nb books total
      return app.collections.get('books').query().count('* as count').select();
    })
    .then(function (res) {
      viewVars.nbBooksTotal = res[0].count;
    })
    .then(function () {
      // Last books
      return app.collections.get('books').getLastBooks();
    })
    .then(function (lastBooks) {
      viewVars.lastBooks = lastBooks;
    })
    .then(function () {
      // View rendering!
      res.render('pages/home', viewVars);
    })
    .done();
});

module.exports = {
  mountUrl: '/',
  router: router
};
