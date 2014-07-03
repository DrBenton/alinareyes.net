var _s = require('underscore.string');

var app = require('../../app');
var modelsMixins = require('../mixins/models-mixins');

var appConfig = app.get('config');

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
    return this.get('desc_short_' + locale);
  },

  getPagePreviewUrl: function (pageNum) {
      // Mixing app config, View helper and Model. This is baaaad...
    return app.locals.interpolate(appConfig.books['preview.page.url'], {
      '%book-slug%': this.get('slug'),
      '%page-num%': _s.pad(pageNum, 3, '0')
    });
  },

  virtuals: {
    cover_small_url: function () {
      return app.locals.interpolate(appConfig.books['cover.small.url'], {
        '%base-url%': appConfig.general.baseUrl,
        '%book-slug%': this.get('slug')
      });
    },
    cover_large_url: function () {
      return app.locals.interpolate(appConfig.books['cover.large.url'], {
        '%book-slug%': this.get('slug')
      });
    },
    large_picture_url: function () {
      return this.get('picture_url').replace(/\.([^.]+)$/, '.big.$1');
    }
  },

  toString: function () {
    return this.get('title_fr');
  },

  beforeSave: function () {
    if (!this.id && !this.get('slug')) {
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

