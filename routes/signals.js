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
    var error;
    try {
        mailer.sendMail(opts);
        error = null;
    } catch (err) {
        error = err
    }
    
    return error;
}

function apiHandler(subscription, signal) {
    //TODO
}

function processMatch(subscriptions, signal) {
    var status = [];
    for (var i = 0; i < subscriptions.length; i++) {

        switch (subscriptions[i].endpointType) {
            case "EMAIL":
                var error = emailHandler(subscriptions[i], signal);
                status.push({
                    endpoint: subscriptions[i].endpoint,
                    error: error
                })
                break;
            case "API":
                apiHandler(subscriptions[i], signal);
                break;
            default:
                break;
        }
    }

    return status;
}

exports.processSignal = function (req, res) {
    var signal = req.body;
    console.log('Processing Signal: ' + JSON.stringify(signal));
    eventManager.findByName(signal.eventName).then(function (event) {
        if (event.subscriptions && event.subscriptions.length) {
            var result = {};
            result.endpointsStatus = processMatch(event.subscriptions, signal);
            result.processed = true ;
            result.signal = signal;
            result.dateTime = new Date();

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