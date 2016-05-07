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
function emailHandler(subscription, signal) {
    var opts = {
        from: 'Simple Notification Service <12345@gmail.com>',
        to: subscription.endpoint,
        subject: subscription.eventName + ' happened at: ' + new Date(),
        body: signal.instancedata
    }
    
    // Send alert
    mailer.sendMail(opts);
}

function apiHandler(subscription, signal) {
    //TODO
}

function processMatch(subscriptions, signal) {
    for (var i = 0; i < subscriptions.length; i++) {

        switch (subscriptions[i].endpointType) {
            case "EMAIL":
                emailHandler(subscriptions[i], signal);
                break;
            case "API":
                apiHandler(subscriptions[i], signal);
                break;
            default:
                break;
        }
    }

    return true;
}

exports.processSignal = function (req, res) {
    var signal = req.body;
    console.log('Processing Signal: ' + JSON.stringify(signal));
    eventManager.findByName(signal.eventName).then(function (event) {
        if (event.subscriptions && event.subscriptions.length) {
            var result = {};
            result.processed = processMatch(event.subscriptions, signal);
            result.signal = signal;

            result.logged = eventManager.logSignal(result);
            res.send(result);
        } else {
            res.send();
        }
    });
};

exports.getAllSignalLogs = function (req, res) {
    eventManager.getAllSignalLogs().then(function (signalLogs) {
        res.send(signalLogs);
    });
};

exports.getEventSignalLogs = function (req, res) {
    var name = req.params.name;
    eventManager.getEventSignalLogs(name).then(function (signalLogs) {
        res.send(signalLogs);
    });
}; 