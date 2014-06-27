var path = require('path');

var Q = require('q');
var glob = Q.denodeify(require('glob'));
var _s = require('underscore.string');
require('require-yaml');

var app = require('../../app');

app.initPromise
  .then(function () {
    // Books table is truncated
    console.log('Books table is truncated...');
    return Q(app.collections.get('books').query().truncate());
  })
  .then(function () {
    console.log('Books data YAML files search...');
    glob('books-data/*.yml', { cwd: __dirname})
      .then(function (booksDataFiles) {
        console.log(booksDataFiles.length + ' books to import...');

        var booksData = [];
        booksDataFiles.forEach(function (bookDataFilePath) {
          console.log('File "'+bookDataFilePath+'" data import...');
          bookDataFilePath = path.join(__dirname, bookDataFilePath);
          booksData.push(require(bookDataFilePath));
        });

        // Books are sorted by weight
        console.log('Books sorting by weight...');
        booksData.sort(function (bookA, bookB) {
          var weightA = bookA.weight, weightB = bookB.weight;
          if (weightA < weightB)
            return -1;
          else if (weightA > weightB)
            return 1;
          else
            return 0;
        });

        // Ok, now let's create these folks!
        var booksCollection = app.collections.get('books');
        var booksCreationPromise = Q();
        console.log('Books import !');
        booksData.forEach(function (bookData) {
          console.log('"' + bookData.title + '" import preparation...');
          booksCreationPromise = booksCreationPromise.then(function () {
            console.log('"' + bookData.title + '" import...');
            return Q(
              booksCollection.create({
                title_fr: bookData.title,
                desc_fr: bookData.summary,
                desc_short_fr: bookData.summaryMini
                  ? bookData.summaryMini
                  : _s.prune(_s.stripTags(bookData.summary), 120),
                picture_url: 'http://alinareyes.net/img/books/'+bookData.slug+'.jpg',
                publication_date: '1980-07-11',
                price: bookData.price,
                highlight: false,
                weight: bookData.weight,
                is_new: bookData.isNew || 0,
                nb_pages: bookData.nbPages,
                isbn: bookData.ISBN,
                paper: !! bookData.paper
              })
            );
          });
        });
        booksCreationPromise.then(function () {
          console.log(booksDataFiles.length + ' books imported from previous AlinaReyes.net books YAML files');
          process.exit(0);
        })
        .done();
      })
      .done();
  })
  .fail(function (err) {
    console.error(err);
    throw err;
  })
  .done();