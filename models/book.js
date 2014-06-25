var Waterline = require('waterline');

var Book = Waterline.Collection.extend({

  identity: 'book',
  connection: 'default',

  attributes: {
    title: 'string',
    desc: 'string'
  }

});

console.log('book!')
module.exports = Book;

