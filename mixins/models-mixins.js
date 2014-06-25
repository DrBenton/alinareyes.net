var _ = require('lodash');

exports.autoRecordDates = function (collectionSchema) {

  var beforeCreate = collectionSchema.beforeCreate;
  _.extend(collectionSchema, {
    autoCreatedAt: false,
    beforeCreate: function (values, next) {
      console.log('Handle "created_at"...');
      values.created_at = new Date();
      if (beforeCreate) {
        beforeCreate(values, next);
      } else {
        next();
      }
    }
  });

  _.extend(collectionSchema.attributes, {
    created_at: {
      type: 'datetime',
      required: true
    }
  });

};