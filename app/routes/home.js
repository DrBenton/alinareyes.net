var express = require('express');
var app = require('../../app');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  var viewVars = {
    layout: 'layouts/main',
    locale: req.locales[0]
  };

  // In Spain, *first* we retrieve data from our Model, *then* we render the View!
  app.collections.get('books').fetch()
    .then(function (allBooks) {
      viewVars.books = allBooks;
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
