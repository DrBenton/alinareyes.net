var _ = require('lodash');
var Checkit = require('checkit');

exports.applyAutoCheck = function (modelSchema) {

  var initialize = modelSchema.initialize;

  _.extend(modelSchema, {

    initialize: function () {
      this.on('saving', this.checkData);
      initialize && initialize.call(this);
    },

    checkData: function () {
      var checkit = Checkit(this.validationRules);
      return checkit.run(this.attributes);
    }
  });


};