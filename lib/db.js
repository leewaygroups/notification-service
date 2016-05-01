var mongoose = require('mongoose');
var Q = require('q');
var _ = require('underscore');
var mongoUri = process.env.MONGO_URI || 'mongodb://localhost/test';
mongoose.connect(mongoUri);

var EventSchema = mongoose.Schema({
    eventName: String,
    eventType: String,
    subscriptions: [] 
    // array of objects where object like {endPointType: "mail", endPoint: emailAddress},
    // {endPointType: "slack", endPoint: slackChannel} 
});

var Event = mongoose.model('Event', EventSchema);

var addEvent = function (event) {
    var deferred = Q.defer();
    var EventInstance = new Event(event);
    EventInstance.save(function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
}

var updateEvent = function (newEvent, id) {
    var deferred = Q.defer();
    Event.findOne({ _id: id }, function (err, event) {
        if (!err) {
            event.eventName = newEvent.eventName;
            event.eventType = newEvent.eventType;
            event.save(function (err, data) {
                if (!err) {
                    deferred.resolve(data);
                } else {
                    deferred.reject(err);
                }
            })
        } else {
            deferred.reject(err);
            console.log("error:event update failed");
        }
    });
    return deferred.promise;
};

var deleteEvent = function (id) {
    var deferred = Q.defer();
    Event.fincOne({ _id: id }, function (err, event) {
        if (!err) {
            event.remove(function (err) {
                if (!err) {
                    deferred.resolve();
                    console.log(event.eventName + " removed");
                } else {
                    deferred.reject(err);
                }
            });
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};


var findEventById = function (id) {
    var deferred = Q.defer();
    Event.findOne({ _id: id }, function (err, event) {
        if (!err) {
            deferred.resolve(event);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
}

var findEventByName = function (name) {
    var deferred = Q.defer();
    Event.findOne({ eventName: name }, function (err, event) {
        if (!err) {
            deferred.resolve(event);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
}


var findAllEvents = function () {
    var deferred = Q.defer();
    Event.findOne({}, function (err, events) {
        if (!err) {
            deferred.resolve(events);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
}

var getEventSubsriptions = function (name) {
    var deferred = Q.defer();
    findEventByName(name).then(function (event) {
        deferred.resolve(event.subscriptions);
    });

    return deferred.promise;
};

var subscribeToEvent = function (name, newSubscr) {
    var deferred = Q.defer();
    findEventByName(name).then(function (event) {
        var subscription = _.find(event.subscriptions, function (subscr) {
            return subscr.endPointType == newSubscr.endPointType && subscr.endPoint == newSubscr.endPoint;
        });
        if (subscription && subscription.length) {
            deferred.resolve();
        } else {
            event.subscriptions.push(newSubscr);
            event.save(function (err, data) {
                if (!err) {
                    deferred.resolve(data);
                } else {
                    deferred.reject(err);
                }
            });
        }
    });

    return deferred.promise;
}

var unSubscribeFromEvent = function (name, newSubscr) {
    var deferred = Q.defer();
    findEventByName(name).then(function (event) {
        var subscriptions = _.filter(event.subscriptions, function (subscr) {
            return subscr.endPointType !== newSubscr.endPointType && subscr.endPoint !== newSubscr.endPoint;
        });

        event.subscriptions = subscriptions;
        event.save(function (err, data) {
            if (!err) {
                deferred.resolve(data);
            } else {
                deferred.reject(err);
            }
        });

    });

    return deferred.promise;
}

var cleardb = function (done) {
    console.log('Clearing Database');
    var deferred = Q.defer();
    Event.remove({}, function (err) {
        if (!err) {
            deferred.resolve(done());
        } else {
            deferred.reject(err);
        }
    });
};

module.exports = {
    register: addEvent,
    update: updateEvent,
    delete: deleteEvent,
    findById: findEventById,
    findAll: findAllEvents,
    findByName: findEventByName,
    subscribe: subscribeToEvent,
    unSubscribe: unSubscribeFromEvent,
    subsriptions: getEventSubsriptions,
    cleardb: cleardb
};