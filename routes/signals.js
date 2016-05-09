var eventManager = require('../lib/db');
var request = require('request')
var mailer = require('../lib/mailer.js');
var _ = require('underscore');
 
/***************************************************************
 * Signals look like this:

  {
     "eventName": "Large meteor strikes the moon",
     "instancedata": "This one weighed more than 16 megatons!!"
  }

***************************************************************/
var endpointNames = {
    FB: "facebook",
    TWITTER: 'twitter',
    INSTAGRAM: 'instagram',
    SLACK: 'slack',
    SPARK: 'spark',
    TWILLO: 'twillo'
}

var apiProcessesor = {
    handleFB: function (subscription, signal) {
        //TODO
    },
    handleTwitter: function (subscription, signal) {
        //TODO
    },
    handleInstagram: function (subscription, signal) {
        //TODO
    },
    handleSlack: function (subscription, signal) {
        //TODO
    },
    handleSpark: function (subscription, signal) {
        //TODO
    },
    handleTwillo: function (subscription, signal) {
        //TODO
    },
    handleCustom: function (subscription, signal) {
        try {
            request(JSON.parse(subscription.options), function(err, response){
                if(!err && response.statusCode === 200){
                    //TODO:
                }else{
                    //TODO
                }
            })
        } catch (error) {
            //TODO
        }
    }
};

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
    switch (subscription.endpointName) {
        case endpointNames.FB:
            apiProcessesor.handleFB(subscription, signal);
            break;
        case endpointNames.TWITTER:
            apiProcessesor.handleTwitter(subscription, signal);
            break;
        case endpointNames.INSTAGRAM:
            apiProcessesor.handleInstagram(subscription, signal);
            break;
        case endpointNames.SLACK:
            apiProcessesor.handleSlack(subscription, signal);
            break;
        case endpointNames.SPARK:
            apiProcessesor.handleSpark(subscription, signal);
            break;
        case endpointNames.TWILLO:
            apiProcessesor.handleTwillo(subscription, signal);
            break;
        default:
            apiProcessesor.handleCustom(subscription, signal);
            break;
    }
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
            result.processed = true;
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