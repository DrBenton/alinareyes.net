var Q = require('q');
var app = require('../../app');


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


module.exports = {
  checkBookDownloadAccess: checkBookDownloadAccess
};