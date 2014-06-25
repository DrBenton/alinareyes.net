var _s = require('underscore.string');
var modelsMixins = require('../mixins/models-mixins');

var BookSchema = {

  tableName: 'books',
  hasTimestamps: true,

  initialize: function() {
    this.on('saving', this.beforeSave);
  },

  getTitle: function (req) {
    // We may add user language management here; but we will only handle french for the moment... :-)
    return this.get('title_fr');
  },

  getDesc: function (req) {
    // idem
    return this.get('desc_fr');
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

modelsMixins.autoCheck(BookSchema);

module.exports = {
  identity: 'books',
  schema: BookSchema
};

