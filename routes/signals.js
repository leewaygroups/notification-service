var eventManager = require('../lib/db');

var mailer = require('../lib/mailer.js');
var _ = require('underscore');
 
/***************************************************************
 * Signals look like this:

  {
     "eventName": "Large meteor strikes the moon",
     "instancedata": "This one weighed more than 16 megatons!!"
  }

***************************************************************/


function processMatch(subscription, signal) {
    var opts = {
        from: 'Simple Notification Service <12345@gmail.com>',
        to: subscription.alertEndpoint,
        subject: subscription.eventTitle + ' happened at: ' + new Date(),
        body: signal.instancedata
    }

    // Send alert
    mailer.sendMail(opts);
}

exports.processSignal = function (req, res) {
    var signal = req.body;
    console.log('Processing Signal: ' + JSON.stringify(signal));
    eventManager.findByName(signal.eventName).then(function (event) {
        if (event.subscriptions && event.subscriptions.length) {
            var result = {};
            result.processed = processMatch(event.subscriptions, signal);
            result.logged = eventManager.logSignal(signal);
            res.send(result);
        } else {
            res.send();
        }
    });
}
 
 