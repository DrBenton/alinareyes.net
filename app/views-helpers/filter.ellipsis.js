var swig = require('swig');
var _s = require('underscore.string');
var app = require('../../app');

swig.setFilter('ellipsis', function(text, nbWords) {
    var str = String(text)
      , words = str.split(/ +/);

    if (words.length < nbWords) {
      return text;
    }

    return _s.stripTags(words.slice(0, nbWords).join(' ')) + '...';
});

