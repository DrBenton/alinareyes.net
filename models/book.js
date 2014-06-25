var Waterline = require('waterline');
var _s = require('underscore.string');
var modelsMixins = require('../mixins/models-mixins');

var BookSchema = {

  identity: 'book',
  tableName: 'books',
  connection: 'default',
  schema: true,

  attributes: {
    title_fr: {
      type: 'string',
      required: true,
      size: 255
    },
    desc_fr: {
      type: 'text',
      required: true
    },
    slug: {
      type: 'string',
      index: true
    },
    publication_date: {
      type: 'date'
    },
    price: {
      type: 'float',
      required: true
    },

    title: function (req) {
      // We may add user language management here; but we will only handle french for the moment... :-)
      return this.title_fr;
    },
    desc: function (req) {
      // idem
      return this.desc_fr;
    }
  },

  beforeCreate: function (values, next) {
    console.log('beforeCreate()');
    console.log('values before=', values);
    values.slug = _s.slugify(values.title_fr);
    console.log('values after=', values);
    next();
  }

};
modelsMixins.autoRecordDates(BookSchema);
console.log('BookSchema=', BookSchema)

var Book = Waterline.Collection.extend(BookSchema);


module.exports = Book;

