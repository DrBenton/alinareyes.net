var Stripe = require('stripe');
var Q = require('q');
var app = require('../../app');

var appConfig = app.get('config');

exports.processBookPayment = function (book, stripeToken) {

  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here https://manage.stripe.com/account
  var stripe = Stripe(appConfig.stripe.private_key);

  return Q(
    stripe.charges.create({
      amount: book.get('price') * 100, // amount in cents, again
      currency: appConfig.stripe.currency,
      card: stripeToken,
      description: book.get('title_fr') + ' - payinguser@example.com'
    })
  );

};
