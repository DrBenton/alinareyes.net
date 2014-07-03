var app = require('../../app');
var modelsMixins = require('../mixins/models-mixins');

var Book = require('./books').model;

// Model definition schema
var BookPaymentSchema = {

  tableName: 'books_payments',
  hasTimestamps: true,

  book: function() {
    return this.hasOne(Book);
  },

  validationRules: {
    payment_id: ['required'],
    book_id: ['required'],
    customer_email: ['required']
  }

};

modelsMixins.applyAutoCheck(BookPaymentSchema);

// Model initialization from schema
var BookPayment = app.get('bookshelf').Model.extend(BookPaymentSchema);


// Collection definition schema
var BookPaymentCollectionSchema = {

  model: BookPayment

};

// Collection initialization from schema
var BookPaymentCollection = app.get('bookshelf').Collection.extend(BookPaymentCollectionSchema);


// Module exports
module.exports = {
  identity: 'books_payments',
  model: BookPayment,
  collection: BookPaymentCollection
};

