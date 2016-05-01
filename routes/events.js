var eventManager = require('../lib/db');
var eventTypes = require('../lib/eventTypes');

/** ****************************************
 * All routes return a promise.
 * 
{
"_id": "353dfg34334bbnm34545345",
"eventName": "CUSTOMER.SERVICE.New_Tecket",
"eventType": "EventTypes.SYSTEM_NOTIFICATION"
"eventSource": ['App.CustomerService']
}
********************************************/

exports.registerEvent = function(req, res) {
  var event = req.body;
  return eventManager.register(event);
}

exports.updateEvent = function(req, res) {
  var id = req.params.id;
  var event = req.body;
  return eventManager.update(event, id);
}
 
exports.deleteEvent = function(req, res) {
  var id = req.params.id;

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('events', function(err, collection) {
      collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
        res.send(req.body);
        db.close();
      });
    });
  });
}

exports.findById = function(req, res) {
  var id = req.params.id;

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('events', function(err, collection) {
      collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
        res.send(item);
        db.close();
      });
    });
  });
}

 
exports.findAll = function(req, res) {

  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection('events', function(er, collection) {
      collection.find().toArray(function(err, items) {
        res.send(items);
        db.close();
      });
    });
  });
}
 