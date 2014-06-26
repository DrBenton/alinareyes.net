var _s = require('underscore.string');
var modelsMixins = require('../mixins/models-mixins');

// Model definition schema
var BookSchema = {

  tableName: 'books',
  hasTimestamps: true,

  initialize: function() {
    this.on('saving', this.beforeSave);
  },

  getTitle: function (locale) {
    return this.get('title_' + locale);
  },

  getDesc: function (locale) {
    return this.get('desc_' + locale).replace('*', '');
  },

  getShortDesc: function (locale) {
    var descr = this.get('desc_' + locale);
    return descr.substring(0, descr.indexOf('*'));
  },

  getPictureUrl: function () {
    return this.get('picture_url');
  },

  toString: function () {
    return this.get('title_fr');
  },

  beforeSave: function () {
    if (!this.id) {
      this.set('slug', _s.slugify(this.get('title_fr')));
    }
  },

  validationRules: {
    title_fr: ['required', 'minLength:3'],
    desc_fr: ['required'],
    publication_date: ['required'],
    price: ['required']
  }

};

modelsMixins.applyAutoCheck(BookSchema);


// Collection definition schema
var BookCollectionSchema = {

  getLastBooks: function (limit) {
    var queryData = {
      orderBy: ['created_at', 'desc']
    };
    if (undefined != limit)
      queryData.limit = limit;

    return this.query(queryData).fetch();
  },

  getHighlightedBooks: function (limit) {
    var queryData = {
      where: {
        highlight: 1
      }
    };
    if (undefined != limit)
      queryData.limit = limit;

    return this.query(queryData).fetch();
  }

};


// Module exports
module.exports = {
  identity: 'books',
  modelSchema: BookSchema,
  collectionSchema: BookCollectionSchema
};

